// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
}

export async function uploadToCloudinary(localPath, folder = 'zenzv_uploads') {
  if (!process.env.CLOUDINARY_URL) throw new Error('CLOUDINARY_URL not configured');
  const res = await cloudinary.uploader.upload(localPath, {
    folder,
    use_filename: true,
    unique_filename: false,
    resource_type: 'auto',
  });
  try { fs.unlinkSync(localPath); } catch(e){}
  return res.secure_url;
}