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
    if(params.squareMobility && params.machine && params.operator && params.product && params.indicator)
    {
        mobility.squareMobility = params.squareMobility;
        mobility.machine = params.machine;
        mobility.operator = params.operator;
        mobility.product = params.product;
        mobility.indicator = params.indicator;
        Mobility.find({$and: [
            {squareMobility: mobility.squareMobility},
            {operator: mobility.operator}
        ]}).exec((err, mobilities) => {
            if(err) return Methods.responseErrorServer(res);
            if(mobilities && mobilities.length >= 1) return Methods.responseNotAccepted(res, "Ya existen un registro con el mismo operador");
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
    Mobility.findById(mobilityId).populate([{path: 'squareMobility', populate: [{path: 'departmentMobility', populate: [{path: 'mobilityDate', 
    populate: [{path: 'month'}, {path: 'week'}, {path: 'day'}]}, {path: 'department'}]}, {path: 'square', populate: 
    [{path: 'department'}]}]}, {path: 'machine', populate: [{path: 'square', populate: [{path: 'department'}]}]}, 
    {path: 'operator', populate: [{path: 'employee', populate: [{path: 'position', populate: [{path: 'typeWorker'}, 
    {path: 'costCenter'}]}]}]}, {path: 'product', populate: [{path: 'customer'}]}]).exec((err, mobilities) => {
        if(err) return Methods.responseErrorServer(res);
        if(!mobilities) return Methods.responseNotFound(res, "No se encontro el registro de movilidad. Intente con otro.");
        else
        {
            return res.status(200).send({mobilities: mobilities});
        }
    });
}

//Función Obtener Movilidades
function getMobilities(req, res)
{
    Mobility.find().populate([{path: 'squareMobility', populate: [{path: 'departmentMobility', populate: [{path: 'mobilityDate', 
    populate: [{path: 'month'}, {path: 'week'}, {path: 'day'}]}, {path: 'department'}]}, {path: 'square', populate: 
    [{path: 'department'}]}]}, {path: 'machine', populate: [{path: 'square', populate: [{path: 'department'}]}]}, 
    {path: 'operator', populate: [{path: 'employee', populate: [{path: 'position', populate: [{path: 'typeWorker'}, 
    {path: 'costCenter'}]}]}]}, {path: 'product', populate: [{path: 'customer'}]}]).exec((err, mobilities) => {
        if(err) return Methods.responseErrorServer(res);
        if(!mobilities) return Methods.responseNotFound(res, "No hay registros de movilidad.");
        else
        {
            return res.status(200).send({mobilities: mobilities});
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
            return res.status(200).send({message: "Registro de movilidad eliminado correctamente"})
        }
    });
}

//Función Obtener Movilidades en comun
function getMobilityGraphic(req, res)
{
    var mobilityId = req.params.mobilityDateId;
    var mobility = new Mobility();

    Mobility.find({ $text : { $search: '8', $caseSensitive:false } }).populate([{path: 'squareMobility', populate: [{path: 'departmentMobility', populate: [{path: 'mobilityDate', 
    populate: [{path: 'month'}, {path: 'week'}, {path: 'day'}]}, {path: 'department'}]}, {path: 'square', populate: 
    [{path: 'department'}]}]}, {path: 'machine', populate: [{path: 'square', populate: [{path: 'department'}]}]}, 
    {path: 'operator', populate: [{path: 'employee', populate: [{path: 'position', populate: [{path: 'typeWorker'}, 
    {path: 'costCenter'}]}]}]}, {path: 'product', populate: [{path: 'customer'}]}]).exec((err, mobilities) => {
        if(err) return Methods.responseErrorServer(res);
        if(!mobilities)
        {
            console.log(mobilityId) 
            return Methods.responseNotFound(res, "No se ha encontrado la coincidencia");
        } 
        else
        {
            return res.status(200).send({mobilities: mobilities});
        }
    })
}

module.exports = {
    createMobility,
    getMobility,
    getMobilities,
    removeMobility,
    getMobilityGraphic
}