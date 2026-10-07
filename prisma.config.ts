// import 'dotenv/config';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config();

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
