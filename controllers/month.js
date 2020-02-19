'use strict'

//Librerias

//Carga de modelos
var Month = require('../models/month');

//Carga de métodos
var Methods = require('../status/methods');

//Función Obtener Mes
function getMonth(req, res)
{
    Month.find((err, months) => {
        if(err) return Methods.responseErrorServer(res);
        if(!months) return Methods.responseNotFound(res, "No se han encontrado meses.");
        else
        {
            return res.status(200).send({months: months});
        }
    });
}

//Exportar
module.exports = {
    getMonth
}