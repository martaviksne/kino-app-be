// Vajadzīgās pakotnes
var express = require('express');
var router = express.Router();

// Filmas Datu modelis
var Filmas = require('../models/filmas');
var Tickets = require('../models/ticket');

// Saites
Filmas.methods(['get', 'put', 'post', 'delete']);
Filmas.register(router, '/filmas');

Tickets.methods(['get', 'put', 'post', 'delete']);
Tickets.register(router, '/tickets');

// Return router
module.exports = router;
