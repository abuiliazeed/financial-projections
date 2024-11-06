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

    // Initialize database
    const db = await initializeDatabase();

    // Fetch expense types for the user
    const expenseTypes = await db.all(`
      SELECT id, name 
      FROM ExpenseTypes 
      WHERE userId = ?
    `, [userId]);

    return NextResponse.json(expenseTypes);
  } catch (error) {
    console.error('Expense types fetch error:', error);
    
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
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Expense type name is required' }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Insert new expense type
    const result = await db.run(`
      INSERT INTO ExpenseTypes (userId, name) 
      VALUES (?, ?)
    `, [userId, name]);

    return NextResponse.json({ 
      id: result.lastID, 
      name 
    }, { status: 201 });
  } catch (error) {
    console.error('Create expense type error:', error);
    
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
    const { id, name } = await request.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'Expense type ID and name are required' }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Update expense type
    await db.run(`
      UPDATE ExpenseTypes 
      SET name = ? 
      WHERE id = ? AND userId = ?
    `, [name, id, userId]);

    return NextResponse.json({ 
      id, 
      name 
    });
  } catch (error) {
    console.error('Update expense type error:', error);
    
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
      return NextResponse.json({ error: 'Expense type ID is required' }, { status: 400 });
    }

    // Initialize database
    const db = await initializeDatabase();

    // Delete expense type
    await db.run(`
      DELETE FROM ExpenseTypes 
      WHERE id = ? AND userId = ?
    `, [id, userId]);

    return NextResponse.json({ message: 'Expense type deleted successfully' });
  } catch (error) {
    console.error('Delete expense type error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
