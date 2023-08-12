import {Request} from 'express';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const PATREON_WEBHOOK_SECRET = process.env.PATREON_WEBHOOK_SECRET || '';

export const validatePatreonWebhook = (req: Request) => {
  const hash = crypto
    .createHmac('md5', PATREON_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  return req.header('x-patreon-signature') === hash;
};
