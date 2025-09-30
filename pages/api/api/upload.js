// pages/api/upload.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../../../lib/jwt';
let uploadToCloudinary;
if (process.env.USE_CLOUDINARY === 'true') {
  try { uploadToCloudinary = (await import('../../../lib/cloudinary')).uploadToCloudinary; } catch(e) { uploadToCloudinary = null; }
}

export const config = { api: { bodyParser: false } };

const ALLOWED = ['image/', 'video/'];

function isAllowed(mime) {
  if (!mime) return false;
  return ALLOWED.some(pref => mime.startsWith(pref));
}

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error: 'Method not allowed' });

  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token || '');
  if (!user) return res.status(401).json({ ok:false, error: 'Unauthorized' });

  const form = new formidable.IncomingForm({
    multiples: false,
    maxFileSize: (parseInt(process.env.UPLOAD_MAX_MB || '20') * 1024 * 1024),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('upload parse error', err);
      return res.status(400).json({ ok:false, error: err.message || 'Upload error' });
    }

    const file = files.file;
    const f = Array.isArray(file) ? file[0] : file;
    if (!f) return res.status(400).json({ ok:false, error: 'No file uploaded (field name: file)' });
    const mimeType = f.mimetype || f.type || '';
    if (!isAllowed(mimeType)) {
      try { fs.unlinkSync(f.filepath || f.path); } catch(e){}
      return res.status(400).json({ ok:false, error: 'File type not allowed' });
    }

    try {
      // If Cloudinary configured / USE_CLOUDINARY=true, upload there
      if (process.env.USE_CLOUDINARY === 'true' && uploadToCloudinary) {
        const url = await uploadToCloudinary(f.filepath);
        return res.json({ ok:true, url, filename: path.basename(url), size: f.size, mime: mimeType, uploader: user.username });
      }

      // Local storage
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      fs.mkdirSync(uploadDir, { recursive: true });
      const ext = path.extname(f.originalFilename || f.newFilename || f.filepath) || '';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2,9)}${ext}`;
      const dest = path.join(uploadDir, filename);

      fs.copyFileSync(f.filepath || f.path, dest);
      try { fs.unlinkSync(f.filepath || f.path); } catch(e){}

      const base = (process.env.NEXT_PUBLIC_BASE_URL || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`).replace(/\/$/, '');
      const url = `${base}/uploads/${encodeURIComponent(filename)}`;

      return res.json({ ok:true, url, filename, size: f.size, mime: mimeType, uploader: user.username });
    } catch (e) {
      console.error('save file error', e);
      return res.status(500).json({ ok:false, error: 'Failed to save file' });
    }
  });
}
