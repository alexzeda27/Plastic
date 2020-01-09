'use strict'

var Mobilitie = require('../models/mobility');

function home(req, res)
{
    return res.status(200).send({
        message: "Bienvenido al servidor de NodeJS - Mobilities"
    });
}

function createNewMobility(req, res)
{
    var params = req.body;

    if(params.month && params.week && params.operatorEncounter && params.indicator)
    {
        
    }

    else
    {
        return res.status(400).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

module.exports = {
    home
}
