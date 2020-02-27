import { config } from 'dotenv';

const env = {
  development: '.env.dev',
  test: '.env.test',
  production: '.env'
}

config({
  path: env[process.env.NODE_ENV]
});
