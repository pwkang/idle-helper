<img alt='logo' src="https://cdn.discordapp.com/app-icons/1133034852611018783/de3149b3c0adc28e8838472ace920803.png">

# IDLE Helper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](https://opensource.org/licenses/MIT) [![NodeJS](https://img.shields.io/badge/node.js-^18.15-blue)](https://nodejs.org/)

Discord bot. A reminder & utilities bot for [IDLE FARM](https://top.gg/bot/1085406806492319784).

--- 

## Guide to start the bot

1. Install node.js
2. Install pnpm if you haven't

    ```bash
    npm install -g pnpm
    ```

3. Install dependencies

    ```bash
    pnpm install
    pnpm run build:shared
    pnpm run build:bot
    ```

4. Copy `.env.example` to `.env` and fill in the required fields

    ```dotenv
    BOT_TOKEN= # Your bot token
    NODE_ENV= # development or production
    BOT_PREFIX= # Bot prefix
    MONGO_URI= # MongoDB URI e.g. mongodb://localhost:27017/
    MONGO_DB_NAME= # MongoDB database name e.g. epic_helper
    REDIS_URL= # Redis URL
    TOTAL_CLUSTERS= # Total number of shards
    TOTAL_SHARDS= # Total number of shards
    DEV_PREFIX= # (Optional) Dev prefix, for dev only commands
    DEVS_ID= # (Optional) Devs' ID, separated by commas, only whitelisted users can use dev commands
    SENTRY_DSN= # (Optional) Sentry DSN, if you want to use Sentry for error tracking
    PATREON_CAMPAIGN_ID= # (Optional) Patreon campaign ID
    PATREON_ACCESS_TOKEN= # (Optional) Patreon access token
    PATREON_WEBHOOK_TOKEN= # (Optional) Patreon webhook token
    API_PORT= # (Optional) API port, for receiving webhooks from Patreon
    CONTENTFUL_SPACE_ID= # (Optional) Contentful space ID, sources of commands in bot help
    CONTENTFUL_ACCESS_TOKEN= # (Optional) Contentful access token
    ```
5. Setup MongoDB and Redis
6. Start bot for development
   ```bash
   # NODE_ENV=development
   pnpm run dev:bot 
   ```
   or for production
   ```bash
    # NODE_ENV=production
   pnpm run prod:bot
   ```

--- 

## Support

Consider to star this repository if you find this bot useful. If you have any questions or need help, feel free to join
our [Discord server](https://discord.gg/magXasew7C)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
