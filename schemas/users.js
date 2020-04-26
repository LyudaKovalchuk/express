const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (email) {
        return User.findOne({email}).then(value => !value)
      },
      message: 'User already exist'
    }
  },
  pass: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: false
  }
});

usersSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.pass, 10).then(hash => {
      user.pass = hash;
      next();
  }).catch((err) => {
    next(err);
  })
});


let User = mongoose.model('User', usersSchema);



module.exports = User;
