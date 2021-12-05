import { recommendations } from '../../src/api/recommendations';
import { Destination } from '../../src/entities/Destination';
import { User } from '../../src/entities/User';
import { testHandler } from '../testUtils/testHandler';

describe('recommendations', () => {
  it('gets recommendations', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
    };

    const flightHistory: any[] = [
      {
        destination: { city: 'Paris', load: jest.fn().mockReturnThis() },
      },
    ];

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, recommendations);

    const amsterdam: Partial<Destination> = {
      city: 'Amsterdam',
    };

    const newYorkCity: Partial<Destination> = {
      city: 'New York City',
    };

    handler.entityManager.findOneOrFail.mockResolvedValueOnce(user);
    handler.entityManager.find.mockResolvedValueOnce(flightHistory);
    handler.entityManager.findOne.mockResolvedValueOnce(amsterdam);
    handler.entityManager.findOne.mockResolvedValueOnce(newYorkCity);

    const { body } = await handler.get('/normal').expect(200);

    const recs: any[] = [amsterdam, newYorkCity];
    expect(body).toEqual(recs);
  });

  it('user checks enjoyedFlight checkbox', async () => {
    const user: Partial<User> = {
      userName: 'Abe',
    };

    const flightHistory: any[] = [
      {
        destination: { city: 'Paris', load: jest.fn().mockReturnThis() },
        enjoyedFlight: 'true',
      },
    ];

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, recommendations);

    const amsterdam: Partial<Destination> = {
      city: 'Amsterdam',
    };

    const barcelona: Partial<Destination> = {
      city: 'Barcelona',
    };

    handler.entityManager.findOneOrFail.mockResolvedValueOnce(user);
    handler.entityManager.find.mockResolvedValueOnce(flightHistory);
    handler.entityManager.findOne.mockResolvedValueOnce(amsterdam);
    handler.entityManager.findOne.mockResolvedValueOnce(barcelona);

    const { body } = await handler.get('/normal').expect(200);

    const recs: any[] = [amsterdam, barcelona];
    expect(body).toEqual(recs);
  });

  it('user unchecks enjoyedFlight checkbox', async () => {
    const user: Partial<User> = {
      userName: 'Abe',
    };

    const flightHistory: any[] = [
      {
        destination: { city: 'Paris', load: jest.fn().mockReturnThis() },
        enjoyedFlight: 'false',
      },
    ];

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, recommendations);

    const dubai: Partial<Destination> = {
      city: 'Dubai',
    };

    const bangkok: Partial<Destination> = {
      city: 'Bangkok',
    };

    handler.entityManager.findOneOrFail.mockResolvedValueOnce(user);
    handler.entityManager.find.mockResolvedValueOnce(flightHistory);
    handler.entityManager.findOne.mockResolvedValueOnce(dubai);
    handler.entityManager.findOne.mockResolvedValueOnce(bangkok);

    const { body } = await handler.get('/normal').expect(200);

    const recs: any[] = [dubai, bangkok];
    expect(body).toEqual(recs);
  });

  it('gets recommendations and limits response to only one recommendation', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
    };

    const flightHistory: any[] = [
      {
        destination: { city: 'Paris', load: jest.fn().mockReturnThis() },
      },
      {
        destination: { city: 'Paris', load: jest.fn().mockReturnThis() },
      },
      {
        destination: { city: 'Dallas', load: jest.fn().mockReturnThis() },
      },
      {
        destination: { city: 'Amsterdam', load: jest.fn().mockReturnThis() },
      },
    ];

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, recommendations);

    const amsterdam: Partial<Destination> = {
      city: 'Amsterdam',
    };

    const newYorkCity: Partial<Destination> = {
      city: 'New York City',
    };

    handler.entityManager.findOneOrFail.mockResolvedValueOnce(user);
    handler.entityManager.find.mockResolvedValueOnce(flightHistory);
    handler.entityManager.findOne.mockResolvedValueOnce(amsterdam);
    handler.entityManager.findOne.mockResolvedValueOnce(newYorkCity);

    const { body } = await handler.get('/normal?limit=1').expect(200);

    const recs: any[] = [amsterdam, newYorkCity];
    expect(body).toEqual(recs.splice(0, 1));
  });

  it('fails when a user is not validated', async () => {
    const handler = testHandler((req, _res, next) => {
      req.session = { authenticated: true } as any;
      next();
    }, recommendations);

    await handler.get('/normal').expect(500);
  });
});
