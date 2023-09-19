import * as Sentry from '@sentry/node';
import {ProfilingIntegration} from '@sentry/profiling-node';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0, // Profiling sample rate is relative to tracesSampleRate
    integrations: [
      // Add profiling integration to list of integrations
      new ProfilingIntegration(),
    ],
  });
};
