const express = require('express');
const payment_route = express();

const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));


const paymentController = require('../controllers/paymentController');

payment_route.post('/pay', paymentController.createOrder);

module.exports = payment_route;