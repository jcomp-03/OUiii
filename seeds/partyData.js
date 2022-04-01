const { Party } = require('../models');

const partydata = [
  {
    startdate: '2022-04-10',
    ispublic: true,
    isover21: true,
    user_id: 1,
    theme_id: 3
  },
  {
    startdate: '2022-05-23',
    ispublic: false,
    isover21: true,
    user_id: 4,
    theme_id: 5
  },
  {
    startdate: '2022-04-18',
    ispublic: true,
    isover21: true,
    user_id: 1,
    theme_id: 4
  },
];

// create function seedParty and then export it
const seedParty = () => Party.bulkCreate(partydata);

module.exports = seedParty;