'use strict'

//Cargamos el modelo de Position
var Position = require('../models/position');
var TypeWorker = require('../models/typeWorker');
var CostCenter = require('../models/costCenter');

//Cargamos la libreria de paginaciones
var mongoosePaginate = require('mongoose-pagination');

//Función principal
function home(req, res)
{
    res.status(200).send({
        message: "Hola mundo desde el servidor de NodeJS - Puestos"
    });
}

//Función para registar puestos
function savePosition(req, res)
{
    //Recogemos la información que hay por body
    var params = req.body;

    //Creamos el objeto de Position
    var position = new Position();

    //Si el usuario llena todos los campos del registro
    if(params.positionName && params.typeWorker && params.costCenter)
    {
        //Al objeto le asignamos los valores del formulario
        position.positionName = params.positionName;
        position.typeWorker = params.typeWorker;
        position.costCenter = params.costCenter;

        //Si el usuario llena todos los campos del registro
        Position.find({positionName: position.positionName.toLowerCase()}, (err, positionRepeat) => {

            //Si existe un error en el servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
            });

            //Si existe un registro con el mismo nombre
            if(positionRepeat && positionRepeat.length >= 1)
            {
                return res.status(200).send({
                    message: "Este puesto ya existe en la base de datos."
                });
            }

            //Si no existen errores
            else
            {
                //El objeto guardara el registro
                position.save((err, positionStored) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                    });

                    //Si no existen errores al guardar el registro
                    if(positionStored) return res.status(201).send({position: positionStored});

                    //Si se presenta algun error de insercción
                    else
                    {
                        return res.status(404).send({
                            message: "Hubo un error al registrar este puesto. Intentalo de nuevo."
                        });
                    }
                });
            }
        });
    }

    //Si el usuario no llena todos los campos del formulario
    else
    {
        return res.status(404).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para obtener registros
function getPosition(req, res)
{
    //Recogemos como parametro el id del registro
    var positionId = req.params.id;

    //El objeto buscara por la base de datos el Id
    Position.findById(positionId).populate({path: 'costCenter'}).exec((err, position) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si existe un error de insercción del registro
        if(!position) return res.status(404).send({
            message: "No se encontro el registro deseado. Intentalo de nuevo"
        });

        //Si no hay errores
        else
        {
            //Buscara el id referenciado
            TypeWorker.populate(position, {path: 'typeWorker'}, (err, doc) => {

                //Si existen errores en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                });

                //Si existe algun error en la consulta
                if(!doc) return res.status(404).send({
                    message: "No se encontro el registro deseado."
                });

                //Si no existen errores
                else
                {
                    return res.status(200).send({position});
                }
            });
        }
    });
}

//Función para obtener puestos paginados
function getPositions(req, res)
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

    //El objeto busca por el documento
    Position.find().sort('_id').populate({path: 'costCenter'}).paginate(page, itemsPerPage, (err, positions, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no existen puestos en las paginaciones
        if(!positions) return res.status(404).send({
            message: "No hay puestos disponibles."
        });

        //Si no existen errores
        else
        {
            //El objeto de tipo_trabajador mostrara su atributo
            TypeWorker.populate(positions, {path: 'typeWorker'}, (err, doc) => {

                //Si existe un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                });

                //Si se presenta algun error de consulta
                if(!doc) return res.status(404).send({
                    message: "No se encontro el registro deseado."
                });

                //Si no existen errores
                return res.status(200).send({
                    positions,
                    total,
                    pages: Math.ceil(total/itemsPerPage)
                });
            });
        }
    });
}

//Función para obtener puestos sin paginar
function getPositionsOnly(req, res)
{
    Position.find().populate({path: 'costCenter'}).exec((err, positions) => {

        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        if(!positions) return res.status(406).send({
            message: "Hubo un error al listar los registros."
        });

        else
        {
            TypeWorker.populate(positions, {path: 'typeWorker'}, (err, doc) => {

                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                });

                if(!doc) return res.status(404).send({
                    message: "Hubo un error al listar los registros."
                });

                return res.status(200).send({positions});
            });
        }
    });
}

//Función para actualizar los datos de puestos
function updatePosition(req, res)
{
    //Recogemos como parametro el id del registro
    var positionId = req.params.id;
    //Recogemos los demas campos del registro
    var update = req.body;

    //Si el usuario ingresa todos los campos del formulario
    if(update.positionName)
    {
        //El objeto buscara por el documento el nombre del registro solicitado
        Position.find({positionName: update.positionName.toLowerCase()}, (err, positionRepeat) => {
    
            //Si existe un error en el servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
            });
    
            //Si hay mas de un registro en la base de datos
            if(positionRepeat && positionRepeat.length >= 1)
            {
                return res.status(200).send({
                    message: "No puedes actualizar a este puesto porque ya existe."
                });
            }
    
            //Si no existen errores
            else
            {
                //El objeto buscara el id y lo actualizara
                Position.findByIdAndUpdate(positionId, update, {new: true}, (err, positionUpdated) => {
    
                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde"
                    });
    
                    //Si se presenta algun error al actualizar los datos
                    if(!positionUpdated) return res.status(404).send({
                        message: "Surgió un error al actualizar este puesto. Intentalo de nuevo."
                    });
    
                    //Si no existen errores
                    return res.status(201).send({update: positionUpdated});
                });
            }
        });
    }

    //Si el usuario deja campos vacios en el formulario
    else
    {
        return res.status(404).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para eliminar un registro de puestos
function removePosition(req, res)
{
    //Recogemos el id del registro como parametro
    var positionId = req.params.id;

    //El objeto buscara por el documento el id
    Position.findByIdAndRemove(positionId, (err, positionRemoved) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si existe un error al eliminar un registro
        if(!positionRemoved) return res.status(404).send({
            message: "Surgió un error al eliminar este registro. Intentalo de nuevo."
        });

        //Si no existen errores
        return res.status(201).send({
            message: "El registro se ha eliminado correctamente."
        });
    });
}

//Exportamos los métodos
module.exports = {
    home,
    savePosition,
    getPosition,
    getPositions,
    getPositionsOnly,
    updatePosition,
    removePosition
}