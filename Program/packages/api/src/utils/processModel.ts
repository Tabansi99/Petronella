import { model } from './model';

const data: any = {};
let cities: any[] = [];

export function readModel() {
  data.cold = {};

  for (let i = 0; i < model.cold.length; i += 1) {
    const { A, B, lift } = model.cold[i];

    if (!(A in data.cold)) {
      data.cold[A] = {};
    }

    /* istanbul ignore next */
    if (!(B in data.cold[A])) {
      data.cold[A][B] = 0;
    }

    data.cold[A][B] += parseFloat(lift);
  }

  data.normal = {};
  for (let i = 0; i < model.normal.length; i += 1) {
    const { A, B, lift } = model.normal[i];

    /* istanbul ignore next */
    if (!(A in data.normal)) {
      data.normal[A] = {};
    }

    /* istanbul ignore next */
    if (!(B in data.normal[A])) {
      data.normal[A][B] = 0;
    }

    data.normal[A][B] += parseFloat(lift);
  }

  data.warm = {};
  for (let i = 0; i < model.warm.length; i += 1) {
    const { A, B, lift } = model.warm[i];

    if (!(A in data.warm)) {
      data.warm[A] = {};
    }

    /* istanbul ignore next */
    if (!(B in data.warm[A])) {
      data.warm[A][B] = 0;
    }

    data.warm[A][B] += parseFloat(lift);
  }

  cities = Object.keys(data.normal);
  cities.sort();

  return { data, cities };
}
