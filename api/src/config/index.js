const env = {
  development: '.env.dev',
  test: '.env.test',
  production: '.env'
}

require('dotenv').config({
  path: env[process.env.NODE_ENV]
});
