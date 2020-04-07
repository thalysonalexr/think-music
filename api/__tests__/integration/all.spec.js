import request from "supertest";
import nodemailer from "nodemailer";

import app from "../../src/app";
import factory from "../factories";
import truncate from "../utils/truncate";
import sequelize from "../../src/services/database";

import { generateTokenCrypto } from "../../src/app/utils";

jest.mock("nodemailer");

const transportMock = {
  sendMail: jest.fn(),
  use: jest.fn(),
};

beforeAll(async () => {
  await sequelize.sync({ force: true });
  nodemailer.createTransport.mockReturnValue(transportMock);
});

beforeEach(async () => {
  await truncate();
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});

describe("Home docs", () => {
  it("should be able access links documentation api", async () => {
    const response = await request(app).get("/v1");

    expect(response.status).toBe(200);
  });
});

describe("Authentication", () => {
  it("should receive Jwt token and user info when authenticated with valid credentials", async () => {
    const user = await factory.create("User", {
      password: "12345",
    });

    const response = await request(app).post("/v1/auth/authenticate").send({
      email: user.email,
      password: "12345",
    });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String),
      })
    );
  });

  it("should be not able authenticate user with invalid password", async () => {
    const user = await factory.create("User", {
      password: "12345",
    });

    const response = await request(app).post("/v1/auth/authenticate").send({
      email: user.email,
      password: "12344",
    });

    expect(response.status).toBe(401);
  });

  it("should be not able authenticate user with email not registered", async () => {
    await factory.create("User", {
      email: "contact@thalysonalexr.com",
    });

    const response = await request(app).post("/v1/auth/authenticate").send({
      email: "contact@thalyson.com",
      password: "12345",
    });

    expect(response.status).toBe(401);
  });

  it("should be not able authenticate user with wrong content body", async () => {
    const user = await factory.create("User");

    const response = await request(app).post("/v1/auth/authenticate").send({
      email: user.email,
    });

    expect(response.status).toBe(400);
  });

  it("should be able register new user and get token to authenticate", async () => {
    const user = {
      name: "Thalyson Rodrigues",
      email: "thalyson@email.com",
      password: "12345",
    };

    const response = await request(app).post("/v1/auth/register").send(user);

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String),
      })
    );
  });

  it("should be register new user with malformatted data", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      email: "contactthalysonalexr.com",
    });

    expect(response.status).toBe(400);
  });

  it("should be not able access private route without token", async () => {
    const response = await request(app).post("/v1/admin").send({
      name: "Thalyson Rodrigues",
      email: "contact@thalysonalexr.com",
      password: "12345",
    });

    expect(response.status).toBe(401);
  });

  it("should be not able access private route with token without flag", async () => {
    const admin = await factory.create("User");

    admin.role = "admin";
    await admin.save();

    const response = await request(app)
      .post("/v1/admin")
      .send({
        name: "Thalyson Rodrigues",
        email: "contact@thalysonalexr.com",
        password: "12345",
      })
      .set("Authorization", await admin.generateTokenJwt());

    expect(response.status).toBe(401);
  });

  it("should be not able access private route with token malformatted", async () => {
    const admin = await factory.create("User");

    admin.role = "admin";
    await admin.save();

    const response = await request(app)
      .post("/v1/admin")
      .send({
        name: "Thalyson Rodrigues",
        email: "contact@thalysonalexr.com",
        password: "12345",
      })
      .set("Authorization", `notbearer ${await admin.generateTokenJwt()}`);

    expect(response.status).toBe(401);
  });

  it("should be not able access private route with invalid token", async () => {
    const response = await request(app)
      .post("/v1/admin")
      .send({
        name: "Thalyson Rodrigues",
        email: "contact@thalysonalexr.com",
        password: "12345",
      })
      .set("Authorization", "Bearer 2a1ab3a12b3ab1ab2a3b1b2a3a1a2");

    expect(response.status).toBe(401);
  });

  it("should be not able access private route with token default user", async () => {
    const user = await factory.create("User");

    const response = await request(app)
      .post("/v1/admin")
      .send({
        name: "Thalyson Rodrigues",
        email: "contact@thalysonalexr.com",
        password: "12345",
      })
      .set("Authorization", `Bearer ${await user.generateTokenJwt()}`);

    expect(response.status).toBe(403);
  });

  it("should be not able access private route with role user disabled", async () => {
    const user = await factory.create("User");

    user.role = "disabled";
    await user.save();

    const response = await request(app)
      .post("/v1/admin")
      .send({
        name: "Thalyson Rodrigues",
        email: "contact@thalysonalexr.com",
        password: "12345",
      })
      .set("Authorization", `Bearer ${await user.generateTokenJwt()}`);

    expect(response.status).toBe(422);
  });

  it("should be able register new user admin and get token to authenticate", async () => {
    const admin = await factory.create("User");

    admin.role = "admin";
    await admin.save();

    const response = await request(app)
      .post("/v1/admin")
      .send({
        name: "Thalyson Rodrigues",
        email: "thalyson@email.com",
        password: "12345",
      })
      .set("Authorization", `Bearer ${await admin.generateTokenJwt()}`);

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String),
      })
    );
  });

  it("should be not able to register new user that has been registered", async () => {
    const user = await factory.create("User");

    const response = await request(app).post("/v1/auth/register").send({
      name: user.name,
      email: user.email,
      password: "12345",
    });

    expect(response.status).toBe(409);
  });

  it("should be not able init password recovery because user not exists", async () => {
    const response = await request(app).post("/v1/auth/forgot_password").send({
      email: "notexists@email.com",
    });

    expect(response.status).toBe(404);
  });

  it("should be able init password recovery", async () => {
    const user = await factory.create("User");

    const response = await request(app).post("/v1/auth/forgot_password").send({
      email: user.email,
    });

    expect(transportMock.sendMail).toHaveBeenCalledTimes(1);
    expect(transportMock.sendMail.mock.calls[0][0].to).toBe(user.email);
    expect(response.status).toBe(204);
  });

  it("should be not able reset password because user not exists", async () => {
    const response = await request(app).post("/v1/auth/reset_password").send({
      email: "usernotexists@email.com",
      password: "newpassword",
      token: "anytoken",
    });

    expect(response.status).toBe(404);
  });

  it("should be not able reset password because token already used", async () => {
    const user = await factory.create("User");

    const token = generateTokenCrypto();

    const now = new Date();
    now.setHours(now.getHours() + 1);

    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    await user.save();

    await factory.create("RevokedToken", {
      token,
      user_id: user.id,
    });

    const response = await request(app).post("/v1/auth/reset_password").send({
      email: user.email,
      password: "newpassword",
      token,
    });

    expect(response.status).toBe(401);
  });

  it("should be not able reset password because token does not belong to the user", async () => {
    const user = await factory.create("User");

    const token = generateTokenCrypto();

    const now = new Date();
    now.setHours(now.getHours() + 1);

    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    await user.save();

    const response = await request(app).post("/v1/auth/reset_password").send({
      email: user.email,
      password: "newpassword",
      token: "othertoken",
    });

    expect(response.status).toBe(401);
  });

  it("should be not able reset password because token expired", async () => {
    const user = await factory.create("User");

    const token = generateTokenCrypto();

    const now = new Date();
    now.setHours(now.getHours() - 1);

    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    await user.save();

    const response = await request(app).post("/v1/auth/reset_password").send({
      email: user.email,
      password: "newpassword",
      token,
    });

    expect(response.status).toBe(401);
  });

  it("should be not able reset password", async () => {
    const user = await factory.create("User");

    const token = generateTokenCrypto();

    const now = new Date();
    now.setHours(now.getHours() + 1);

    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    await user.save();

    const response = await request(app).post("/v1/auth/reset_password").send({
      email: user.email,
      password: "newpassword",
      token,
    });

    expect(response.status).toBe(204);
  });
});

