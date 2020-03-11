import Sequelize from 'sequelize';
import config from '../config/database';

const connection = new Sequelize(config[process.env.NODE_ENV]);

export default connection;
