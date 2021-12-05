import { Entity, Property, Unique } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<User>;

@Entity()
export class User extends Node<User> {
  @Property({ columnType: 'text' })
  @Unique()
  userName: string;

  @Property({ columnType: 'text' })
  @Unique()
  email: string;

  @Property({ columnType: 'text' })
  password: string;

  @Property({ columnType: 'text' })
  firstName: string;

  @Property({ columnType: 'text' })
  lastName: string;

  constructor({
    userName,
    email,
    password,
    firstName,
    lastName,
    ...extraValues
  }: UserConstructorValues) {
    super(extraValues);

    this.userName = userName;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
