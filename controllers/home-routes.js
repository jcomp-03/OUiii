const router = require('express').Router();
const { User, Party, Theme } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');

// GET homepage
router.get('/', async (req, res) => {
  console.log('**************** inside home-routes/ ***************');
  res.render('homepage', { loggedIn: req.session.loggedIn} );
});

// In /login route, check if user is logged in and redirect to the dashboard if true
// otherwise render the /login page for user to enter credentials
router.get('/login', (req, res) => {
  console.log('**************** inside home-routes/login ***************');
  console.log('req.session.loggedIn value is', req.session.loggedIn);
  
  if (req.session.loggedIn) {
    res.redirect('dashboard');
    return;
  }

  res.render('login', { loggedIn: req.session.loggedIn });
});

// GET dashboard
router.get('/dashboard', async (req, res) => {
  console.log('**************** inside home-routes/dashboard ***************');
  console.log('req.session.loggedIn value is', req.session.loggedIn);
  
  try {
    // It's redundant to check for loggedIn here because the value is set
    // to true when the user logs in, but still we'll check it here
    if(req.session.loggedIn) {
      // get entirety of user data by finding via the entered email
      const dbUserData = await User.findOne({
        where: {
          email: req.session.email
        }
      })
      const user = dbUserData.get( { plain: true });
      // console.log(user);

      // now find all the parties associated with that user
      const dbPartyData = await Party.findAll({
        where: {
          user_id: user.id 
        },
        include: [
          {
            model: Theme,
            attributes: [
              'id',
              'theme_description'
            ],
          },
        ],
      });
      // console.log(dbPartyData);

      const parties = dbPartyData.map((gallery) =>
        gallery.get({ plain: true })
      );

      console.log(parties);

      // when the dashboard for that user is rendered, pass in the parties array, which
      // is just an array of party objects belonging to that user
      res.render('dashboard', { parties, loggedIn: req.session.loggedIn });
      return;
    }

    // otherwise if loggedIn is false, redirect to login view
    res.redirect('login');
    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one party
router.get('/party/:id', async (req, res) => {
  console.log('**************** inside home-routes/party/:id ***************');
  console.log('req.session.loggedIn value is', req.session.loggedIn);
  try {
    const dbPaintingData = await Painting.findByPk(req.params.id);

    const painting = dbPaintingData.get({ plain: true });

    res.render('painting', { painting, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});




// GET one gallery
// Use the custom middleware before allowing the user to access the gallery
router.get('/gallery/:id', withAuth, async (req, res) => {
  try {
    const dbGalleryData = await Gallery.findByPk(req.params.id, {
      include: [
        {
          model: Painting,
          attributes: [
            'id',
            'title',
            'artist',
            'exhibition_date',
            'filename',
            'description',
          ],
        },
      ],
    });

    const gallery = dbGalleryData.get({ plain: true });
    res.render('gallery', { gallery, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one painting
// Use the custom middleware before allowing the user to access the painting
router.get('/painting/:id', withAuth, async (req, res) => {
  try {
    const dbPaintingData = await Painting.findByPk(req.params.id);

    const painting = dbPaintingData.get({ plain: true });

    res.render('painting', { painting, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;