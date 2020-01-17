'use strict'

//Cargamos el modelo de Department
var Department = require('../models/department');

//Cargamos la libreria de paginaciones
var mongoosePaginate = require('mongoose-pagination');

//Función principal
function home(req, res)
{
    res.status(200).send({
        message: "Hola mundo desde el servidor de NodeJS - Departamentos"
    });
}

//Función para registar departamentos
function saveDepartment(req, res)
{
    //A la variable parametros le asignamos los valores del body
    var params = req.body;

    //Creamos un objeto del Department
    var department = new Department();

    //Si el usuario llena todos los campos del registro
    if(params.departmentName)
    {
        //Al objeto le asignamos el valor del nombre del departamento
        department.departmentName = params.departmentName;

        //El objeto buscara por el documento el departamento ingresado
        Department.find({departmentName: department.departmentName.toLowerCase()}, (err, departmentsRepeat) => {

            //Si existe un error en la petición al servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo más tarde."
            });

            //Si el departamento ya esta registrado en la base de datos
            if(departmentsRepeat && departmentsRepeat.length >= 1)
            {
                return res.status(200).send({
                    message: "Este departamento ya existe en la base de datos."
                });
            }

            //Si no existe ninguna clase de error
            else
            {
                //El objeto se guardara en el documento presentando escenarios
                department.save((err, departmentStored) => {

                    //Si existe un error en la petición al servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                    });

                    //Si no hay ningun error, se guardara en la base de datos
                    if(departmentStored) return res.status(201).send({department: departmentStored});

                    //Si existe un error de registro
                    else
                    {
                        return res.status(404).send({
                            message: "Algo salio mal al ingresar este registro. Intentalo de nuevo."
                        });
                    }
                });
            }
        });        
    }

    //Si el usuario no llena todos los campos del registro
    else
    {
        return res.status(404).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para conseguir los departamentos
function getDepartment(req, res)
{
    //A la variable le asignamos el valor de Id del docuemento
    var departmentId = req.params.id;

    //El objeto buscara por la base de datos el Id
    Department.findById(departmentId, (err, department) => {

        //Si existe un error en la petición al servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        //Si el departamento no existe
        if(!department) return res.status(404).send({
            message: "Este departamento no existe en la base de datos."
        });

        //Si el departamento existe, muestra el documento
        else
        {
            return res.status(200).send({department});
        }
    });
}

//Función para obtener departamentos paginados
function getDepartments(req, res)
{
    //Incializamos la página en 1
    var page = 1;

    //Si se obtienen los parametros de la página
    if(req.params.page)
    {
        //Obtenemos los valores que se pasen como parametro
        page = req.params.page;
    }

    //Objetos por página son 10
    var itemsPerPage = 10;

    //EL objeto busca por el documento
    Department.find().sort('_id').paginate(page, itemsPerPage, (err, departments, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no existen centros en las paginaciones
        if(!departments) return res.status(404).send({
            message: "No hay centros disponibles."
        });

        //Si no existen errores
        return res.status(200).send({
            departments,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}

//Función para listar sin paginar
function getDepartmentsOnly(req, res)
{
    Department.find((err, departments) => {
        
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        if(!departments) return res.status(406).send({
            message: "Surgio un error al listar los registros."
        });

        else
        {
            return res.status(200).send({departments});
        }
        
    });
}

//Función para actualizar los departamentos
function updateDepartment(req, res)
{
    //A la variable le asignamos el valor del Id del documento
    var departmentId = req.params.id;

    //A la variable update se le asignaran los datos que pasan por body
    var update = req.body;

    //Si el usuario llena todos los campos del registro
    if(update.departmentName)
    {
        //El objeto busca por el documento si el centro se repite
        Department.find({departmentName: update.departmentName.toLowerCase()}, (err, departmentRepeat) => {

            //Si existe un error en la petición del servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo más tarde."
            });

            //Si el departamento ya existe en el documento
            if(departmentRepeat && departmentRepeat.length >= 1)
            {
                return res.status(200).send({
                    message: "No puedes actualizar a este departamento porque ya existe."
                });
            }

            //Si no existe ningun error
            else
            {
                //El objeto buscara por el documento el Id solicitado
                Department.findByIdAndUpdate(departmentId, update, {new: true}, (err, departmentUpdated) => {

                    //Si existe un error en la petición del servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                    });

                    //Si hay algún error al actualizar un registro
                    if(!departmentUpdated) return res.status({
                        message: "No se pudo actualizar este departamento. Intentalo de nuevo."
                    });

                    //Si no existe ningun error, actualizara el registro
                    else
                    {
                        return res.status(201).send({update: departmentUpdated});
                    }
                });
            }
        });
    }

    //Si el usuario deja campos vacios
    else
    {
        return res.status(404).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para eliminar los departamentos
function removeDepartment(req, res)
{
    //A la variable le asignamos el valor del Id del documento
    var departmentId = req.params.id;

    //El objeto buscara por el documento el Id solicitado
    Department.findByIdAndRemove(departmentId, (err, departmentRemoved) => {

        //Si existe un error en la petición del servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        //Si hay algún error al eliminar un registro
        if(!departmentRemoved) return res.status(404).send({
            message: "No se pudo eliminar este departamento. Intentalo de nuevo."
        });

        //Si no existe ningun error, eliminara el registro
        return res.status(201).send({
            message: "Departamento eliinado con exito."
        });
    });
}

//Exportamos los métodos
module.exports = {
    home,
    saveDepartment,
    getDepartment,
    getDepartments,
    getDepartmentsOnly,
    updateDepartment,
    removeDepartment
}