import {REST} from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

export const djsRestClient = new REST().setToken(process.env.BOT_TOKEN!);
