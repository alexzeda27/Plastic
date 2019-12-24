'use strict'

//Cargamos los modelos
var Employee = require('../models/employee');
var TypeWorker = require('../models/typeWorker');
var Position = require('../models/position');
var Department = require('../models/department');

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
    //Recogemos los valores por el body
    var params = req.body;

    //Creamos el objeto empleado
    var employee = new Employee();

    //Si el usuario llena todo el formulario
    if(params.payroll && params.name && params.surnameP && params.surnameM && params.position && params.department)
    {
        //Al objeto empleado le asignamos los valores del body
        employee.payroll = params.payroll,
        employee.name = params.name,
        employee.surnameP = params.surnameP,
        employee.surnameM = params.surnameM,
        employee.image = params.image,
        employee.position = params.position,
        employee.department = params.department

        //El objeto buscara por el documento el payroll
        Employee.find({payroll: employee.payroll.toLowerCase()}, (err, employeeRepeat) => {

            //Si existe un error en el servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
            });

            //Si el payroll se repite
            if(employeeRepeat && employeeRepeat.length >= 1)
            {
                return res.status(200).send({
                    message: "Ya existe un empleado con este número de nómina."
                });
            }

            //Si no existen errores
            else
            {
                //El objeto se guardara en el documento
                employee.save((err, employeeStored) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                    });

                    //Si existe un error de insercción de datos
                    if(!employeeStored) return res.status(404).send({
                        message: "Hubo un error al registar a este empleado. Intentelo de nuevo."
                    });

                    //Si no existen errores
                    else
                    {
                        return res.status(201).send({employee: employeeStored});
                    }
                });
            }
        });
    }

    //Si el usuario no llena completamente el formulario
    else
    {
        return res.status(404).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para consultar empleados
function getEmployee(req, res)
{
    //Recogemos el id por parametro
    var employeePayroll = req.params.payroll;

    //El objeto buscara por payroll y mostrara su contenido
    Employee.find(employeePayroll).populate({path: 'position', 
    populate: [{path: 'typeWorker'}, {path: 'costCenter'}]}).exec((err, employee) => {

        //Si existe error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si se presenta algun error de consulta
        if(!employee) return res.status(404).send({
            message: "Hubo un error en la consulta. Intentalo de nuevo."
        });

        //Si no existen errores en puesto
        else
        {
            //Se añadira la parte del departamento
            Department.populate(employee, {path: 'department'}, (err, doc) => {

                //Si existe un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                });
                
                //Si existe un error de consulta
                if(!doc) return res.status(404).send({
                    message: "Hubo un error en la consulta. Intentalo de nuevo."
                });

                //Si no existen errores, se presenta el objeto
                return res.status(200).send({employee});
            });
        }
    });
}

//Función para obtener employees paginados
function getEmployees(req, res)
{
    //Inicializamos la página en 1
    var page = 1;

    //Si se obtienen los parametros de la página
    if(req.params.page)
    {
        //obtenemos los valores que se pasen por parametro
        page = req.params.page;
    }

    //Objetos por página son 10
    var itemsPerPage = 10;

    //El objeto busca por el documento y despliega su contenido
    Employee.find().sort('_id').populate({path: 'position', 
    populate: [{path: 'typeWorker'}, {path: 'costCenter'}]})
    .paginate(page, itemsPerPage, (err, employees, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no hay usuarios registrados
        if(!employees) return res.status(404).send({
            message: "No hay registros de empleados."
        });

        //Si no existen errores
        else
        {
            //El objeto de departamento mostrara su contenido
            Department.populate(employees, {path: 'department'}, (err, doc) => {

                //Si existe un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                });

                //Si existe un error en la consulta
                if(!doc) return res.status(404).send({
                    message: "Hubo un error al consultar el registro."
                });

                //Si no existen errores, muestra los objetos paginados
                return res.status(200).send({
                    employees,
                    total,
                    pages: Math.ceil(total/itemsPerPage)
                });
            });
        }
    });
}

//Función para actualizar los registros
function updateEmployee(req, res)
{
    var employeePayroll = req.params.payroll;

    var update = req.body;

    if(update.payroll && update.name && update.surnameP && 
    update.surnameM && update.position && update.department)
    {
        Employee.find({payroll: update.payroll}, (err, employeeRepeat) => {

            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
            });

            if(employeeRepeat && employeeRepeat.length >= 1)
            {
                return res.status(404).send({
                    message: "No puedes actualizar a este número de nomina porque ya existe."
                });
            }

            else
            {
                Employee.findOneAndUpdate(employeePayroll, update, {new: true}, (err, employeeUpdated) => {

                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor, Intentalo de nuevo más tarde."
                    });

                    if(!employeeUpdated) return res.status(404).send({
                        message: "Ocurrio un error al actualizar este registro. Intentelo de nuevo."
                    });

                    return res.status(201).send({update: employeeUpdated});
                });
            }
        });
    }

    else
    {
        return res.status(404).send({
            message: "No puedes dejar campos vacios en el formulario."
        })
    }
}

//Exportamos los métodos
module.exports = {
    home,
    saveEmployee,
    getEmployee,
    getEmployees,
    updateEmployee
}