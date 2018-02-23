let {User} = require('../models/user');

let authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(User, token).then((user) => {
    if (!user) {
      return Promise.reject('No user found');
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send(e);
  })
};

module.exports = {authenticate};
