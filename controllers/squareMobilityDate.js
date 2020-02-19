'use strict'

//Librerias

//Carga de Modelos
var SquareMobility = require('../models/squareMobilityDate');

//Carga de Métodos
var Methods = require('../status/methods');

//Crear Bloque Mobilidad
function createSquareMobility(req, res)
{
    var params = req.body;
    var squareMobility = new SquareMobility();

    if(params.departmentMobility && params.square)
    {
        squareMobility.departmentMobility = params.departmentMobility;
        squareMobility.square = params.square;

        SquareMobility.find({$and: [
            {departmentMobility: squareMobility.departmentMobility},
            {square: squareMobility.square}
        ]}).exec((err, mobilitySquare) => {
            if(err) return Methods.responseErrorServer(res);
            if(mobilitySquare && mobilitySquare.length >= 1) return Methods.responseNotAccepted(res, "Ya existe más de un registro con este bloque.");
            else
            {
                squareMobility.save((err, squareStored) => {
                    if(err) Methods.responseErrorServer(res);
                    if(!squareStored) Methods.responseNotAccepted(res, "Ocurrio un error al guardar el registro");
                    else
                    {
                        return Methods.responseCreated(res, "Bloque de movilidad creado correctamente");
                    }
                })
            }
        })
    }
    else
    {
        return Methods.responseNotAccepted(res, "No puede dejar campos vacios en el formulario.");
    }
}

//Consultar Bloque Movilidad
function getSquareMobility(req, res)
{
    var squareMobilityId = req.params.id;
    SquareMobility.findById(squareMobilityId).populate([{path: 'departmentMobility', populate: [{path: 'mobilityDate', populate: [{path: 'month'}, {path: 'week'}, {path: 'day'}]}, 
    {path: 'department'}]}, {path: 'square', populate: [{path: 'department'}]}]).exec((err, squares) => {
        if(err) return Methods.responseErrorServer(res);
        if(!squares) return Methods.responseNotFound(res, "No se ha encontrado el bloque de movilidad");
        else
        {
            return res.status(200).send({squareMobilities: squares});
        }
    })
}

//Consultar Bloques Movilidad
function getSquaresMobility(req, res)
{
    SquareMobility.find().populate([{path: 'departmentMobility', populate: [{path: 'mobilityDate', populate: [{path: 'month'}, {path: 'week'}, {path: 'day'}]}, 
    {path: 'department'}]}, {path: 'square', populate: [{path: 'department'}]}]).exec((err, squares) => {
        if(err) return Methods.responseErrorServer(res);
        if(!squares) return Methods.responseNotFound(res, "No se ha encontrado ningun bloque");
        else
        {
            return res.status(200).send({squareMobilities: squares});
        }
    })
}

module.exports = {
    createSquareMobility,
    getSquareMobility,
    getSquaresMobility
}