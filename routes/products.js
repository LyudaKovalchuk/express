const express = require('express');
const router = express.Router();
const loggedInCheck = require('../middlewares/login-check/login-check');
const Product = require('../schemas/product');

router.get('/products', loggedInCheck, (req, resp, next) => {
    Product.find().exec().then((products) => {
        resp.status(200).send(products)
    }).catch(next)
});

router.get('/products/:id', loggedInCheck, (req, resp, next) => {
    const { id } = req.params;
    Product.findById(id)
        .exec()
        .then(product => resp.status(200).send(product))
        .catch(next)
});

router.post('/product', loggedInCheck, (req, resp, next) => {
    const { name, description, price, file } = req.body;
    const product = new Product({name, description, price, file});
    product.save().then(savedProduct => {
        if (savedProduct) {
            return Product
                .find()
                .exec()
                .then(products => resp.status(200).send(products));
        }
        resp.status(500).send('Cannot add product');
    }).catch(next);
});

module.exports = router;

// schema ???
