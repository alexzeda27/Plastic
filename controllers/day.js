'use strict'

//Librerias

//Carga de modelos
var Day = require('../models/day');

//Carga de métodos
var Methods = require('../status/methods');

//Función Obtener Semana
function getDay(req, res)
{
    Day.find((err, days) => {
        if(err) return Methods.responseErrorServer(res);
        if(!days) return Methods.responseNotFound(res, "No se han encontrado días.");
        else
        {
            return res.status(200).send({days: days});
        }
    });
}

//Exportar
module.exports = {
    getDay
}