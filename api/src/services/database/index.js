import Sequelize from 'sequelize';
import config from '../../config/database';

import User from '../../app/models/User';
import RevokedToken from '../../app/models/RevokedToken';
import Category from '../../app/models/Category';
import Music from '../../app/models/Music';
import Interpretation from '../../app/models/Interpretation';
import Comment from '../../app/models/Comment';
import Like from '../../app/models/Like';

const connection = new Sequelize(config[process.env.NODE_ENV]);

User.init(connection);
RevokedToken.init(connection);
Category.init(connection);
Music.init(connection);
Interpretation.init(connection);
Comment.init(connection);
Like.init(connection);

User.associate(connection.models);
RevokedToken.associate(connection.models);
Category.associate(connection.models);
Music.associate(connection.models);
Interpretation.associate(connection.models);
Comment.associate(connection.models);
Like.associate(connection.models);

export default connection;
