import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function generateTokenCrypto() {
  return crypto.randomBytes(20).toString('hex');
}

export function generateTokenJwt(params = {}) {
  return jwt.sign(params, process.env.TM_SECRET, {
    expiresIn: 86400
  });
}
