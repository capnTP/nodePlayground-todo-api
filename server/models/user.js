const mongoose = require('mongoose');

let User = mongoose.model('UserRecord', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 7
  }
});

module.exports.User = User;
