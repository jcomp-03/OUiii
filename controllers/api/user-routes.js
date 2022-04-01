const router = require('express').Router();
const { User, Party, Theme } = require('../../models');
// const withAuth = require('../../utils/auth');

/**** Not clear yet which routes might actually be needed ****/

// GET /api/users
router.get('/', async (req, res) => {
    // Access our User model and run .findAll() method
    User.findAll({
      // attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// GET /api/users/1
router.get('/:id', async (req, res) => {
  User.findOne({
    // attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Party,
        attributes: ['id', 'title', 'ispublic', 'isover21', 'user_id', 'theme_id'],
        include: {
          model: Theme,
          attributes: ['id', 'theme_description']
        }
      }
    ]
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// POST /api/users
router.post('/', async (req, res) => {
    User.create({
      firstname: req.body.firstname, 
      lastname: req.body.lastname,
      email: req.body.email,
      age: req.body.age,
      address: req.body.address,
      password: req.body.password,
      lat: req.body.lat,
      long: req.body.long
    })
    .then(dbUserData => {
      res.json(dbUserData);
      // We want to make sure the session is created before
      // we send the response back, so we're wrapping the
      // variables in a callback. The req.session.save() method
      // will initiate the creation of the session and then run
      // the callback function once complete.
      // req.session.save(() => {
      //   req.session.user_id = dbUserData.id;
      //   req.session.username = dbUserData.username;
      //   req.session.loggedIn = true;
      //   res.json(dbUserData);
      // });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users/login, for authenticating login
router.post('/login', async (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({  message: 'Incorrect email or password. Please try again!' });
        return;
      }
  
      // Verify user
      const validPassword = await dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
      
      req.session.save(() => {
        // declare session variables
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        // if entered password matches hashed password, send back the following
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    });  
});

// POST /api/users/logout, terminating session
router.post('/logout', async (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
})

// PUT /api/users/1
router.put('/:id', async (req, res) => {
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // This .update() method combines the parameters for creating data and looking up data.
    // We pass in req.body to provide the new data we want to use in the update and req.params.id
    // to indicate where exactly we want that new data to be stored.
    User.update(req.body, {
      // individualHooks: true,
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json({ message: 'User updated successfully.' });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', async (req, res) => {
    let uname;
    let uid = req.params.id;

    User.findOne({
      attributes: { exclude: ['email', 'password'] },
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
      uname = dbUserData.dataValues.username;
    });     

    User.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(`User ${uname} with id ${uid} has been deleted.`);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;