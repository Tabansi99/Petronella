import { users } from '../../src/api/users';
import { validate } from '../../src/api/validate';
import { User } from '../../src/entities/User';
import { testHandler } from '../testUtils/testHandler';

describe('validate', () => {
  it('userName already exists', async () => {
    const user: Partial<User> = {
      userName: 'Abraham',
    };

    const handler = testHandler(validate);
    handler.entityManager.findOne.mockResolvedValueOnce(user);
    const { body } = await handler.get('/user/Abraham').expect(200);

    expect(body).toEqual({
      exists: true,
    });
  });

  it('userName does not exist', async () => {
    const user: Partial<User> = {
      userName: 'abe',
    };

    const handler = testHandler(validate);
    handler.entityManager.findOneOrFail.mockRejectedValueOnce(user);
    const { body } = await handler.get('/user/abe').expect(200);

    expect(body).toEqual({
      exists: false,
    });
  });

  it('email already exists', async () => {
    const userEmail: Partial<User> = {
      email: 'arbitrary@tamu.edu',
    };

    const handler = testHandler(validate);
    handler.entityManager.findOne.mockResolvedValueOnce(userEmail);
    const { body } = await handler.get('/email/arbitrary@tamu.edu').expect(200);

    expect(body).toEqual({
      exists: true,
    });
  });

  it('email does not exist', async () => {
    const userEmail: Partial<User> = {
      email: 'null@tamu.edu',
    };

    const handler = testHandler(validate);
    handler.entityManager.findOneOrFail.mockRejectedValueOnce(userEmail);
    const { body } = await handler.get('/email/null@tamu.edu').expect(200);

    expect(body).toEqual({
      exists: false,
    });
  });

  it('User is not authenticated', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
      password: '1234',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user: null, authenticated: false } as any;
      next();
    }, validate);
    const { body } = await handler.get('/password/cheese').expect(200);

    expect(body).toEqual({
      authenticated: false,
    });
  });

  it('Password is authenticated', async () => {
    const user: Partial<User> = {
      userName: 'mark',
      password: 'cheese',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, validate);

    const { body } = await handler.get('/password/cheese').expect(200);

    expect(body).toEqual({
      matches: true,
    });
  });

  it('Password is not authenticated', async () => {
    const user: Partial<User> = {
      password: 'cheese',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, validate);

    const { body } = await handler.get('/password/cheze').expect(200);

    expect(body).toEqual({
      matches: false,
    });
  });
});
