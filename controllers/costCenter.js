'use strict'

//Cargamos el modelo de costCenter
var CostCenter = require('../models/costCenter');

//Cargamos la libreria de paginaciones
var mongoosePaginate = require('mongoose-pagination');

//Función principal
function home(req, res)
{
    res.status(200).send({
        message: "Hola mundo desde el servidor de NodeJS - Centro_costos"
    });
}

//Función para guardar centro_costos
function saveCostCenter(req, res)
{
    //A la variable parametros le asignamos los valores del body
    var params = req.body;

    //Creamos un objeto del centro_costos
    var costCenter = new CostCenter();

    //Si el usuario llena todos los campos del registro
    if(params.center)
    {
        //Al objeto le asignamos el valor del centro_costos
        costCenter.center =  params.center;

        //El objeto buscara por el documento el centro ingresado
        CostCenter.find({center: costCenter.center.toLowerCase()}, (err, costCenters) => {

            //Si existe un error en la petición al servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentelo más tarde."
            });

            //Si el centro_costos ya esta registrado en la base de datos
            if(costCenters && costCenters.length >= 1)
            {
                return res.status(200).send({
                    message: "Este centro ya existe en la base de datos."
                });
            }

            //Si no existe ninguna clase de error
            else
            {
                //El objeto se guardara en el documento presentando escenarios
                costCenter.save((err, costCenterStored) => {

                    //Si existe un error en la petición al servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentelo más tarde."
                    });

                    //Si no hay ningun error, se guardara en la base de datos
                    if(costCenterStored)
                    {
                        return res.status(201).send({costCenter: costCenterStored});
                        
                    }

                    //Si existe un error de registro
                    else
                    {
                        return res.status(404).send({
                            message: "Algo salio mal al ingresar este registro. Intentelo de nuevo."
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

//Función que consigue los centros
function getCostCenter(req, res)
{
    //A la variable le asignamos el valor de Id del docuemento
    var costCenterId = req.params.id;

    //El objeto buscara por la base de datos el Id
    CostCenter.findById(costCenterId, (err, costCenter) => {
        
        //Si existe un error en la petición al servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        //Si el centro no existe
        if(!costCenter) return res.status(404).send({
            message: "Este centro no existe en la base de datos."
        });

        //Si el centro existe, muestra el documento
        else
        {
            return res.status(200).send({costCenter});
        }
    });
}

//Función para obtener centros paginados
function getCostCenters(req, res)
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
    CostCenter.find().sort('_id').paginate(page, itemsPerPage, (err, centers, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no existen centros en las paginaciones
        if(!centers) return res.status(404).send({
            message: "No hay centros disponibles."
        });

        //Si no existen errores
        return res.status(200).send({
            centers,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}

//Función para actualizar los centros
function updateCostCenter(req, res)
{
    //A la variable le asignamos el valor del Id del documento
    var costCenterId = req.params.id;

    //A la variable update se le asignaran los datos que pasan por body
    var update = req.body;

    //Si el usuario llena todos los campos del registro
    if(update.center)
    {
        //El objeto busca por el documento si el centro se repite
        CostCenter.find({center: update.center.toLowerCase()}, (err, costCenterRepeat) => {

            //Si existe un error en la petición del servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo más tarde."
            });

            //Si el centro ya existe en el documento
            if(costCenterRepeat && costCenterRepeat.length >= 1)
            {
                return res.status(200).send({
                    message: "No puedes actualizar a este centro porque ya existe."
                });
            }

            //Si no existe ningun error
            else
            {
                //El objeto buscara por el documento el Id solicitado
                CostCenter.findByIdAndUpdate(costCenterId, update, {new: true}, (err, costCenterUpdated) => {

                    //Si existe un error en la petición del servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                    });

                    //Si hay algún error al actualizar un registro
                    if(!costCenterUpdated) return res.status(404).send({
                        message: "No se pudo actualizar el centro. Intentalo de nuevo."
                    });

                    //Si no existe ningun error, actualizara el registro
                    else
                    {
                        return res.status(201).send({update: costCenterUpdated});
                    }
                });
            }
        });
    }

    //Si el usuario deja campos vacios
    else
    {
        return res.status(404).send({
            message: "No puedes dejar campos vacios en el formulario"
        });
    }
}

//Función para eliminar los centro_costos
function removeCostCenter(req, res)
{
    //A la variable le asignamos el valor del Id del documento
    var costCenterId = req.params.id;

    //El objeto buscara por el documento el Id solicitado
    CostCenter.findByIdAndRemove(costCenterId, (err, costCenterRemoved) => {

        //Si existe un error en la petición del servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo."
        });

        //Si hay algún error al eliminar un registro
        if(!costCenterRemoved) return res.status(404).send({
            message: "No se pudo eliminar este centro. Intentalo de nuevo."
        });

        //Si no existe ningun error, eliminara el registro
        return res.status(201).send({
            message: "Centro eliminado con exito."
        });
    });
}

//Exportamos los métodos
module.exports = {
    home,
    saveCostCenter,
    getCostCenter,
    getCostCenters,
    updateCostCenter,
    removeCostCenter
}