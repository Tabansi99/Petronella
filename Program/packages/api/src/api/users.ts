import { Router } from 'express';
import bodyParser from 'body-parser';
import { User } from '../entities/User';

export const users = Router();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

users.get('/:userName', async (req, res) => {
  const user = await req.entityManager.findOne(User, { userName: req.params.userName });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.send({
    userName: user.userName,
    userID: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    created: user.createdAt,
  });
});

users.get('/', (req, res) => {
  const { user, authenticated } = req.session;

  if (authenticated && user) {
    res.send({
      authenticated: req.session.authenticated,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      },
    });
  } else {
    res.send({
      authenticated: false,
    });
  }
});

users.post('/new', urlencodedParser, async (req, res) => {
  try {
    const { firstName, lastName, email, userName, password } = req.body;

    const user: User = new User({
      userName,
      email,
      password,
      firstName,
      lastName,
    });

    await req.entityManager.persistAndFlush(user);
  } catch (err) {
    res.sendStatus(500);
    return;
  }

  res.redirect('/app/login');
});

users.post('/login', urlencodedParser, async (req, res) => {
  const { username, password } = req.body;

  const user = await req.entityManager.findOne(User, { userName: username, password });

  if (!user) {
    req.session.authenticated = false;
    res.send(
      '<script>alert("Error: Login failed. Username or Password is incorrect."); window.location.href = "/app/login";</script>',
    );
    return;
  }

  req.session.authenticated = true;
  req.session.user = user;

  res.redirect('/app/user/dashboard');
});

users.delete('/', (req, res) => {
  req.session.destroy(() => {});
  res.sendStatus(204);
});

users.post('/update/password/:passwordChange', urlencodedParser, async (req, res) => {
  const { user, authenticated } = req.session;
  const { passwordChange } = req.params;

  if (user && authenticated) {
    const currUser = await req.entityManager.findOne(User, { id: user.id });

    if (!currUser) {
      res.redirect('/app/user/settings');
      return;
    }

    if (passwordChange === 'true') {
      const { password } = req.body;
      currUser.password = password;
    } else if (passwordChange === 'false') {
      const { firstName, lastName, email, userName } = req.body;
      currUser.firstName = firstName;
      currUser.lastName = lastName;
      currUser.email = email;
      currUser.userName = userName;
    } else {
      res.sendStatus(403);
      return;
    }

    await req.entityManager.flush();
    req.session.user = currUser;

    res.redirect('/app/user/settings');
    return;
  }

  res.redirect('/app/login');
});
