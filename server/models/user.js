const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{email} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = (u) => {
  let user = u;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, '9889xyz')
  .toString();
  user.tokens.push({access, token});
  //user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  })
};

UserSchema.methods.removeToken = function (token) {
  let user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
};

UserSchema.statics.findByToken = (model, token) => {
  let User = model;
  let decoded;

  try {
    decoded = jwt.verify(token, '9889xyz');
  } catch (e) {
    return Promise.reject('Unauthorized token...');
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if (!user) return Promise.reject('Email is not found!');

    return bcrypt.compare(password, user.password);
  }).then((res) => {
    return (res ? User.findOne({email}) :
      Promise.reject('Authentication failed!'));
  })
};

UserSchema.pre('save', function(next) {
  let user = this;

  if (user.isModified('password')) {
      bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash;
        next();
      });
  } else {
    next();
  }
});

let User = mongoose.model('UserRecord', UserSchema);

module.exports.User = User;
