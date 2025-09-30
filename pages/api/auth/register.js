// pages/api/auth/register.js
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
async function writeUsers(users){
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error: 'Method not allowed' });
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ ok:false, error: 'Missing username or password' });

  const users = await readUsers();
  if (users.find(u => u.username === username)) return res.status(409).json({ ok:false, error: 'Username already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), username, password: hash, createdAt: new Date().toISOString() };
  users.push(user);
  await writeUsers(users);

  const token = signToken({ id: user.id, username: user.username });
  return res.json({ ok: true, token, user: { id: user.id, username: user.username, createdAt: user.createdAt } });
}