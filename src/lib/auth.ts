import bcrypt from 'bcrypt';
import { initializeDatabase } from './db';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  plainTextPassword: string, 
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

export async function registerUser(username: string, password: string) {
  const db = await initializeDatabase();
  const passwordHash = await hashPassword(password);

  try {
    const result = await db.run(
      'INSERT INTO Users (username, passwordHash) VALUES (?, ?)', 
      [username, passwordHash]
    );
    return result.lastID;
  } catch (error) {
    if ((error as any).code === 'SQLITE_CONSTRAINT') {
      throw new Error('Username already exists');
    }
    throw error;
  }
}

export async function loginUser(username: string, password: string) {
  const db = await initializeDatabase();
  
  const user = await db.get(
    'SELECT * FROM Users WHERE username = ?', 
    [username]
  );

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user;
}
