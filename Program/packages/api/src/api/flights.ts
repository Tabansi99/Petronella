import { Router } from 'express';
import bodyParser from 'body-parser';
import { wrap } from '@mikro-orm/core';
import { Flight } from '../entities/Flight';
import { User } from '../entities/User';
import { Destination } from '../entities/Destination';

export const flights = Router();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

function normalize(name: string) {
  let ans = name.toLowerCase();
  ans = ans.split('.').join('');
  ans = ans.split('-').join('');
  ans = ans.split(',').join('');
  return ans;
}

flights.get('/', async (req, res) => {
  const { user } = req.session;
  if (user) {
    const dbUser = await req.entityManager.findOneOrFail(User, user.id);

    const flightHistory: Flight[] = await req.entityManager.find(Flight, { user: dbUser });

    for (const flight of flightHistory) {
      await flight.destination.load();
    }

    res.send(flightHistory);
    return;
  }
  res.send([]);
});

flights.post('/new', urlencodedParser, async (req, res) => {
  const { user, authenticated } = req.session;

  if (user && authenticated) {
    const {
      flightDate,
      depCity,
      arrCity,
      region,
      country,
      continent,
      enjoyedFlight,
      latitude,
      longitude,
    } = req.body;

    const dbUser = await req.entityManager.findOne(User, user);
    let destination = await req.entityManager.findOne(Destination, {
      city: arrCity,
      region,
      country,
    });

    if (!destination) {
      destination = new Destination({
        city: arrCity,
        region,
        country,
        continent,
        longitude,
        latitude,
      });

      await req.entityManager.persistAndFlush(destination);
    }

    if (!dbUser) {
      res.redirect('/app/login');
      return;
    }

    const flight = new Flight({
      user: wrap(dbUser).toReference(),
      flightDate,
      departureCity: depCity,
      arrivalCity: arrCity,
      destination: wrap(destination).toReference(),
      enjoyedFlight,
    });

    await req.entityManager.persistAndFlush(flight);

    res.redirect('/app/user/flightHistory');
    return;
  }

  res.redirect('/app/login');
});

flights.get('/check/:city', async (req, res) => {
  const inputCity = normalize(req.params.city);

  const baseURL = 'http://geodb-free-service.wirefreethought.com';
  const query = `/v1/geo/cities?limit=10&offset=0&namePrefix=${req.params.city}&sort=-population`;

  await fetch(baseURL + query)
    .then((response) => response.json())
    .then((data) => {
      const responseData = data.data;

      let found = false;

      for (let i = 0; i < responseData.length; i += 1) {
        if (inputCity === normalize(responseData[i].city)) {
          found = true;
          res.send({
            exists: true,
            city: responseData[i].city,
            region: responseData[i].region,
            country: responseData[i].country,
            latitude: responseData[i].latitude,
            longitude: responseData[i].longitude,
          });
          return;
        }
      }

      if (responseData.length === 0) {
        res.send({
          exists: false,
          city: '',
          region: '',
          country: '',
          latitude: 0,
          longitude: 0,
        });
      }

      if (responseData.length > 0 && !found) {
        res.send({
          exists: false,
          city: responseData[0].city,
          region: responseData[0].region,
          country: responseData[0].country,
          latitude: responseData[0].latitude,
          longitude: responseData[0].longitude,
        });
      }
    });
});

flights.get('/continent/:country', async (req, res) => {
  const { country } = req.params;

  const baseURL = 'https://restcountries.com/v3.1';
  const query = `/name/${country}?fields=continents`;

  await fetch(baseURL + query)
    .then((response) => response.json())
    .then((data) => {
      if (!data.status) {
        res.send({
          found: true,
          continent: data[0].continents[0],
        });
      } else {
        res.send({
          found: false,
        });
      }
    });
});
