'use strict'

//Librerias

//Carga de Modelos
var Mobility = require('../models/mobility');

//Carga de Métodos
var Methods = require('../status/methods');

//Función Crear Movilidad
function createMobility(req, res)
{
    var params = req.body;
    var mobility = new Mobility();
    if(params.mobilityDate && params.department && params.square && params.machine && params.operator && params.product && params.indicator)
    {
        mobility.mobilityDate = params.mobilityDate;
        mobility.department = params.department;
        mobility.square = params.square;
        mobility.machine = params.machine;
        mobility.operator = params.operator;
        mobility.product = params.product;
        mobility.indicator = params.indicator;
        Mobility.find({mobilityDate: mobility.mobilityDate}, (err, mobilities) => {
            if(err) return Methods.responseErrorServer(res);
            if(mobilities && mobilities.length >= 2) return Methods.responseNotAccepted(res, "Ya existen dos registros con el mismo día. Intente con otro.");
            else
            {
                mobility.save((err, mobilityStored) => {
                    if(err) return Methods.responseErrorServer(res);
                    if(!mobilityStored) return Methods.responseNotAccepted(res, "Ocurrio un error al crear el registro de movilidad. Intente de nuevo.");
                    else
                    {
                        return Methods.responseCreated(res, "Registro de movilidad creado correctamente.");
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

//Función Obtener Movilidad
function getMobility(req, res)
{
    var mobilityId = req.params.id;
    Mobility.findById(mobilityId).populate([{path: 'mobilityDate', populate: [{path: 'month'}, {path: 'week'}, {path: 'day'}]}, {path: 'department'}, {path: 'square', populate: [
        {path: 'department'}]}, {path: 'machine', populate: [{path: 'square', populate: [{path: 'department'}]}]}, {path: 'operator', populate: [
        {path: 'employee', populate: [{path: 'position', populate: [{path: 'typeWorker'}, {path: 'costCenter'}]}, {path: 'department'}]}]}, {path: 'product', populate: [
        {path: 'customer'}]}]).exec((err, mobilities) => {
        if(err) return Methods.responseErrorServer(res);
        if(!mobilities) return Methods.responseNotFound(res, "No se encontro el registro de movilidad. Intente con otro.");
        else
        {
            return Methods.responseOk(res, mobilities)
        }
    });
}

//Función Obtener Movilidades
function getMobilities(req, res)
{
    Mobility.find().populate([{path: 'mobilityDate', populate: [{path: 'month'}, {path: 'week'}, {path: 'day'}]}, {path: 'department'}, {path: 'square', populate: [
    {path: 'department'}]}, {path: 'machine', populate: [{path: 'square', populate: [{path: 'department'}]}]}, {path: 'operator', populate: [
    {path: 'employee', populate: [{path: 'position', populate: [{path: 'typeWorker'}, {path: 'costCenter'}]}, {path: 'department'}]}]}, {path: 'product', populate: [
    {path: 'customer'}]}]).exec((err, mobilities) => {
        if(err) return Methods.responseErrorServer(res);
        if(!mobilities) return Methods.responseNotFound(res, "No hay registros de movilidad.");
        else
        {
            return Methods.responseOk(res, mobilities);
        }
    });
}

//Función Eliminar Movilidad
function removeMobility(req, res)
{
    var mobilityId = req.params.id;
    Mobility.findByIdAndRemove(mobilityId, (err, mobilityRemoved) => {
        if(err) return Methods.responseErrorServer(res);
        if(!mobilityRemoved) return Methods.responseNotAccepted(res, "Ocurrio un error al eliminar el registro de movilidad. Intentelo de nuevo.");
        else
        {
            return Methods.responseOk(res, "Registro de movilidad eliminado correctamente");
        }
    });
}

module.exports = {
    createMobility,
    getMobility,
    getMobilities,
    removeMobility
}