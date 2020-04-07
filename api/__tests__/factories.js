import faker from "faker";
import { v4 as uuidFaker } from "uuid";
import { factory } from "factory-girl";

import models from "../src/app/models";

import { generateTokenCrypto } from "../src/app/utils/index";

factory.define("User", models.User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(12),
});

factory.define("Admin", models.User, {
  name: faker.name.findName(),
  role: "admin",
  email: faker.internet.email(),
  password: faker.internet.password(12),
});

factory.define("RevokedToken", models.RevokedToken, {
  token: generateTokenCrypto(),
  user_id: uuidFaker(),
});

factory.define("Category", models.Category, {
  title: faker.name.title(),
  description: faker.lorem.paragraph(),
});

factory.define("Music", models.Music, {
  link: faker.internet.url(),
  title: faker.name.title(),
  author: faker.name.findName(),
  letter: faker.lorem.paragraphs(),
  description: faker.lorem.paragraph(),
  category_id: uuidFaker(),
});

factory.define("Interpretation", models.Interpretation, {
  interpretation: faker.lorem.paragraphs(),
  music_id: uuidFaker(),
  author_id: uuidFaker(),
});

factory.define("Like", models.Like, {
  like: true,
  dislike: false,
  user_id: uuidFaker(),
  interpretation_id: uuidFaker(),
});

factory.define("Dislike", models.Like, {
  like: false,
  dislike: true,
  user_id: uuidFaker(),
  interpretation_id: uuidFaker(),
});

factory.define("Comment", models.Comment, {
  comment: faker.lorem.paragraph(),
  user_id: uuidFaker(),
  interpretation_id: uuidFaker(),
});

export default factory;
