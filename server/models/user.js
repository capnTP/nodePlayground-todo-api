const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

let User = mongoose.model('UserRecord', UserSchema);

module.exports.User = User;
