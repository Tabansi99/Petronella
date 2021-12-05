import { Entity, IdentifiedReference, ManyToOne, Property, Reference } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Destination } from './Destination';
import { Node } from './Node';
import { User } from './User';

export type FlightConstructorValues = ConstructorValues<Flight>;

@Entity()
export class Flight extends Node<Flight> {
  @ManyToOne(() => User, { wrappedReference: true })
  user: IdentifiedReference<User>;

  @Property({ columnType: 'date', nullable: true })
  flightDate: string;

  @Property({ columnType: 'text' })
  departureCity: string;

  @Property({ columnType: 'text' })
  arrivalCity: string;

  @ManyToOne(() => Destination, { wrappedReference: true })
  destination: IdentifiedReference<Destination>;

  @Property({ columnType: 'text', nullable: true })
  enjoyedFlight: string;

  constructor({
    user,
    flightDate,
    departureCity,
    arrivalCity,
    destination,
    enjoyedFlight,
    ...extraValues
  }: FlightConstructorValues) {
    super(extraValues);

    this.user = Reference.create(user);
    this.flightDate = flightDate;
    this.departureCity = departureCity;
    this.arrivalCity = arrivalCity;
    this.destination = Reference.create(destination);
    this.enjoyedFlight = enjoyedFlight;
  }
}
