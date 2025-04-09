/* eslint-disable @typescript-eslint/no-unused-vars */
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService();

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(
      configService.get<string>('crtypto.ENCRYPTION_KEY') ?? '',
      'utf8',
    ),
    iv,
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(
      configService.get<string>('crtypto.ENCRYPTION_KEY') ?? '',
      'utf8',
    ),
    iv,
  );
  let decrypted = decipher.update(encryptedText.toString('hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
