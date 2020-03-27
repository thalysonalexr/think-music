module.exports = {
  development: {
    dialect: 'postgres',
    host: 'postgres',
    username: 'root',
    password: 'root',
    port: 5432,
    database: 'thinkmusic',
    define: {
      timestamps: true,
      underscored: true
    }
  },
  production: {}
};
