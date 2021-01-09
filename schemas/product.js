const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: false
    },
    file: {
        type: Buffer,
        contentType: String,
        required: false
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
