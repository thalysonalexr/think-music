import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function generateTokenCrypto(size = 20) {
  return crypto.randomBytes(size).toString('hex');
}

export function generateTokenJwt(secretKey, payload = {}) {
  return jwt.sign(payload, secretKey, {
    expiresIn: 86400
  });
}
