'use strict'

//Cargamos el modelo de tipo_trabajador
var TypeWorker = require('../models/typeWorker');

//Función principal
function home(req, res)
{
    res.status(200).send({
        message: "Hola mundo desde el servidor de NodeJs - Tipo_trabajador"
    });
}

//Función para guardar tipo de trabajadores
function saveTypeWorker(req, res)
{
    //A la variable parametros le asignamos los valores del body
    var params = req.body;

    //Creamos un objeto del tipo de trabajador
    var typeWorker = new TypeWorker();

    //Si el usuario llena todos los campos del registro
    if(params.type)
    {
        //Al objeto le asignamos el valor del tipo de trabajador
        typeWorker.type = params.type;

        //El objeto buscara por el documento el usuario ingresado
        TypeWorker.find({type: typeWorker.type.toLowerCase()}, (err, typeWorkersRepeat) => {

            //Si existe un error en la petición al servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo más tarde."
            });

            //Si el tipo de trabajador ya esta registrado en la base de datos
            if(typeWorkersRepeat && typeWorkersRepeat.length >= 1)
            {
                return res.status(200).send({
                    message: "Este tipo de trabajador ya existe en la base de datos."
                });
            }

            //Si no existe ninguna clase de error
            else
            {
                //El objeto se guardara en el documento presentando escenarios
                typeWorker.save((err, typeStored) => {

                    //Si existe un error en la petición al servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                    });

                    //Si no hay ningun error, se guardara en la base de datos
                    if(typeStored)
                    {
                        return res.status(201).send({typeWorker: typeStored});
                    }

                    //Si existe un error de registro
                    else
                    {
                        return res.status(404).send({
                            message: "Hubo un error al registar este tipo de usuario. Intentalo de nuevo."
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

//Función que consigue los tipos de trabajadores
function getTypeWorker(req, res)
{
    //A la variable le asignamos el valor de Id del docuemento
    var typeWorkerId = req.params.id;

    //El objeto buscara por la base de datos el Id
    TypeWorker.findById(typeWorkerId, (err, typeWorker) => {

        //Si existe un error en la petición al servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        //Si el tipo de trabajador no existe
        if(!typeWorker)
        {
            return res.status(404).send({
                message: "Este tipo de usuario no existe en la base de datos."
            });
        }

        //Si el tipo de trabajador existe, muestra el documento
        else
        {
            return res.status(200).send({typeWorker});
        }
    });
}

//Función para actualizar los tipos de trabajadores
function updateTypeWorker(req, res)
{
    //A la variable le asignamos el valor del Id del documento
    var typeWorkerId = req.params.id;

    //A la variable update se le asignaran los datos que pasan por body
    var update = req.body;

    //Si el usuario llena todos los campos del registro
    if(update.type)
    {
        //El objeto busca por el documento si el tipo de trabajador se repite
        TypeWorker.find({type: update.type.toLowerCase()}, (err, repeatType) => {

            //Si existe un error en la petición del servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo más tarde."
            });

            //Si el tipo de trabajador ya existe en el documento
            if(repeatType && repeatType.length >= 1)
            {
                return res.status(200).send({
                    message: "No puedes actualizar a este tipo de trabajador porque ya existe."
                });
            } 

            //Si no existe ningun error
            else
            {
                //El objeto buscara por el documento el Id solicitado
                TypeWorker.findByIdAndUpdate(typeWorkerId, update, {new: true}, (err, typeUpdated) => {

                    //Si existe un error en la petición del servidor
                    if(err) return res.status(500).send({
                        message: "Hubo  un error en la petición del servidor. Intentalo más tarde."
                    });

                    //Si hay algún error al actualizar un registro
                    if(!typeUpdated) return res.status(404).send({
                        message: "No se pudo actualizar el tipo de trabajador. Intentalo de nuevo"
                    });

                    //Si no existe ningun error, actualizara el registro
                    return res.status(201).send({
                        message: {update: typeUpdated}
                    });
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

//Función para eliminar los tipos de trabajadores
function removeTypeWorker(req, res)
{
    //A la variable le asignamos el valor del Id del documento
    var typeWorkerId = req.params.id;

    //El objeto buscara por el documento el Id solicitado
    TypeWorker.findByIdAndRemove(typeWorkerId, (err, typeWorkerRemove) => {

        //Si existe un error en la petición del servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        //Si hay algún error al eliminar un registro
        if(!typeWorkerRemove) return res.status(404).send({
            message: "No se pudo eliminar este tipo de trabajador. Intentalo de nuevo."
        });

        //Si no existe ningun error, eliminara el registro
        return res.status(201).send({
            message: "Tipo de trabajador eliminado con exito."
        });
    });
}                                                                                                  
                                                                                                  
//Exportamos las funciones a las rutas                                                                                                  
module.exports = {                                                                                                  
    home,                                                                                                  
    saveTypeWorker,                                                                                                  
    getTypeWorker,                                                                                                  
    updateTypeWorker,                                                                                                  
    removeTypeWorker                                                                                                 
}                                                                                                  
