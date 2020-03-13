import Sequelize from 'sequelize';
import config from '../../config/database';

import User from '../../app/models/User';
import RevokedToken from '../../app/models/RevokedToken';
import Category from '../../app/models/Category';
import Music from '../../app/models/Music';

const connection = new Sequelize(config[process.env.NODE_ENV]);

User.init(connection);
RevokedToken.init(connection);
Category.init(connection);
Music.init(connection);

User.associate(connection.models);
RevokedToken.associate(connection.models);
Category.associate(connection.models);
Music.associate(connection.models);

export default connection;
