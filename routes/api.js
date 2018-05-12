// Vajadzīgās pakotnes
var express = require('express');
var router = express.Router();

// Filmas Datu modelis
var Filmas = require('../models/filmas');

// Saites
Filmas.methods(['get', 'put', 'post', 'delete']);
Filmas.register(router, '/filmas');

// Return router
module.exports = router;
