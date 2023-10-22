import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const PATREON_ACCESS_TOKEN = process.env.PATREON_ACCESS_TOKEN!;

export const patreonAxiosClient = axios.create({
  headers: {
    Authorization: `Bearer ${PATREON_ACCESS_TOKEN}`
  }
});
