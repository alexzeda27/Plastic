'use strict'

//Cargamos el modelo de Position
var Position = require('../models/position');

//Función principal
function home(req, res)
{
    res.status(200).send({
        message: "Hola mundo desde el servidor de NodeJS - Puestos"
    });
}

//Función para registar puestos
function savePosition(req, res)
{
    
}

//Exportamos los métodos
module.exports = {
    home
}