describe("Admin actions", () => {
  it("should be able not disable user because wrong uuid in params request", async () => {
    const response = await request(app)
      .post(`/v1/admin/wronguuid/enable?status=false`)
      .set("Authorization", `Bearer anytoken`);

    expect(response.status).toBe(400);
  });

  it("should be able not disable user because user not exists", async () => {
    const user = await factory.create("User");
    const uuid = user.id; // uuid valid
    await user.destroy();

    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const response = await request(app)
      .post(`/v1/admin/${uuid}/enable?status=true`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should be able disable user", async () => {
    const user = await factory.create("User");
    const uuid = user.id; // uuid valid

    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const response = await request(app)
      .post(`/v1/admin/${uuid}/enable?status=false`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should be able enable user", async () => {
    const user = await factory.create("User");
    const uuid = user.id; // uuid valid

    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const response = await request(app)
      .post(`/v1/admin/${uuid}/enable?status=true`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

describe("User", () => {
  it("should be able list users with id and name", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const response = await request(app)
      .get("/v1/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        docs: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        ]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    );
  });

  it("should be able list users with all fields", async () => {
    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const response = await request(app)
      .get("/v1/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        docs: expect.arrayContaining([expect.any(Object)]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    );
  });

  it("should be not able list without token", async () => {
    const response = await request(app).get("/v1/users");

    expect(response.status).toBe(400);
  });

  it("should be not able show details user because bad params", async () => {
    const response = await request(app).get("/v1/users/notuuid");

    expect(response.status).toBe(400);
  });

  it("should be bot able show details user because user not exists", async () => {
    const user = await factory.create("User");
    const uuid = user.id;
    await user.destroy();

    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const response = await request(app)
      .get(`/v1/users/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should be able show details user with id and name", async () => {
    const user1 = await factory.create("User");
    const user2 = await factory.create("User", {
      email: "contact@email.com",
    });
    const token = await user1.generateTokenJwt();

    const response = await request(app)
      .get(`/v1/users/${user2.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      })
    );
  });

  it("should be able show details user with all fields", async () => {
    const user = await factory.create("User");
    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const response = await request(app)
      .get(`/v1/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        user: expect.any(Object),
      })
    );
  });

  it("should be not able update user with bad body", async () => {
    const user = await factory.create("User");
    const uuid = user.id;

    const response = await request(app).put(`/v1/users/${uuid}`);

    expect(response.status).toBe(400);
  });

  it("should be not able update user with not owner or admin", async () => {
    const user1 = await factory.create("User", {
      email: "contact@thalyson.com",
    });

    const user2 = await factory.create("User");
    const token = await user2.generateTokenJwt();

    const response = await request(app)
      .put(`/v1/users/${user1.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Thalyson Rodrigues",
        email: "thalyson@email.com",
      });

    expect(response.status).toBe(403);
  });

  it("should be not able because user not exists", async () => {
    const user = await factory.create("User");
    const uuid = user.id; // uuid valid
    await user.destroy();

    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const response = await request(app)
      .put(`/v1/users/${uuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Thalyson Rodrigues",
        email: "thalyson@email.com",
      });

    expect(response.status).toBe(404);
  });

  it("should be able users update", async () => {
    const user = await factory.create("User");
    const uuid = user.id;
    const token = await user.generateTokenJwt();

    const response = await request(app)
      .put(`/v1/users/${uuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Thalyson Rodrigues",
        email: "contact@email.com",
      });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        user: expect.any(Object),
      })
    );
  });

  it("should be not able destroy user with invalid params", async () => {
    const response = await request(app).delete(`/v1/users/notuuid`);

    expect(response.status).toBe(400);
  });

  it("should be not able destroy user with not owner or admin", async () => {
    const user1 = await factory.create("User", {
      email: "contact@thalyson.com",
    });

    const user2 = await factory.create("User");
    const token = await user2.generateTokenJwt();

    const response = await request(app)
      .delete(`/v1/users/${user1.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should be not able destroy user because user not exists", async () => {
    const user = await factory.create("User");
    const uuid = user.id; // uuid valid
    await user.destroy();

    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const response = await request(app)
      .delete(`/v1/users/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should be able destroy user", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();
    const uuid = user.id;

    const response = await request(app)
      .delete(`/v1/users/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});

describe("Category", () => {
  it("should be not able list categories with bad params", async () => {
    const response = await request(app).get("/v1/categories");

    expect(response.status).toBe(400);
  });

  it("should be able list all categories", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    await factory.create("Category");

    const response = await request(app)
      .get("/v1/categories")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        docs: expect.arrayContaining([expect.any(Object)]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    );
  });

  it("should be not able show category with bad params", async () => {
    const response = await request(app).get(`/v1/categories/baduuid`);

    expect(response.status).toBe(400);
  });

  it("should be not able show category because category not exists", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");
    const uuid = category.id;
    await category.destroy();

    const response = await request(app)
      .get(`/v1/categories/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should be able show category", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");
    const uuid = category.id;

    const response = await request(app)
      .get(`/v1/categories/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        category: expect.any(Object),
      })
    );
  });

  it("should be not able create new category with wrong body", async () => {
    const response = await request(app).post("/v1/admin/categories");

    expect(response.status).toBe(400);
  });

  it("should be able create new category", async () => {
    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const response = await request(app)
      .post("/v1/admin/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "anywhere",
        description: "any description",
      });

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        category: expect.any(Object),
      })
    );
  });

  it("should be not able create category because category already exists", async () => {
    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    await factory.create("Category", {
      title: "Rock Nacional",
      description: "Rock & Roll",
    });

    const response = await request(app)
      .post("/v1/admin/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Rock Nacional",
        description: "Hello World!!!",
      });

    expect(response.status).toBe(409);
  });

  it("should be not able update category with bad params", async () => {
    const response = await request(app).put("/v1/admin/categories/notuuid");

    expect(response.status).toBe(400);
  });

  it("should be not able update category because category not exists", async () => {
    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const category = await factory.create("Category");
    const uuid = category.id;
    await category.destroy();

    const response = await request(app)
      .put(`/v1/admin/categories/${uuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "anywhere",
        description: "any description",
      });

    expect(response.status).toBe(404);
  });

  it("should be able update category", async () => {
    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const category = await factory.create("Category");
    const uuid = category.id;

    const response = await request(app)
      .put(`/v1/admin/categories/${uuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "anywhere",
        description: "any description",
      });

    expect(response.status).toBe(200);
  });

  it("should be not able update because category already exists", async () => {
    const admin = await factory.create("Admin");
    const token = await admin.generateTokenJwt();

    const category1 = await factory.create("Category", {
      title: "category1",
    });

    await factory.create("Category", {
      title: "category2",
    });

    const response = await request(app)
      .put(`/v1/admin/categories/${category1.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "category2",
        description: "anywhere description",
      });

    expect(response.status).toBe(409);
  });

  it("should be not able destroy category with wrong params", async () => {
    const response = await request(app).delete(
      "/v1/admin/categories/wronguuid"
    );

    expect(response.status).toBe(400);
  });

  it("should be not able destroy because category not exists", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");
    const uuid = category.id;
    await category.destroy();

    const response = await request(app)
      .delete(`/v1/admin/categories/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should be able destroy category", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");
    const uuid = category.id;

    const response = await request(app)
      .delete(`/v1/admin/categories/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("should be not able destroy category because vinculated a music", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    await factory.create("Music", {
      category_id: category.id,
    });

    const response = await request(app)
      .delete(`/v1/admin/categories/${category.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(409);
  });
});

describe("Music", () => {
  it("should be not able list musics with bad params", async () => {
    const response = await request(app).get("/v1/musics");

    expect(response.status).toBe(400);
  });

  it("should be able list musics", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    await factory.create("Music", {
      category_id: category.id,
    });

    const response = await request(app)
      .get("/v1/musics")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        docs: expect.arrayContaining([expect.any(Object)]),
        pages: expect.any(Number),
        total: expect.any(Number),
      })
    );
  });

  it("should be not able show music with bad params", async () => {
    const response = await request(app).get("/v1/musics/notuuid");

    expect(response.status).toBe(400);
  });

  it("should be not able show music because music not exists", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");
    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const uuid = music.id;
    await music.destroy();

    const response = await request(app)
      .get(`/v1/musics/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should be able show music by id", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");
    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const uuid = music.id;

    const response = await request(app)
      .get(`/v1/musics/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        music: expect.any(Object),
      })
    );
  });

  it("should be not able create music with wrong body", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    const response = await request(app)
      .post("/v1/admin/musics")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should be able create new music with category not exists", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    const response = await request(app)
      .post("/v1/admin/musics")
      .set("Authorization", `Bearer ${token}`)
      .send({
        link: "https://www.youtube.com/watch?v=iPsZN2RLD_s",
        title: "Pouca Vogal - Girassóis. HD",
        author: "Duca Leindecker",
        letter: "Deixa o sol bater na cara, esqueça tudo que lhe faz mal...",
        category: {
          title: "Rock Nacional & MPB",
          description: "Estilo de rock classico brasileiro.",
        },
        description:
          "Musica do projeto Pouca Vogal de Humberto Gessinger e Duca Leindecker",
      });

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        music: expect.any(Object),
      })
    );
  });

  it("should be able create new music with category exists", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    await factory.create("Category", {
      title: "Rock Nacional & MPB",
      description: "Estilo de rock classico brasileiro.",
    });

    const response = await request(app)
      .post("/v1/admin/musics")
      .set("Authorization", `Bearer ${token}`)
      .send({
        link: "https://www.youtube.com/watch?v=iPsZN2RLD_s",
        title: "Pouca Vogal - Girassóis. HD",
        author: "Duca Leindecker",
        letter: "Deixa o sol bater na cara, esqueça tudo que lhe faz mal...",
        category: {
          title: "Rock Nacional & MPB",
          description: "Estilo de rock classico brasileiro.",
        },
        description:
          "Musica do projeto Pouca Vogal de Humberto Gessinger e Duca Leindecker",
      });

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        music: expect.any(Object),
      })
    );
  });

  it("should be not update music with bad params", async () => {
    const response = await request(app).put("/v1/admin/musics/notuuidvalid");

    expect(response.status).toBe(400);
  });

  it("should be not able update music because music not exists", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const uuid = music.id;
    await music.destroy();

    const response = await request(app)
      .put(`/v1/admin/musics/${uuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        link: "https://www.youtube.com/watch?v=iPsZN2RLD_s",
        title: "Pouca Vogal - Girassóis. HD",
        author: "Duca Leindecker",
        letter: "Deixa o sol bater na cara, esqueça tudo que lhe faz mal...",
        category: {
          title: "Rock Nacional & MPB",
          description: "Estilo de rock classico brasileiro.",
        },
        description:
          "Musica do projeto Pouca Vogal de Humberto Gessinger e Duca Leindecker",
      });

    expect(response.status).toBe(404);
  });

  it("should be able update music by id", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const uuid = music.id;

    const response = await request(app)
      .put(`/v1/admin/musics/${uuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        link: "https://www.youtube.com/watch?v=iPsZN2RLD_s",
        title: "Pouca Vogal - Girassóis. HD",
        author: "Duca Leindecker",
        letter: "Deixa o sol bater na cara, esqueça tudo que lhe faz mal...",
        category: {
          title: "Rock Nacional & MPB",
          description: "Estilo de rock classico brasileiro.",
        },
        description:
          "Musica do projeto Pouca Vogal de Humberto Gessinger e Duca Leindecker",
      });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        music: expect.any(Object),
      })
    );
  });

  it("should be not able destroy music with bad params", async () => {
    const response = await request(app).delete("/v1/admin/musics/notuuidvalid");

    expect(response.status).toBe(400);
  });

  it("should be not able destroy music because music not exists", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");
    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const uuid = music.id;
    await music.destroy();

    const response = await request(app)
      .delete(`/v1/admin/musics/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should be able destroy music by id", async () => {
    const user = await factory.create("Admin");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");
    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const uuid = music.id;

    const response = await request(app)
      .delete(`/v1/admin/musics/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});

describe("Interpretations", () => {
  it("should be not able list interpretations with bad params", async () => {
    const response = await request(app).get("/v1/interpretations");

    expect(response.status).toBe(400);
  });

  it("should be able list interpretations", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    await factory.create("Interpretation", {
      music_id: music.id,
      author_id: user.id,
    });

    const response = await request(app)
      .get("/v1/interpretations")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        docs: expect.arrayContaining([expect.any(Object)]),
        total: expect.any(Number),
        pages: expect.any(Number),
      })
    );
  });

  it("should be not able create new interpretation with bad params", async () => {
    const response = await request(app).post("/v1/interpretations");

    expect(response.status).toBe(400);
  });

  it("should be able create new interpretation", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");
    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const response = await request(app)
      .post("/v1/interpretations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        interpretation:
          "about something...aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        music: music.id,
      });

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        interpretation: expect.any(Object),
      })
    );
  });

  it("should be not able show interpretation because interpretation not exists", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const interpretation = await factory.create("Interpretation", {
      music_id: music.id,
      author_id: user.id,
    });

    const uuid = interpretation.id;
    await interpretation.destroy();

    const response = await request(app)
      .get(`/v1/interpretations/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should be able show interpretation by id", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const interpretation = await factory.create("Interpretation", {
      music_id: music.id,
      author_id: user.id,
    });

    const uuid = interpretation.id;

    const response = await request(app)
      .get(`/v1/interpretations/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        interpretation: expect.any(Object),
      })
    );
  });

  it("should be not able update interpretation with bad params", async () => {
    const response = await request(app).put("/v1/interpretations/notuuidvalid");

    expect(response.status).toBe(400);
  });

  it("should be not able update interpretation because interpretation not exists", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const interpretation = await factory.create("Interpretation", {
      music_id: music.id,
      author_id: user.id,
    });

    const uuid = interpretation.id;
    await interpretation.destroy();

    const response = await request(app)
      .put(`/v1/interpretations/${uuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        interpretation:
          "about something...aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        music: music.id,
      });

    expect(response.status).toBe(404);
  });

  it("should be not able update because not owner or admin", async () => {
    const user_owner = await factory.create("User");

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const interpretation = await factory.create("Interpretation", {
      music_id: music.id,
      author_id: user_owner.id,
    });

    const uuid = interpretation.id;

    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const response = await request(app)
      .put(`/v1/interpretations/${uuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        interpretation:
          "about something...aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        music: music.id,
      });

    expect(response.status).toBe(403);
  });

  it("should be update interpretation by id", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const interpretation = await factory.create("Interpretation", {
      music_id: music.id,
      author_id: user.id,
    });

    const uuid = interpretation.id;

    const response = await request(app)
      .put(`/v1/interpretations/${uuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        interpretation:
          "about something...aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        music: music.id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        interpretation: expect.any(Object),
      })
    );
  });

  it("should be not able destroy interpretation with bad params", async () => {
    const response = await request(app).delete(
      "/v1/interpretations/notuuidvalid"
    );

    expect(response.status).toBe(400);
  });

  it("should be not able destroy interpretation because interpretation not exists", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const interpretation = await factory.create("Interpretation", {
      music_id: music.id,
      author_id: user.id,
    });

    const uuid = interpretation.id;
    await interpretation.destroy();

    const response = await request(app)
      .delete(`/v1/interpretations/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should be not able destroy because not owner or admin", async () => {
    const user_owner = await factory.create("User");

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const interpretation = await factory.create("Interpretation", {
      music_id: music.id,
      author_id: user_owner.id,
    });

    const uuid = interpretation.id;

    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const response = await request(app)
      .delete(`/v1/interpretations/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should be able destroy interpretation by id", async () => {
    const user = await factory.create("User");
    const token = await user.generateTokenJwt();

    const category = await factory.create("Category");

    const music = await factory.create("Music", {
      category_id: category.id,
    });

    const interpretation = await factory.create("Interpretation", {
      music_id: music.id,
      author_id: user.id,
    });

    const uuid = interpretation.id;

    const response = await request(app)
      .delete(`/v1/interpretations/${uuid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  describe("Comments", () => {
    it("should be not able list comments with bad params", async () => {
      const response = await request(app).get(
        "/v1/interpretations/notuuidvalid/comments"
      );

      expect(response.status).toBe(400);
    });

    it("should be able list all comments by interpretation", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const uuid = interpretation.id;

      await factory.create("Comment", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      const response = await request(app)
        .get(`/v1/interpretations/${uuid}/comments`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          docs: expect.arrayContaining([expect.any(Object)]),
          pages: expect.any(Number),
          total: expect.any(Number),
        })
      );
    });

    it("should be not able show comment with bad params", async () => {
      const response = await request(app).get(
        "/v1/interpretations/notuuidvalid/comments/notuuidvalid"
      );

      expect(response.status).toBe(400);
    });

    it("should be not able show comment because not exists", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const comment = await factory.create("Comment", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      await comment.destroy();

      const response = await request(app)
        .get(`/v1/interpretations/${interpretation.id}/comments/${comment.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should be able show comment by interpretation", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const comment = await factory.create("Comment", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      const response = await request(app)
        .get(`/v1/interpretations/${interpretation.id}/comments/${comment.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          comment: expect.any(Object),
        })
      );
    });

    it("should be not able create comment with bad params", async () => {
      const response = await request(app).post(
        "/v1/interpretations/notuuidvalid/comments"
      );

      expect(response.status).toBe(400);
    });

    it("should be not able create new comment because interpretation not exists", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      await interpretation.destroy();

      const response = await request(app)
        .post(`/v1/interpretations/${interpretation.id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          comment: "Hello World!",
        });

      expect(response.status).toBe(409);
    });

    it("should be able create new comment by interpretation", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const response = await request(app)
        .post(`/v1/interpretations/${interpretation.id}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          comment: "Hello World!",
        });

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          comment: expect.any(Object),
        })
      );
    });

    it("should be not able update comment with bad params", async () => {
      const response = await request(app).put(
        "/v1/interpretations/notuuid/comments/notuuid"
      );

      expect(response.status).toBe(400);
    });

    it("should be not able update comment because not exists", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const comment = await factory.create("Comment", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      await comment.destroy();

      const response = await request(app)
        .put(`/v1/interpretations/${interpretation.id}/comments/${comment.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          comment: "New comment hello world!",
        });

      expect(response.status).toBe(404);
    });

    it("should be not able update comment because not owner or admin", async () => {
      const user_owner = await factory.create("User");

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user_owner.id,
      });

      const comment = await factory.create("Comment", {
        user_id: user_owner.id,
        interpretation_id: interpretation.id,
      });

      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const response = await request(app)
        .put(`/v1/interpretations/${interpretation.id}/comments/${comment.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          comment: "New comment hello world!",
        });

      expect(response.status).toBe(403);
    });

    it("should be able update comment by interpretation", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const comment = await factory.create("Comment", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      const response = await request(app)
        .put(`/v1/interpretations/${interpretation.id}/comments/${comment.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          comment: "New comment hello world!",
        });

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          comment: expect.any(Object),
        })
      );
    });

    it("should be not able destroy comment with bad params", async () => {
      const response = await request(app).delete(
        "/v1/interpretations/notuuidvalid/comments/notuuidvalid"
      );

      expect(response.status).toBe(400);
    });

    it("should be not able destroy comment because not exists", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const comment = await factory.create("Comment", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      await comment.destroy();

      const response = await request(app)
        .delete(
          `/v1/interpretations/${interpretation.id}/comments/${comment.id}`
        )
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should be not able destroy comment because not owner ot admin", async () => {
      const user_owner = await factory.create("User");

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user_owner.id,
      });

      const comment = await factory.create("Comment", {
        user_id: user_owner.id,
        interpretation_id: interpretation.id,
      });

      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const response = await request(app)
        .delete(
          `/v1/interpretations/${interpretation.id}/comments/${comment.id}`
        )
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it("should be able destroy comment by interpretation", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const comment = await factory.create("Comment", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      const response = await request(app)
        .delete(
          `/v1/interpretations/${interpretation.id}/comments/${comment.id}`
        )
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);
    });
  });

  describe("Likes", () => {
    it("should be not able list likes with bad params", async () => {
      const response = await request(app).get(
        "/v1/interpretations/notuuidvalid/likes"
      );
      expect(response.status).toBe(400);
    });

    it("should be able list likes", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");
      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const uuid = interpretation.id;

      await factory.create("Like", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      const response = await request(app)
        .get(`/v1/interpretations/${uuid}/likes`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          docs: expect.arrayContaining([expect.any(Object)]),
          pages: expect.any(Number),
          total: expect.any(Number),
        })
      );
    });

    it("should be not able create new like with bad params", async () => {
      const response = await request(app).post(
        "/v1/interpretations/notuuidvalid/likes?action=like"
      );

      expect(response.status).toBe(400);
    });

    it("should be not able create new like because like already exists", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");
      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const uuid = interpretation.id;

      await factory.create("Like", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      const response = await request(app)
        .post(`/v1/interpretations/${uuid}/likes?action=like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(409);
    });

    it("should be able create new like", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const uuid = interpretation.id;

      const response = await request(app)
        .post(`/v1/interpretations/${uuid}/likes?action=like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          like: expect.any(Object),
        })
      );
    });

    it("should be able create new dislike", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        music_id: music.id,
        author_id: user.id,
      });

      const uuid = interpretation.id;

      const response = await request(app)
        .post(`/v1/interpretations/${uuid}/likes?action=dislike`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          like: expect.any(Object),
        })
      );
    });

    it("should be not able destroy like with bad params", async () => {
      const response = await request(app).delete(
        "/v1/interpretations/notuuidvalid/likes"
      );
      expect(response.status).toBe(400);
    });

    it("should be not able destroy like because like not exists", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        author_id: user.id,
        music_id: music.id,
      });

      const uuid = interpretation.id;

      const response = await request(app)
        .delete(`/v1/interpretations/${uuid}/likes`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should be able destroy like", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");

      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        author_id: user.id,
        music_id: music.id,
      });

      const uuid = interpretation.id;

      await factory.create("Dislike", {
        user_id: user.id,
        interpretation_id: interpretation.id,
      });

      const response = await request(app)
        .delete(`/v1/interpretations/${uuid}/likes`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it("should be not able count likes and dislikes with bad params", async () => {
      const response = await request(app).get(
        "/v1/interpretations/notuuidvalid/likes/count"
      );
      expect(response.status).toBe(400);
    });

    it("should be able count likes and dislikes", async () => {
      const user = await factory.create("User");
      const token = await user.generateTokenJwt();

      const category = await factory.create("Category");
      const music = await factory.create("Music", {
        category_id: category.id,
      });

      const interpretation = await factory.create("Interpretation", {
        author_id: user.id,
        music_id: music.id,
      });

      const uuid = interpretation.id;

      const response = await request(app)
        .get(`/v1/interpretations/${uuid}/likes/count`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          likes: expect.any(Number),
          dislikes: expect.any(Number),
        })
      );
    });
  });
});
