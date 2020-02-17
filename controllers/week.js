'use strict'

//Librerias

//Carga de modelos
var Week = require('../models/week');

//Carga de métodos
var Methods = require('../status/methods');

//Función Obtener Semana
function getWeek(req, res)
{
    Week.find((err, weeks) => {
        if(err) return Methods.responseErrorServer(res);
        if(!weeks) return Methods.responseNotFound(res, "No se han encontrado semanas.");
        else
        {
            return Methods.responseOk(res, weeks);
        }
    });
}

//Exportar
module.exports = {
    getWeek
}