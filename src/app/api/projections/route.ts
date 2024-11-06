import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(request: NextRequest) {
  // Verify authentication
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    // Get year from query parameters
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    if (!year) {
      return NextResponse.json({ error: 'Year is required' }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Fetch revenues by month
    const revenues = await db.all(`
      SELECT month, SUM(amount) as totalRevenue
      FROM Revenues
      WHERE userId = ? AND year = ?
      GROUP BY month
    `, [userId, year]);

    // Fetch expenses by month
    const expenses = await db.all(`
      SELECT month, SUM(amount) as totalExpenses
      FROM Expenses
      WHERE userId = ? AND year = ?
      GROUP BY month
    `, [userId, year]);

    // Combine revenues and expenses
    const projections = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const revenueData = revenues.find(r => r.month === month);
      const expenseData = expenses.find(e => e.month === month);

      return {
        month,
        totalRevenue: revenueData ? revenueData.totalRevenue : 0,
        totalExpenses: expenseData ? expenseData.totalExpenses : 0,
        netProfit: (revenueData ? revenueData.totalRevenue : 0) - 
                   (expenseData ? expenseData.totalExpenses : 0)
      };
    });

    return NextResponse.json(projections);
  } catch (error) {
    console.error('Projections fetch error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
