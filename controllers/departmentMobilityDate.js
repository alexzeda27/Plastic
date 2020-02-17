'use strict'

//Librerias

//Carga de Modelos
var DepartmentMobility = require('../models/departmentMobilityDate');

//Carga de Métodos
var Methods = require('../status/methods');

//Crear Departamento Mobilidad
function createDepartmentMobility(req, res)
{
    var params = req.body;
    var departmentMobility = new DepartmentMobility();

    if(params.mobilityDate && params.department)
    {
        departmentMobility.mobilityDate = params.mobilityDate;
        departmentMobility.department = params.department;

        DepartmentMobility.find({department: departmentMobility.department}, (err, mobilityDepartments) => {
            if(err) return Methods.responseErrorServer(res);
            if(mobilityDepartments && mobilityDepartments.length >= 1) return Methods.responseNotAccepted(res, "Ya existe más de un registro con exte departamento.");
            else
            {
                departmentMobility.save((err, departmentStored) => {
                    if(err) Methods.responseErrorServer(res);
                    if(!departmentStored) Methods.responseNotAccepted(res, "Ocurrio un error al guardar el registro");
                    else
                    {
                        return Methods.responseCreated(res, "Departamento de movilidad creado correctamente");
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

//Consultar Departamento Movilidad
function getDepartmentMobility(req, res)
{
    var departmentMobility = req.params.id;
    DepartmentMobility.findById(departmentMobility).populate([{path: 'mobilityDate', populate: [{path: 'month'}, {path: 'week'}, {path: 'day'}]}, {path: 'department'}]).exec((err, departments) => {
        if(err) return Methods.responseErrorServer(res);
        if(!departments) return Methods.responseNotFound(res, "No se ha encontrado el departamento de movilidad");
        else
        {
            return Methods.responseOk(res, departments);
        }
    })
}

//Consultar Departamento Movilidad
function getDepartmentsMobility(req, res)
{
    DepartmentMobility.find().populate([{path: 'mobilityDate', populate: [{path: 'month'}, {path: 'week'}, {path: 'day'}]}, {path: 'department'}]).exec((err, departments) => {
        if(err) return Methods.responseErrorServer(res);
        if(!departments) return Methods.responseNotFound(res, "No se ha encontrado ningun departamento");
        else
        {
            return Methods.responseOk(res, departments);
        }
    })
}

module.exports = {
    createDepartmentMobility,
    getDepartmentMobility,
    getDepartmentsMobility
}