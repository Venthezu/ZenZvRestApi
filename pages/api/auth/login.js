// pages/api/auth/login.js
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/jwt';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function readUsers(){
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error: 'Method not allowed' });
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ ok:false, error: 'Missing username or password' });

  const users = await readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ ok:false, error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ ok:false, error: 'Invalid credentials' });

  const token = signToken({ id: user.id, username: user.username });
  return res.json({ ok: true, token, user: { id: user.id, username: user.username } });
}