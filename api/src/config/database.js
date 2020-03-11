module.exports = {
  migrations: {
    dialect: 'postgres',
    host: 'localhost',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5433,
    database: 'thinkmusic',
    define: {
      timestamps: true,
      underscored: true
    }
  },
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: 'thinkmusic',
    define: {
      timestamps: true,
      underscored: true
    }
  },
  production: {}
};
