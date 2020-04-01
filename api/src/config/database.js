if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const env = {
  development: '.env.dev',
  test: '.env.test',
  production: '.env'
}

require('dotenv').config({
  path: env[process.env.NODE_ENV]
});

module.exports = {
  development: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    define: {
      timestamps: true,
      underscored: true
    }
  },
  test: {
    dialect: process.env.DB_DIALECT,
    database: process.env.DB_DATABASE,
    storage: process.env.DB_STORAGE,
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  },
  production: {}
};
