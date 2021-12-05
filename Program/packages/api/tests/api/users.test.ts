import { recommendations } from '../../src/api/recommendations';
import { users } from '../../src/api/users';
import { User } from '../../src/entities/User';
import { testHandler } from '../testUtils/testHandler';

describe('users', () => {
  it('finds existing user', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
    };

    const handler = testHandler(users);
    handler.entityManager.findOne.mockResolvedValueOnce(user);
    const { body } = await handler.get('/Matt').expect(200);

    expect(body).toEqual(user);
  });

  it('fails to find user', async () => {
    const handler = testHandler(users);
    handler.entityManager.findOne.mockResolvedValueOnce(null);
    await handler.get('/username').expect(404);
  });

  it('creates new user', async () => {
    const user: Partial<User> = {
      userName: 'mkanarr',
    };

    const handler = testHandler(users);
    handler.entityManager.persistAndFlush.mockResolvedValueOnce();

    await handler.post('/new').send(user).expect(302).expect('location', '/app/login');
  });

  it('fails to create user', async () => {
    const user: Partial<User> = {
      userName: 'mkanarr',
    };

    const handler = testHandler(users);
    handler.entityManager.persistAndFlush.mockRejectedValueOnce(Error('failed'));

    await handler.post('/new').send(user).expect(500);
  });

  it('user has authenticated session', async () => {
    const user: Partial<User> = {
      id: undefined,
      firstName: undefined,
      lastName: undefined,
      userName: undefined,
      email: undefined,
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, users);
    const { body } = await handler.get('/').expect(200);

    expect(body).toEqual({
      authenticated: true,
      user: {
        id: undefined,
        firstName: undefined,
        lastName: undefined,
        userName: undefined,
        email: undefined,
      },
    });
  });

  it('user has non-active session', async () => {
    const user: Partial<User> = {
      userName: 'rtabansi',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: false } as any;
      next();
    }, users);
    const { body } = await handler.get('/').expect(200);

    expect(body).toEqual({
      authenticated: false,
    });
  });

  it('updates user profile information with no password update', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, users);
    handler.entityManager.findOne.mockResolvedValueOnce(user);

    user.userName = 'Kanarr';
    handler.entityManager.flush.mockResolvedValueOnce();

    await handler
      .post('/update/password/false')
      .send(user)
      .expect(302)
      .expect('location', '/app/user/settings');
  });

  it('updates user password', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
      password: '1234',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, users);

    handler.entityManager.findOne.mockResolvedValueOnce(user);
    user.password = 'abcd';
    handler.entityManager.flush.mockResolvedValueOnce();

    await handler
      .post('/update/password/true')
      .send(user)
      .expect(302)
      .expect('location', '/app/user/settings');
  });

  it('fails to find user when updating info', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, users);
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler
      .post('/update/password/false')
      .send(user)
      .expect(302)
      .expect('location', '/app/user/settings');
  });

  it('user or session do not exist when updating info', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { authenticated: false } as any;
      next();
    }, users);

    await handler
      .post('/update/password/false')
      .send(user)
      .expect(302)
      .expect('location', '/app/login');
  });

  it('non existent user attempts to login', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
      password: '1234',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user: null, authenticated: null } as any;
      next();
    }, users);
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.post('/login').send(user).expect(200);
  });

  it('user attempts successful login', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
      password: '1234',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user: null, authenticated: null } as any;
      next();
    }, users);
    handler.entityManager.findOne.mockResolvedValueOnce(user);

    await handler.post('/login').send(user).expect(302).expect('location', '/app/user/dashboard');
  });

  it('destroys session', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
      password: '1234',
    };

    const destroyMock = jest.fn((callback) => callback());
    const handler = testHandler((req, _res, next) => {
      req.session = { user, destroy: destroyMock } as any;
      next();
    }, users);

    await handler.delete('/').expect(204);
    expect(destroyMock).toBeCalledTimes(1);
  });

  it('invalid update post url', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, users);
    handler.entityManager.findOne.mockResolvedValueOnce(user);

    await handler.post('/update/password/invalid').send(user).expect(403);
  });
});
