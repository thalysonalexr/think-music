import faker from "faker";
import { v4 as uuidFaker } from "uuid";
import { factory } from "factory-girl";

import User from "../src/app/models/User";
import RevokedToken from "../src/app/models/RevokedToken";
import Category from "../src/app/models/Category";
import Music from "../src/app/models/Music";

import { generateTokenCrypto } from "../src/app/utils/index";

factory.define("User", User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(12),
});

factory.define("Admin", User, {
  name: faker.name.findName(),
  role: "admin",
  email: faker.internet.email(),
  password: faker.internet.password(12),
});

factory.define("RevokedToken", RevokedToken, {
  token: generateTokenCrypto(),
  user_id: uuidFaker(),
});

factory.define("Category", Category, {
  title: faker.name.title(),
  description: faker.lorem.paragraph(),
});

factory.define("Music", Music, {
  link: faker.internet.url(),
  title: faker.name.title(),
  author: faker.name.findName(),
  letter: faker.lorem.paragraphs(),
  description: faker.lorem.paragraph(),
  category_id: uuidFaker(),
});

export default factory;
