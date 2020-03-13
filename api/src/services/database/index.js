import Sequelize from 'sequelize';
import config from '../../config/database';

import User from '../../app/models/User';
import RevokedTokens from '../../app/models/RevokedTokens';

const connection = new Sequelize(config[process.env.NODE_ENV]);

User.init(connection);
RevokedTokens.init(connection);

User.associate(connection.models);
RevokedTokens.associate(connection.models);

export default connection;
