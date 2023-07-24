import * as Sentry from '@sentry/node';
import * as dotenv from 'dotenv';

dotenv.config();

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.5,
  });
};
