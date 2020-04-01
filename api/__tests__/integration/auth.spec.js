import request from 'supertest';
import nodemailer from 'nodemailer';

import app from '../../src/app';
import db from '../../src/services/database';
import factory from '../factories';

import { generateTokenCrypto } from '../../src/app/utils';

jest.mock('nodemailer');

const transportMock = {
  sendMail: jest.fn(),
  use: jest.fn(),
};

describe('Authentication', () => {
  beforeAll(async () => {
    nodemailer.createTransport.mockReturnValue(transportMock);
  });

  beforeEach(async () => {
    await db.models.User.destroy({ truncate: true, force: true });
  });

  afterAll(async () => {
    await db.close();
  });
  // 200 OK
  it('should receive Jwt token and user info when authenticated with valid credentials', async () => {
    const user = await factory.create('User', {
      password: '12345'
    });

    const response = await request(app)
      .post('/v1/auth/authenticate')
      .send({
        email: user.email,
        password: '12345'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String)
      })
    );
  });
  // 401 Unauthorized
  it('should be not able authenticate user with invalid password', async () => {
    const user = await factory.create('User', {
      password: '12345'
    });

    const response = await request(app)
      .post('/v1/auth/authenticate')
      .send({
        email: user.email,
        password: '12344'
      });

    expect(response.status).toBe(401);
  });
  // 401 Not found
  it('should be not able authenticate user with email not registered', async () => {
    await factory.create('User', {
      email: 'contact@thalysonalexr.com'
    });

    const response = await request(app)
      .post('/v1/auth/authenticate')
      .send({
        email: 'contact@thalyson.com',
        password: '12345'
      });

    expect(response.status).toBe(401);
  });
  // 400 Bad Request
  it('should be not able authenticate user with wrong content body', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/v1/auth/authenticate')
      .send({
        email: user.email
      });

    expect(response.status).toBe(400);
  });
  // 201 Created
  it('should be able register new user and get token to authenticate', async () => {
    const user = {
      name: 'Thalyson Rodrigues',
      email : 'thalyson@email.com',
      password: '12345'
    };

    const response = await request(app)
      .post('/v1/auth/register')
      .send(user);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String)
      })
    )
  });
  // 400 Bad Request
  it('should be register new user with malformatted data', async () => {
    const response = await request(app)
      .post('/v1/auth/register')
      .send({
        email: 'contactthalysonalexr.com'
      });

    expect(response.status).toBe(400);
  });
  // 401 Unauthorized
  it('should be not able access private route without token', async () => {
    const admin = await factory.create('User');
    
    admin.role = 'admin';
    await admin.save();
    
    const response = await request(app)
      .post('/v1/admin')
      .send({
        name: 'Thalyson Rodrigues',
        email: 'contact@thalysonalexr.com',
        password: '12345'
      });

    expect(response.status).toBe(401);
  });
  // 401 Unauthorized
  it('should be not able access private route with token without flag', async () => {
    const admin = await factory.create('User');
    
    admin.role = 'admin';
    await admin.save();
    
    const response = await request(app)
      .post('/v1/admin')
      .send({
        name: 'Thalyson Rodrigues',
        email: 'contact@thalysonalexr.com',
        password: '12345'
      })
      .set('Authorization', await admin.generateTokenJwt());

    expect(response.status).toBe(401);
  });
  // 401 Unauthorized
  it('should be not able access private route with token malformatted', async () => {
    const admin = await factory.create('User');
    
    admin.role = 'admin';
    await admin.save();
    
    const response = await request(app)
      .post('/v1/admin')
      .send({
        name: 'Thalyson Rodrigues',
        email: 'contact@thalysonalexr.com',
        password: '12345'
      })
      .set('Authorization', `notbearer ${await admin.generateTokenJwt()}`);

    expect(response.status).toBe(401);
  });
  // 401 Unauthorized
  it('should be not able access private route with invalid token', async () => {
    const response = await request(app)
      .post('/v1/admin')
      .send({
        name: 'Thalyson Rodrigues',
        email: 'contact@thalysonalexr.com',
        password: '12345'
      })
      .set('Authorization', 'Bearer 2a1ab3a12b3ab1ab2a3b1b2a3a1a2');

    expect(response.status).toBe(401);
  });
  // 403 Forbidden
  it('should be not able access private route with token default user', async () => {
    const user = await factory.create('User');
    
    const response = await request(app)
      .post('/v1/admin')
      .send({
        name: 'Thalyson Rodrigues',
        email: 'contact@thalysonalexr.com',
        password: '12345'
      })
      .set('Authorization', `Bearer ${await user.generateTokenJwt()}`);

    expect(response.status).toBe(403);
  });
  // 422 Unprocessable Entity
  it('should be not able access private route with role user disabled', async () => {
    const user = await factory.create('User');

    user.role = 'disabled';
    await user.save();
    
    const response = await request(app)
      .post('/v1/admin')
      .send({
        name: 'Thalyson Rodrigues',
        email: 'contact@thalysonalexr.com',
        password: '12345'
      })
      .set('Authorization', `Bearer ${await user.generateTokenJwt()}`);

    expect(response.status).toBe(422);
  });
  // 201 Created
  it('should be able register new user admin and get token to authenticate', async () => {
    const admin = await factory.create('User');

    admin.role = 'admin';
    await admin.save();

    const response = await request(app)
      .post('/v1/admin')
      .send({
        name: 'Thalyson Rodrigues',
        email: 'thalyson@email.com',
        password: '12345'
      })
      .set('Authorization', `Bearer ${await admin.generateTokenJwt()}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String)
      })
    )
  });
  // 409 Conflict
  it('should be not able to register new user that has been registered', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/v1/auth/register')
      .send({
        name: user.name,
        email: user.email,
        password: '12345'
      });

    expect(response.status).toBe(409);
  });
  // 404 Not Found
  it('should be not able init password recovery because user not exists', async () => {
    const response = await request(app)
      .post('/v1/auth/forgot_password')
      .send({
        email: 'notexists@email.com'
      });

    expect(response.status).toBe(404);
  });
  // 204 No Content
  it('should be able init password recovery', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/v1/auth/forgot_password')
      .send({
        email: user.email
      });
    
    expect(transportMock.sendMail).toHaveBeenCalledTimes(1);
    expect(transportMock.sendMail.mock.calls[0][0].to).toBe(user.email);
    expect(response.status).toBe(204);
  });
  // 404 Not Found
  it('should be not able reset password because user not exists', async () => {
    const response = await request(app)
      .post('/v1/auth/reset_password')
      .send({
        email: 'usernotexists@email.com',
        password: 'newpassword',
        token: 'anytoken',
      });

    expect(response.status).toBe(404);
  });
  // 401 Unauthorized
  it('should be not able reset password because token already used', async () => {
    const user = await factory.create('User');

    const token = generateTokenCrypto();
 
    const now = new Date();
    now.setHours(now.getHours() + 1);

    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    await user.save();

    await factory.create('RevokedToken', {
      token,
      user_id: user.id,
    });

    const response = await request(app)
      .post('/v1/auth/reset_password')
      .send({
        email: user.email,
        password: 'newpassword',
        token
      });

    expect(response.status).toBe(401);
  });
  // 401 Unauthorized
  it('should be not able reset password because token does not belong to the user', async () => {
    const user = await factory.create('User');

    const token = generateTokenCrypto();
 
    const now = new Date();
    now.setHours(now.getHours() + 1);

    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    await user.save();

    const response = await request(app)
      .post('/v1/auth/reset_password')
      .send({
        email: user.email,
        password: 'newpassword',
        token: 'othertoken'
      });

    expect(response.status).toBe(401);
  });
  // 401 Unauthorized
  it('should be not able reset password because token expired', async () => {
    const user = await factory.create('User');

    const token = generateTokenCrypto();
 
    const now = new Date();
    now.setHours(now.getHours() - 1);

    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    await user.save();

    const response = await request(app)
      .post('/v1/auth/reset_password')
      .send({
        email: user.email,
        password: 'newpassword',
        token
      });

    expect(response.status).toBe(401);
  });
  // 204 No Content
  it('should be not able reset password', async () => {
    const user = await factory.create('User');

    const token = generateTokenCrypto();
 
    const now = new Date();
    now.setHours(now.getHours() + 1);

    user.passwordResetToken = token;
    user.passwordResetExpires = now;

    await user.save();

    const response = await request(app)
      .post('/v1/auth/reset_password')
      .send({
        email: user.email,
        password: 'newpassword',
        token
      });

    expect(response.status).toBe(204);
  });
});

describe('Database is unavailable', () => {
  it('should be able fails to authenticate', async () => {
    const response = await request(app)
      .post('/v1/auth/authenticate')
      .send({
        email: 'contact@email.com',
        password: '12345'
      });

    expect(response.status).toBe(500);
  });

  it('should be able fails to register', async () => {
    const response = await request(app)
      .post('/v1/auth/register')
      .send({
        name: 'Thalyson Alexandre',
        email: 'contact@email.com',
        password: '12345'
      });
    
    expect(response.status).toBe(500);
  });

  it('should be able fails to init recovery password', async () => {
    const response = await request(app)
      .post('/v1/auth/forgot_password')
      .send({
        email: 'contact@email.com'
      });

    expect(response.status).toBe(500);
  });

  it('should be able fails to reset password', async () => {
    const response = await request(app)
      .post('/v1/auth/reset_password')
      .send({
        email: 'contact@email.com',
        token: '23123a1w1aa1a1a5a5a514a1',
        password: '12345'
      });

    expect(response.status).toBe(500);
  });
});
