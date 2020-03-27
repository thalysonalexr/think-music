import Sequelize from 'sequelize';

import config from '../../config/database';

import Category from '../../app/models/Category';
import Comment from '../../app/models/Comment';
import Interpretation from '../../app/models/Interpretation';
import Like from '../../app/models/Like';
import Music from '../../app/models/Music';
import RevokedToken from '../../app/models/RevokedToken';
import User from '../../app/models/User';

const connection = new Sequelize(config[process.env.NODE_ENV]);

Category.init(connection);
Comment.init(connection);
Interpretation.init(connection);
Like.init(connection);
Music.init(connection);
RevokedToken.init(connection);
User.init(connection);

Category.associate(connection.models);
Comment.associate(connection.models);
Interpretation.associate(connection.models);
Like.associate(connection.models);
Music.associate(connection.models);
RevokedToken.associate(connection.models);
User.associate(connection.models);

export default connection;
