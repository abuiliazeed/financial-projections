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
    const revenueTypeId = searchParams.get('revenueTypeId');

    // Initialize database
    const db = await initializeDatabase();

    // Build dynamic query
    let query = `
      SELECT r.id, r.year, r.month, r.amount, rt.name as revenueTypeName
      FROM Revenues r
      JOIN RevenueTypes rt ON r.revenueTypeId = rt.id
      WHERE r.userId = ?
    `;
    const params: any[] = [userId];

    if (year) {
      query += ' AND r.year = ?';
      params.push(parseInt(year));
    }

    if (month) {
      query += ' AND r.month = ?';
      params.push(parseInt(month));
    }

    if (revenueTypeId) {
      query += ' AND r.revenueTypeId = ?';
      params.push(parseInt(revenueTypeId));
    }

    // Fetch revenues
    const revenues = await db.all(query, params);

    return NextResponse.json(revenues);
  } catch (error) {
    console.error('Revenues fetch error:', error);
    
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
    const { year, month, revenueTypeId, amount } = await request.json();

    // Validate input
    if (!year || !month || !revenueTypeId || amount === undefined) {
      return NextResponse.json({ 
        error: 'Year, month, revenue type, and amount are required' 
      }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Verify revenue type belongs to user
    const revenueType = await db.get(`
      SELECT id FROM RevenueTypes 
      WHERE id = ? AND userId = ?
    `, [revenueTypeId, userId]);

    if (!revenueType) {
      return NextResponse.json({ error: 'Invalid revenue type' }, { status: 400 });
    }

    // Insert new revenue
    const result = await db.run(`
      INSERT INTO Revenues (userId, year, month, revenueTypeId, amount) 
      VALUES (?, ?, ?, ?, ?)
    `, [userId, year, month, revenueTypeId, amount]);

    return NextResponse.json({ 
      id: result.lastID, 
      year, 
      month, 
      revenueTypeId, 
      amount 
    }, { status: 201 });
  } catch (error) {
    console.error('Create revenue error:', error);
    
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
    const { id, year, month, revenueTypeId, amount } = await request.json();

    // Validate input
    if (!id || !year || !month || !revenueTypeId || amount === undefined) {
      return NextResponse.json({ 
        error: 'ID, year, month, revenue type, and amount are required' 
      }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Verify revenue belongs to user and revenue type is valid
    const revenue = await db.get(`
      SELECT id FROM Revenues 
      WHERE id = ? AND userId = ?
    `, [id, userId]);

    const revenueType = await db.get(`
      SELECT id FROM RevenueTypes 
      WHERE id = ? AND userId = ?
    `, [revenueTypeId, userId]);

    if (!revenue || !revenueType) {
      return NextResponse.json({ error: 'Invalid revenue or revenue type' }, { status: 400 });
    }

    // Update revenue
    await db.run(`
      UPDATE Revenues 
      SET year = ?, month = ?, revenueTypeId = ?, amount = ?
      WHERE id = ? AND userId = ?
    `, [year, month, revenueTypeId, amount, id, userId]);

    return NextResponse.json({ 
      id, 
      year, 
      month, 
      revenueTypeId, 
      amount 
    });
  } catch (error) {
    console.error('Update revenue error:', error);
    
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
      return NextResponse.json({ error: 'Revenue ID is required' }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Delete revenue
    await db.run(`
      DELETE FROM Revenues 
      WHERE id = ? AND userId = ?
    `, [id, userId]);

    return NextResponse.json({ message: 'Revenue deleted successfully' });
  } catch (error) {
    console.error('Delete revenue error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
