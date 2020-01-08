'use strict'

var MobilityController = require('../controllers/mobility');
var express = require('express');

var api = express.Router();

api.get('/', MobilityController.home);

module.exports = api;
