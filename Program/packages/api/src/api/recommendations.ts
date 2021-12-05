import { Router } from 'express';
import { Destination } from '../entities/Destination';
import { Flight } from '../entities/Flight';
import { User } from '../entities/User';
import { readModel } from '../utils/processModel';

export const recommendations = Router();

const { data } = readModel();

recommendations.get('/:preference', async (req, res) => {
  const { limit } = req.query;
  const { user } = req.session;

  if (user) {
    const dbUser = await req.entityManager.findOneOrFail(User, user.id);
    const allVisited: string[] = [];
    const allEnjoyedFlights: string[] = [];

    const flightHistory: Flight[] = await req.entityManager.find(Flight, { user: dbUser });

    for (const flight of flightHistory) {
      const destination = await flight.destination.load();
      const { city } = destination;
      const { enjoyedFlight } = flight;

      if (!allVisited.includes(city)) {
        allVisited.push(city);
        allEnjoyedFlights.push(enjoyedFlight);
      }
    }

    const { preference } = req.params;

    const matches: any = {};
    const visited: any = {};

    const climates = ['normal', 'warm', 'cold'];

    for (let i = 0; i < climates.length; i += 1) {
      const weather = climates[i];

      for (let j = 0; j < allVisited.length; j += 1) {
        const city = allVisited[j];
        const enjoyedFlight = allEnjoyedFlights[j];
        visited[city] = '';

        let maxLift = 0;

        if (data[weather][city]) {
          const otherCities = Object.keys(data[weather][city]);

          for (let k = 0; k < otherCities.length; k += 1) {
            const oCity = otherCities[k];
            const lift = data[weather][city][oCity];

            if (!(oCity in matches)) {
              matches[oCity] = 0;
            }

            maxLift = Math.max(maxLift, lift);
          }

          for (let k = 0; k < otherCities.length; k += 1) {
            const oCity = otherCities[k];
            const lift = data[weather][city][oCity];

            let deltaScore = lift / maxLift;

            if (preference === weather) {
              deltaScore *= 1.5;
            } else {
              deltaScore *= 0.66;
            }
            if (enjoyedFlight === 'true') {
              matches[oCity] += deltaScore;
            } else if (enjoyedFlight === 'false') {
              matches[oCity] -= deltaScore;
            } else {
              matches[oCity] += deltaScore;
            }
          }
        }
      }
    }

    const bests = [];
    const matchedCities = Object.keys(matches);

    for (let i = 0; i < matchedCities.length; i += 1) {
      const key = matchedCities[i];

      if (!(key in visited)) {
        bests.push([matches[key], key]);
      }
    }

    bests.sort((a, b) => b[0] - a[0]);
    const recs = bests;

    const suggestions: Destination[] = [];

    for (let i = 0; i < recs.length; i += 1) {
      const city = recs[i][1];

      const destination = await req.entityManager.findOne(Destination, { city });

      if (destination) {
        suggestions.push(destination);
      }
    }

    if (limit) {
      res.send(suggestions.slice(0, Number(limit)));
      return;
    }

    res.send(suggestions);
    return;
  }

  res.sendStatus(500);
});
