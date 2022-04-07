const router = require('express').Router();
const { User, Party, Theme } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');

// SHOW homepage
router.get('/', async (req, res) => {
  console.log('**************** inside home-routes/ ***************');
  res.render('homepage', { loggedIn: req.session.loggedIn} );
});

// SHOW login
router.get('/login', (req, res) => {
  console.log('**************** inside home-routes/login ***************');
  console.log('req.session.loggedIn value is', req.session.loggedIn);
  
  // check if user is logged in and redirect to the dashboard if true
  // otherwise render the /login page for user to enter credentials
  if (req.session.loggedIn) {
    res.redirect('dashboard');
    return;
  }

  res.render('login', { loggedIn: req.session.loggedIn });
});

// SHOW dashboard
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
      });
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

// SHOW searchresults
router.get('/search/:ispublic/:isover21/:theme_id', async (req, res) => {
  console.log('**************** inside home-routes/search/:ispublic/isover21/:theme_id ***************');
  console.log('req.session.loggedIn value is', req.session.loggedIn);
  console.log(typeof req.params.ispublic, typeof req.params.isover21, typeof req.params.theme_id);

  const ispublic = req.params.ispublic === "true";
  const isover21 = req.params.isover21 === "true";

  if(req.session.loggedIn) {
    // Access our Party model and run .findAll() method
    // with conditions as shown below
    const dbPartyData = await Party.findAll({
      where: {
        ispublic: ispublic,
        isover21: isover21,
        theme_id: req.params.theme_id
      },
      include: [
        {
          model: Theme,
          attributes: ['id', 'theme_description']
        },
        {
          model: User,
          attributes: ['id', 'firstname', 'lastname', 'email']
        }
      ]
    });

    const parties = dbPartyData.map(result => result.get({ plain: true }));
    console.log('////////////////// partySearchResults is:', parties);
    // when the search results are rendered, pass in the partySearchResults array, which
    // is just an array of party objects meeting the search criteria
    res.render('search', { parties, loggedIn: req.session.loggedIn });
  }
});

// SHOW one party
router.get('/party/:id', async (req, res) => {
  console.log('**************** inside home-routes/party/:id ***************');
  console.log('req.session.loggedIn value is', req.session.loggedIn);

  try {
    const dbPartyData = await Party.findOne({
      where: {
        id: req.params.id
      },      
      include: [
        {
          model: Theme,
          attributes: [
            'id',
            'theme_description'
          ],
        }
      ]
    });

    const party = dbPartyData.get({ plain: true });
    // console.log(party);

    res.render('party', { party, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;



// SHOW searchresults
// router.get('/search/:ispublic/isover21/:theme_id', async (req, res) => {
//   console.log('**************** inside home-routes/search ***************');
//   console.log('req.session.loggedIn value is', req.session.loggedIn);
//   console.log(typeof req.body.ispublic, typeof req.body.isover21, typeof req.body.theme_id);

//   const ispublic = req.params.ispublic === "true";
//   const isover21 = req.params.isover21 === "true";
  
//   const partyData = await Party.findAll({

//   })
//   if(req.session.loggedIn) {
//     // Access our Party model and run .findAll() method
//     // with conditions as shown below
//     Party.findAll({
//       where: {
//         ispublic: req.body.ispublic,
//         isover21: req.body.isover21,
//         theme_id: req.body.theme_id
//       },
//       include: [
//         {
//           model: Theme,
//           attributes: ['id', 'theme_description']
//         },
//         {
//           model: User,
//           attributes: ['id', 'firstname', 'lastname', 'email']
//         }
//       ]
//     })
//       .then(dbPartyData => {
//         const partySearchResults = dbPartyData.map(result => result.get({ plain: true }));
//         console.log('////////////////// partySearchResults is:', partySearchResults);
//         // when the search results are rendered, pass in the partySearchResults array, which
//         // is just an array of party objects meeting the search criteria
//         res.render('search', { partySearchResults, loggedIn: req.session.loggedIn });
//       })
//       .catch(err => {
//         console.log(err);
//         res.redirect('dashboard');
//       });
//   } else {
//     res.redirect('dashboard');
//   }

// });