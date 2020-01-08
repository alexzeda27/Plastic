'use strict'

var Mobilitie = require('../models/mobility');

function home(req, res)
{
    return res.status(200).send({
        message: "Bienvenido al servidor de NodeJS - Mobilities"
    });
}

module.exports = {
    home
}
