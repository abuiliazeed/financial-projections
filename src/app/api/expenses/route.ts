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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const expenseTypeId = searchParams.get('expenseTypeId');

    // Initialize database
    const db = await initializeDatabase();

    // Build dynamic query
    let query = `
      SELECT e.id, e.year, e.month, e.amount, et.name as expenseTypeName
      FROM Expenses e
      JOIN ExpenseTypes et ON e.expenseTypeId = et.id
      WHERE e.userId = ?
    `;
    const params: any[] = [userId];

    if (year) {
      query += ' AND e.year = ?';
      params.push(parseInt(year));
    }

    if (month) {
      query += ' AND e.month = ?';
      params.push(parseInt(month));
    }

    if (expenseTypeId) {
      query += ' AND e.expenseTypeId = ?';
      params.push(parseInt(expenseTypeId));
    }

    // Fetch expenses
    const expenses = await db.all(query, params);

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Expenses fetch error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Verify authentication
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    // Parse request body
    const { year, month, expenseTypeId, amount } = await request.json();

    // Validate input
    if (!year || !month || !expenseTypeId || amount === undefined) {
      return NextResponse.json({ 
        error: 'Year, month, expense type, and amount are required' 
      }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Verify expense type belongs to user
    const expenseType = await db.get(`
      SELECT id FROM ExpenseTypes 
      WHERE id = ? AND userId = ?
    `, [expenseTypeId, userId]);

    if (!expenseType) {
      return NextResponse.json({ error: 'Invalid expense type' }, { status: 400 });
    }

    // Insert new expense
    const result = await db.run(`
      INSERT INTO Expenses (userId, year, month, expenseTypeId, amount) 
      VALUES (?, ?, ?, ?, ?)
    `, [userId, year, month, expenseTypeId, amount]);

    return NextResponse.json({ 
      id: result.lastID, 
      year, 
      month, 
      expenseTypeId, 
      amount 
    }, { status: 201 });
  } catch (error) {
    console.error('Create expense error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Verify authentication
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    // Parse request body
    const { id, year, month, expenseTypeId, amount } = await request.json();

    // Validate input
    if (!id || !year || !month || !expenseTypeId || amount === undefined) {
      return NextResponse.json({ 
        error: 'ID, year, month, expense type, and amount are required' 
      }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Verify expense belongs to user and expense type is valid
    const expense = await db.get(`
      SELECT id FROM Expenses 
      WHERE id = ? AND userId = ?
    `, [id, userId]);

    const expenseType = await db.get(`
      SELECT id FROM ExpenseTypes 
      WHERE id = ? AND userId = ?
    `, [expenseTypeId, userId]);

    if (!expense || !expenseType) {
      return NextResponse.json({ error: 'Invalid expense or expense type' }, { status: 400 });
    }

    // Update expense
    await db.run(`
      UPDATE Expenses 
      SET year = ?, month = ?, expenseTypeId = ?, amount = ?
      WHERE id = ? AND userId = ?
    `, [year, month, expenseTypeId, amount, id, userId]);

    return NextResponse.json({ 
      id, 
      year, 
      month, 
      expenseTypeId, 
      amount 
    });
  } catch (error) {
    console.error('Update expense error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Verify authentication
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    // Parse request body
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Delete expense
    await db.run(`
      DELETE FROM Expenses 
      WHERE id = ? AND userId = ?
    `, [id, userId]);

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
