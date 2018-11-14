const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
});

let Article = module.exports = mongoose.model('Artcile', articleSchema);

