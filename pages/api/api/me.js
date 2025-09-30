// pages/api/me.js
import { verifyToken } from '../../../lib/jwt';
import { promises as fs } from 'fs';
import path from 'path';

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
  const auth = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(auth || '');
  if (!payload) return res.status(401).json({ ok:false, error: 'Unauthorized' });

  const users = await readUsers();
  const user = users.find(u => u.id === payload.id);
  if (!user) return res.status(404).json({ ok:false, error: 'User not found' });

  return res.json({ ok:true, user: { id: user.id, username: user.username, createdAt: user.createdAt } });
}
