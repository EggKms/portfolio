import * as crypto from 'crypto';

export function decryptData(encryptedData: string, key: string): any {
  const iv = Buffer.alloc(16, 0); // Initialization vector
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}
