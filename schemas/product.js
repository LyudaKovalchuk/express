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
        type: Number,
        required: false
    },
    file: {
        type: Buffer,
        contentType: String,
        required: false
    }
});

productSchema.pre('save', function (next) {
    const product = this;
    product.price = product.price.toFixed(2);
    next();
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
