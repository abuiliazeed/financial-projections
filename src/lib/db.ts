import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function initializeDatabase() {
  if (db) return db;

  db = await open({
    filename: path.resolve('./financial-projections.db'),
    driver: sqlite3.Database
  });

  // Create Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    )
  `);

  // Create ExpenseTypes Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ExpenseTypes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES Users(id)
    )
  `);

  // Create RevenueTypes Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS RevenueTypes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES Users(id)
    )
  `);

  // Create Expenses Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      year INTEGER,
      month INTEGER,
      expenseTypeId INTEGER,
      amount REAL,
      FOREIGN KEY(userId) REFERENCES Users(id),
      FOREIGN KEY(expenseTypeId) REFERENCES ExpenseTypes(id)
    )
  `);

  // Create Revenues Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Revenues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      year INTEGER,
      month INTEGER,
      revenueTypeId INTEGER,
      amount REAL,
      FOREIGN KEY(userId) REFERENCES Users(id),
      FOREIGN KEY(revenueTypeId) REFERENCES RevenueTypes(id)
    )
  `);

  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}
