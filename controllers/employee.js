'use strict'

//Cargamos el modelo de empleados
var Employee = require('../models/employee');

//Cargamos la libreria de mongoose-pagination
var mongoosePaginate = require('mongoose-pagination');

//Función principal
function home(req, res)
{
    return res.status(200).send({
        message: "Hola mundo desde el servidor de NodeJS - Empleados."
    });
}

//Función para crear empleados
function saveEmployee(req, res)
{
    var params = req.body;

    var employee = new Employee();

    if(params.payroll && params.name && params.surnameP && params.surnameM && params.typeWorker && params.position && params.department)
    {
        employee.payroll = params.payroll,
        employee.name = params.name,
        employee.surnameP = params.surnameP,
        employee.surnameM = params.surnameM,
        employee.image = params.image,
        employee.typeWorker = params.typeWorker,
        employee.position = params.position,
        employee.department = params.department

        Employee.find({payroll: employee.payroll.toLowerCase()}, (err, employeeRepeat) => {

            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
            });

            if(employeeRepeat && employeeRepeat.length >= 1)
            {
                return res.status(200).send({
                    message: "Ya existe un empleado con este número de nómina."
                });
            }

            else
            {
                employee.save((err, employeeStored) => {

                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                    });

                    if(!employeeStored) return res.status(404).send({
                        message: "Hubo un error al registar a este empleado. Intentelo de nuevo."
                    });

                    else
                    {
                        return res.status(201).send({employee: employeeStored});
                    }
                });
            }
        });
    }

    else
    {
        return res.status(404).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Exportamos los métodos
module.exports = {
    home,
    saveEmployee
}