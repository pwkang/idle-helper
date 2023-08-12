import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import loadRoutes from './handler/routes.handler';
import {logger} from '@idle-helper/utils';

dotenv.config();

const API_PORT = process.env.API_PORT || 3000;

export const startServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  // app.use(morgan('combined'));
  app.use('/', await loadRoutes());

  app.listen(API_PORT, () => {
    logger({
      message: `Server is listening on port ${API_PORT}`,
    });
  });
};
