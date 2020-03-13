import Sequelize from 'sequelize';
import config from '../../config/database';

import User from '../../app/models/User';

const connection = new Sequelize(config[process.env.NODE_ENV]);

User.init(connection);

export default connection;
