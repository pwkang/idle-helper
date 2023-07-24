import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import {logger} from '@idle-helper/utils';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB_NAME || 'epic-helper';

const client = mongoose.createConnection(uri, {
  connectTimeoutMS: 10000,
});

export const mongoClient = client.useDb(dbName);
mongoClient.on('connected', () => {
  logger({
    message: 'Connected to MongoDB',
  });
});

mongoClient.on('error', (err) => {
  logger({
    message: err.message,
    logLevel: 'error',
  });
});

mongoClient.on('disconnected', () => {
  logger({
    message: 'Disconnected from MongoDB',
    logLevel: 'warn',
  });
});

mongoClient.on('reconnected', () => {
  logger({
    message: 'Reconnected to MongoDB',
  });
});
