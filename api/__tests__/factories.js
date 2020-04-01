import faker from 'faker';
import { factory } from 'factory-girl';
import User from '../src/app/models/User';
import RevokedToken from '../src/app/models/RevokedToken';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(12)
});

factory.define('RevokedToken', RevokedToken, {
  token: '21341312312412312',
  user_id: 1
});

export default factory;
