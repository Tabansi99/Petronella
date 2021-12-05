/* istanbul ignore file */
import session from 'express-session';
import { Router } from 'express';
import { health } from './health';
import { users } from './users';
import { validate } from './validate';
import { recommendations } from './recommendations';
import { flights } from './flights';
import { User } from '../entities/User';

export const api = Router();

declare module 'express-session' {
  interface SessionData {
    user: User;
    authenticated: boolean;
  }
}

api.use(
  session({
    secret: 'some secret',
    cookie: { maxAge: 3000000 },
    saveUninitialized: false,
    resave: true,
    rolling: true,
  }),
);

api.use('/health', health);
api.use('/users', users);
api.use('/validate', validate);
api.use('/recommendations', recommendations);
api.use('/flights', flights);
