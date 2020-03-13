import Sequelize from 'sequelize';
import config from '../../config/database';

import User from '../../app/models/User';
import RevokedTokens from '../../app/models/RevokedTokens';
import Categories from '../../app/models/Categories';

const connection = new Sequelize(config[process.env.NODE_ENV]);

User.init(connection);
RevokedTokens.init(connection);
Categories.init(connection);

User.associate(connection.models);
RevokedTokens.associate(connection.models);
Categories.associate(connection.models);

export default connection;
