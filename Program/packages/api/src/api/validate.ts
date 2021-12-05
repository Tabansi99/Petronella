import { Router } from 'express';
import { User } from '../entities/User';

export const validate = Router();

validate
  .get('/user/:userName', (req, res) => {
    void (async () => {
      try {
        await req.entityManager.findOneOrFail(User, { userName: req.params.userName });
        res.send({
          exists: true,
        });
      } catch (err) {
        res.send({
          exists: false,
        });
      }
    })();
  })
  .get('/email/:email', (req, res) => {
    void (async () => {
      try {
        await req.entityManager.findOneOrFail(User, { email: req.params.email });
        res.send({
          exists: true,
        });
      } catch (err) {
        res.send({
          exists: false,
        });
      }
    })();
  })
  .get('/password/:password', (req, res) => {
    const { user } = req.session;

    if (user) {
      if (user.password === req.params.password) {
        res.send({
          matches: true,
        });
      } else {
        res.send({
          matches: false,
        });
      }
    } else {
      res.send({
        authenticated: false,
      });
    }
  });
