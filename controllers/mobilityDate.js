'use strict'

//Librerias

//Carga de Modelos
var MobilityDate = require('../models/mobilityDate');

//Carga de Métodos
var Methods = require('../status/methods');

//Función Crear Fecha Movilidad
function createMobilityDate(req, res)
{
    var params = req.body;
    var mobilityDate = new MobilityDate();
    if(params.month && params.week && params.day)
    {
        mobilityDate.month = params.month;
        mobilityDate.week = params.week;
        mobilityDate.day = params.day;
        MobilityDate.find({ $and: [
            {week: mobilityDate.week},
            {day: mobilityDate.day}
        ]}).exec((err, mobilities) => {
            if(err) return Methods.responseErrorServer(res);
            if(mobilities && mobilities.length >= 1) return Methods.responseNotAccepted(res, "El día ya existe dentro de la semana. Intente con otro.");
            else
            {
                mobilityDate.save((err, mobilityStored) => {
                    if(err) return Methods.responseErrorServer(res);
                    if(!mobilityStored) return Methods.responseNotAccepted(res, "Ocurrio un error al crear la fecha de movilidad. Intentelo de nuevo.");
                    else
                    {
                        return Methods.responseCreated(res, "Fecha de movilidad creada correctamente.");
                    }
                });
            }
        });
    }
    else
    {
        return Methods.responseNotAccepted(res, "No puede dejar campos vacios en el formulario.");
    }
}

//Función Obtener Fecha Movilidad
function getMobilityDate(req, res)
{
    var mobilityDateId = req.params.id;
    MobilityDate.findById(mobilityDateId).populate([{ path: "month" }, { path: "week" }, { path: "day" }]).exec((err, mobilities) => {
        if(err) return Methods.responseErrorServer(res);
        if(!mobilities) return Methods.responseNotFound(res, "No se ha encontrado la fecha de movilidad. Intente con otro.");
        else
        {
            return res.status(200).send({mobilityDates: mobilities});
        }
    });
}

//Función Obtener Fechas Movilidad
function getMobilityDates(req, res)
{
    MobilityDate.find().populate([{ path: "month" }, { path: "week" }, { path: "day" }]).exec((err, mobilities) => {
        if(err) return Methods.responseErrorServer(res);
        if(!mobilities) return Methods.responseNotFound(res, "No hay fechas de movilidad.");
        else
        {
            return res.status(200).send({mobilityDates: mobilities});
        }
    });
}

//Función Actualizar Fecha Movilidad
function updateMobilityDate(req, res)
{
    var mobilityDateId = req.params.id;
    var update = req.body;
    if(update.month && update.week && update.day)
    {
        MobilityDate.find({ $and: [
            {week: update.week},
            {day: update.day}
        ]}).exec((err, mobilities) => {
            if(err) return Methods.responseErrorServer(res);
            if(mobilities && mobilities.length >= 1) return Methods.responseNotAccepted(res, "El día ya existe dentro de la semana. Intente con otro.");
            else
            {
                MobilityDate.findByIdAndUpdate(mobilityDateId, update, {new: true}, (err, mobilityDateUpdated) => {
                    if(err) return Methods.responseErrorServer(res);
                    if(!mobilityDateUpdated) return Methods.responseNotAccepted(res, "Ocurrio un error al actualizar la fecha de movilidad. Intentelo de nuevo.");
                    else
                    {
                        return Methods.responseCreated(res, "Fecha de movilidad actualizada correctamente");
                    }
                });
            }
        });
    }
    else
    {
        return Methods.responseNotAccepted(res, "No puede dejar campos vacios en el formulario.");
    }
}

//Función Eliminar Fecha Movilidad
function removeMobilityDate(req, res)
{
    var mobilityDateId = req.params.id;
    MobilityDate.findByIdAndRemove(mobilityDateId, (err, mobilityDateRemoved) => {
        if(err) return Methods.responseErrorServer(res);
        if(!mobilityDateRemoved) return Methods.responseNotAccepted(res, "Ocurrio un error al eliminar la fecha de movilidad. Intentelo de nuevo.");
        else
        {
            return Methods.responseOk(res, "Fecha de movilidad eliminada correctamente");
        }
    });
}

//Exportar
module.exports = {
    createMobilityDate,
    getMobilityDate,
    getMobilityDates,
    updateMobilityDate,
    removeMobilityDate
}