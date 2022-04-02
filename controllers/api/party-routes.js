const router = require('express').Router();
const { User, Party, Theme } = require('../../models');
// Import the custom middleware
const withAuth = require('../../utils/auth');

/**** Not clear yet which routes might actually be needed ****/

// GET /api/parties i.e. get all parties
router.get('/', async (req, res) => {
    // Access our Party model and run .findAll() method
    Party.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstname', 'lastname', 'email']
        }
      ]
    })
    .then(dbPartyData => res.json(dbPartyData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// GET /api/parties/1 i.e. get all parties for SINGLE user
router.get('/:user_id', (req, res) => {
    // Access our Party model and run .findAll() method
    Party.findAll({
      where: {
        user_id: req.params.user_id
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstname', 'lastname', 'email']
        }
      ]
    })
      .then(dbPartyData => res.json(dbPartyData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// POST /api/parties i.e. create a new party
router.post('/', (req, res) => {
    Party.create({
      title: req.body.title, 
      startdate: req.body.startdate,
      ispublic: req.body.ispublic,
      isover21: req.body.isover21,
      user_id: req.body.user_id,
      theme_id: req.body.theme_id
    })
    .then(dbPartyData => {
      res.json({ message: 'Party created successfully!', dbPartyData });
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

// PUT /api/parties/1
router.put('/:id', (req, res) => {
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // This .update() method combines the parameters for creating data and looking up data.
    // We pass in req.body to provide the new data we want to use in the update and req.params.id
    // to indicate where exactly we want that new data to be stored.
    Party.update(req.body, {
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

// DELETE /api/parties/1
router.delete('/:id', (req, res) => {
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