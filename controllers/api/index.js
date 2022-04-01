const router = require('express').Router();

const userRoutes = require('./user-routes');
router.use('/users', userRoutes);

const partyRoutes = require('./party-routes');
router.use('/parties', partyRoutes);

module.exports = router;
