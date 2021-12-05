import { Entity, Property, Unique } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type DestinationConstructorValues = ConstructorValues<Destination>;

@Entity()
export class Destination extends Node<Destination> {
  @Property({ columnType: 'text' })
  @Unique({ properties: ['city', 'region', 'country'] })
  city: string;

  @Property({ columnType: 'text' })
  region: string;

  @Property({ columnType: 'text' })
  country: string;

  @Property({ columnType: 'text' })
  continent: string;

  @Property({ columnType: 'numeric' })
  longitude: number;

  @Property({ columnType: 'numeric' })
  latitude: number;

  constructor({
    city,
    region,
    country,
    continent,
    longitude,
    latitude,
    ...extraValues
  }: DestinationConstructorValues) {
    super(extraValues);

    this.city = city;
    this.region = region;
    this.country = country;
    this.continent = continent;
    this.longitude = longitude;
    this.latitude = latitude;
  }
}
