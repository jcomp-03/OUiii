const router = require('express').Router();
const { User, Party, Theme } = require('../../models');
// Import the custom middleware
const withAuth = require('../../utils/auth');

/**** Not clear yet which routes might actually be needed ****/

// GET /api/users
router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
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
// This route is used during execution of signupFormHandler in login.js script
router.post('/', (req, res) => {
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
      // accessing the session information in the routes
      // This gives our server easy access to the user's user_id,
      // email, and a Boolean describing whether or not the user is logged in.
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.email = dbUserData.email;
        req.session.loggedIn = true;
        
        res.json(dbUserData);
      });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users/login, for authenticating login
// This route is used during execution of loginFormHandler in login.js script
router.post('/login', (req, res) => {
    User.findOne({
      attributes: { exclude: ['age', 'address', 'lat', 'long']},
      where: {
        email: req.body.email
      }
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({  message: 'Incorrect email or password. Please try again!' });
        return;
      }

      // Verify user login password to stored hashed password
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }

      req.session.save(() => {
        // accessing the session information in the routes
        // This gives our server easy access to the user's user_id,
        // email, and a Boolean describing whether or not the user is logged in.
        req.session.user_id = dbUserData.id;
        req.session.email = dbUserData.email;
        req.session.loggedIn = true;
        
        // if entered password matches hashed password, send back the following
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    });  
});

// POST /api/users/logout, terminating session
router.post('/logout', (req, res) => {
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
router.put('/:id', (req, res) => {
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // This .update() method combines the parameters for creating data and looking up data.
    // We pass in req.body to provide the new data we want to use in the update and req.params.id
    // to indicate where exactly we want that new data to be stored.
    User.update(req.body, {
      individualHooks: true,
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
router.delete('/:id', (req, res) => {
    // let firstname = null;
    // let lastname = null;
    let uid = req.params.id;

    User.findOne({
      attributes: { exclude: ['email', 'password'] },
      where: {
        id: req.params.id
      }
    })
    .then(dbUserData => {
      // let { dataValues } = dbUserData;
      // firstname = dataValues.firstname;
      // lastname = dataValues.lastname;
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
        res.json(`User with id ${uid} has been deleted.`);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;