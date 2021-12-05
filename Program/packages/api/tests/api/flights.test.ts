import { flights } from '../../src/api/flights';
import fetchMock from 'fetch-mock-jest';
import { Flight } from '../../src/entities/Flight';
import { User } from '../../src/entities/User';
import { testHandler } from '../testUtils/testHandler';
import { Destination } from '../../src/entities/Destination';

jest.mock('@mikro-orm/core', () => {
  const original = jest.requireActual('@mikro-orm/core');

  return {
    ...original,
    Reference: {
      create: jest.fn(),
    },
    wrap: jest.fn(() => {
      return {
        toReference: jest.fn(),
      };
    }),
  };
});

describe('flight', () => {
  it('finds existing flights for user', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
    };
    const flightHistory: Partial<Flight>[] = [];
    const handler = testHandler((req, _res, next) => {
      req.session = { user } as any;
      next();
    }, flights);

    handler.entityManager.findOneOrFail.mockResolvedValue(user);
    handler.entityManager.find.mockResolvedValueOnce(flightHistory);
    const { body } = await handler.get('/').expect(200);
    expect(handler.entityManager.find).toBeCalledWith(Flight, { user });
    expect(body).toEqual(flightHistory);
  });

  it('finds existing flights for user', async () => {
    const user: Partial<User> = {
      userName: 'Matt',
    };

    const flightHistory: any[] = [
      {
        destination: { city: 'Paris', load: jest.fn() },
      },
    ];

    const handler = testHandler((req, _res, next) => {
      req.session = { user } as any;
      next();
    }, flights);

    handler.entityManager.findOneOrFail.mockResolvedValue(user);
    handler.entityManager.find.mockResolvedValueOnce(flightHistory);

    const { body } = await handler.get('/').expect(200);
    expect(handler.entityManager.find).toBeCalledWith(Flight, { user });

    for (const flight of flightHistory) {
      expect(flight.destination.load).toBeCalledTimes(1);
    }

    expect(body).toEqual(
      flightHistory.map((flight) => ({ destination: { city: flight.destination.city } })),
    );
  });

  it('returns empty array if user does not exist', async () => {
    const handler = testHandler((req, _res, next) => {
      req.session = { user: undefined } as any;
      next();
    }, flights);

    const { body } = await handler.get('/').expect(200);
    expect(body).toEqual([]);
  });

  it('returns a continent that is found in our api', async () => {
    const handler = testHandler(flights);

    const baseURL = 'https://restcountries.com/v3.1';
    const query = `/name/France?fields=continents`;

    fetchMock.get(baseURL + query, [
      {
        continents: ['Europe'],
      },
    ]);

    const response = {
      found: true,
      continent: 'Europe',
    };

    const { body } = await handler.get('/continent/France').expect(200);
    expect(body).toEqual(response);
  });

  it('can not find a continent in the api', async () => {
    const handler = testHandler(flights);

    const baseURL = 'https://restcountries.com/v3.1';
    const query = '/name/France?fields=continents';

    fetchMock.get(
      baseURL + query,
      {
        status: 404,
        message: 'Not Found',
      },
      { overwriteRoutes: true },
    );

    const response = {
      found: false,
    };

    const { body } = await handler.get('/continent/France').expect(200);
    expect(body).toEqual(response);
  });

  it('returns a city that is found in our api', async () => {
    const handler = testHandler(flights);

    const baseURL = 'http://geodb-free-service.wirefreethought.com';
    const query = `/v1/geo/cities?limit=10&offset=0&namePrefix=Paris&sort=-population`;

    fetchMock.get(baseURL + query, {
      data: [
        {
          city: 'Paris',
          country: 'France',
          region: 'Île-de-France',
          latitude: 48.856944444,
          longitude: 2.351388888,
        },
        {
          city: 'Parish of Saint Andrew',
          country: 'Jamaica',
          region: 'Saint Andrew',
          latitude: 18.06667,
          longitude: -76.75,
        },
        {
          city: 'East Baton Rouge Parish',
          country: 'United States of America',
          region: 'Louisiana',
          latitude: 30.54,
          longitude: -91.09,
        },
      ],
    });

    const response = {
      exists: true,
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      latitude: 48.856944444,
      longitude: 2.351388888,
    };

    const { body } = await handler.get('/check/Paris').expect(200);
    expect(body).toEqual(response);
  });

  it('returns a suggested city when exact city is not found', async () => {
    const handler = testHandler(flights);

    const baseURL = 'http://geodb-free-service.wirefreethought.com';
    const query = `/v1/geo/cities?limit=10&offset=0&namePrefix=Par&sort=-population`;

    fetchMock.get(baseURL + query, {
      data: [
        {
          city: 'Paris',
          country: 'France',
          region: 'Île-de-France',
          latitude: 48.856944444,
          longitude: 2.351388888,
        },
        {
          city: 'Parish of Saint Andrew',
          country: 'Jamaica',
          region: 'Saint Andrew',
          latitude: 18.06667,
          longitude: -76.75,
        },
        {
          city: 'East Baton Rouge Parish',
          country: 'United States of America',
          region: 'Louisiana',
          latitude: 30.54,
          longitude: -91.09,
        },
      ],
    });

    const response = {
      exists: false,
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      latitude: 48.856944444,
      longitude: 2.351388888,
    };

    const { body } = await handler.get('/check/Par').expect(200);
    expect(body).toEqual(response);
  });

  it('returns a suggested city when exact city is not found', async () => {
    const handler = testHandler(flights);

    const baseURL = 'http://geodb-free-service.wirefreethought.com';
    const query = `/v1/geo/cities?limit=10&offset=0&namePrefix=xyz&sort=-population`;

    fetchMock.get(baseURL + query, { data: [] });

    const response = {
      exists: false,
      city: '',
      region: '',
      country: '',
      latitude: 0,
      longitude: 0,
    };

    const { body } = await handler.get('/check/xyz').expect(200);
    expect(body).toEqual(response);
  });

  it('mocks a succesful post', async () => {
    const user: Partial<User> = {
      id: '1',
      userName: 'Matt',
      firstName: 'Matthew',
      lastName: 'Kanarr',
      email: 'test@test.com',
      password: 'test',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, flights);

    handler.entityManager.findOne
      .mockResolvedValue(user)
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(null);
    handler.entityManager.persistAndFlush.mockResolvedValue();

    await handler.post('/new').expect(302).expect('location', '/app/user/flightHistory');
  });

  it('tries to create a flight when a user is not found in the database', async () => {
    const user: Partial<User> = {
      id: '1',
      userName: 'Matt',
      firstName: 'Matthew',
      lastName: 'Kanarr',
      email: 'test@test.com',
      password: 'test',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, flights);

    handler.entityManager.findOne
      .mockResolvedValue(user)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    handler.entityManager.persistAndFlush.mockResolvedValue();

    await handler.post('/new').expect(302).expect('location', '/app/login');
  });

  it('tries to create a flight when session is unauthenticated', async () => {
    const user: Partial<User> = {
      id: '1',
      userName: 'Matt',
      firstName: 'Matthew',
      lastName: 'Kanarr',
      email: 'test@test.com',
      password: 'test',
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: false } as any;
      next();
    }, flights);

    handler.entityManager.findOne
      .mockResolvedValue(user)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    handler.entityManager.persistAndFlush.mockResolvedValue();

    await handler.post('/new').expect(302).expect('location', '/app/login');
  });

  it('tries to create a flight with an existing destination', async () => {
    const user: Partial<User> = {
      id: '1',
      userName: 'Matt',
      firstName: 'Matthew',
      lastName: 'Kanarr',
      email: 'test@test.com',
      password: 'test',
    };

    const dest: Partial<Destination> = {
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      latitude: 48.856944444,
      longitude: 2.351388888,
    };

    const handler = testHandler((req, _res, next) => {
      req.session = { user, authenticated: true } as any;
      next();
    }, flights);

    handler.entityManager.findOne
      .mockResolvedValue(user)
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(dest);
    handler.entityManager.persistAndFlush.mockResolvedValue();

    await handler.post('/new').expect(302).expect('location', '/app/user/flightHistory');
  });
});
