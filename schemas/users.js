const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
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
  bcrypt.hash(user.pass, 10, (err, hash) => {
    if (err) {
      next();
    } else {
      user.pass = hash;
      next();
    }
  })
});


let User = mongoose.model('User', usersSchema);



module.exports = User;
