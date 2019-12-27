'use strict'

//Cargamos el modelo de supervisores
var Supervisor = require('../models/supervisor');
//Cargamos el modelo de bloques
var Square = require('../models/square');
//Cargamos el modelo de operadores
var Operator = require('../models/operator');

//Función principal
function home(req, res)
{
    return res.status(200).send({
        message: "Hola mundo desde el servidor de NodeJS - Supervisor"
    });
}

//Función para obtener a los supervisores
function getSupervisor(req, res)
{
    //Obtenemos el id por parametro
    var supervisorId = req.params.id;

    Supervisor.findById(supervisorId).populate({path: 'employee',
    populate: [{path: 'position', populate: [{path: 'typeWorker'}, {path: 'costCenter'}]},
    {path: 'department'}]}).exec((err, supervisors) => {

        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        if(!supervisors) return res.status(404).send({
            message: "No se encontro el supervisor. Verifique la información."
        });

        return res.status(200).send({supervisors});
    });
}

//Función para obtener supervisores paginados
function getSupervisors(req, res)
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
    Supervisor.find().sort('_id').populate({path: 'employee', 
    populate: [{path: 'position', populate: [{path: 'typeWorker'}, {path: 'costCenter'}]}, 
    {path: 'department'}]}).paginate(page, itemsPerPage, (err, supervisors, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no hay usuarios registrados
        if(!supervisors) return res.status(404).send({
            message: "No hay registros de empleados."
        });

        //Si no existen errores
        else
        {
            //Si no existen errores, muestra los objetos paginados
            return res.status(200).send({
                supervisors,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        }
    });
}

//Función para crear bloques
function saveSquare(req, res)
{
    //Recogemos los elementos que pasan por body
    var params = req.body;

    //Creamos el objeto de Square
    var square = new Square();

    //Si el supervisor llena todo el formulario
    if(params.department)
    {
        //Al objeto le asignamos los valores del body
        square.department = params.department;

        //El objeto buscara por el documento
        Square.find({department: square.department}, (err, squareRepeat) => {

            //Si existe un error en el servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo más tarde."
            });

            //Si el número de bloque y departamento se repiten
            if(squareRepeat && squareRepeat.length >= 1)
            {
                return res.status(200).send({
                    message: "El número de bloque ya esta registrado con este departamento. Verifique su información."
                });
            }

            //Si no existen errores
            else
            {
                //El objeto guardara el documento
                square.save((err, squareStored) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                    });

                    //Si existe un error al guardar el registro
                    if(!squareStored) return res.status(404).send({
                        message: "Surgio un error al crear este bloque. Intentelo de nuevo."
                    });

                    //Si no existen errores
                    return res.status(200).send({square: squareStored});
                });
            }
        });
    }
}

//Función para mostrar los bloques existentes
function getSquare(req, res)
{
    //Recogemos el id por parametro
    var squareId = req.params.id;

    //El objeto buscara por el documento
    Square.findById(squareId).populate({path: 'department'}).exec((err, squares) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        //Si el bloque no existe en la base de datos
        if(!squares) return res.status(404).send({
            message: "Este bloque no existe. Verifica tu información."
        });

        //Si no existen errores, el objeto retornara la información solicitada
        return res.status(200).send({squares});
    });
}

//Función para mostrar los bloques paginados
function getSquares(req, res)
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
    Square.find().sort('_id').populate({path: 'department'}).paginate(page, itemsPerPage, (err, squares, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no hay usuarios registrados
        if(!squares) return res.status(404).send({
            message: "No hay registros de empleados."
        });

        //Si no existen errores
        else
        {
            //Si no existen errores, muestra los objetos paginados
            return res.status(200).send({
                squares,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        }
    });
}

//Función para actualizar el arreglo del bloque
function updateSquares(req, res)
{
    //Recogemos la id del bloque por parametro
    var squareId = req.params.id;
    //Recogemos los datos del body
    var update = req.body;

    //El objeto Bloque buscara por el documento
    Square.find({department: update.department}, (err, squareRepeat) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si el documento se repite
        if(squareRepeat && squareRepeat.length >= 1)
        {
            return res.status(200).send({
                message: "No puedes actualizar a este departamento porque ya existe."
            });
        }

        //Si no existen errores
        else
        {
            //El objeto buscara por el documento el id
            Square.findByIdAndUpdate(squareId, update, {new:true}, (err, squareUpdated) => {

                //Si existe un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                });
                
                //Si existe un error al actualizar el documento
                if(!squareUpdated) return res.status(404).send({
                    message: "Surgio un error al actualizar este documento."
                });

                //Si no existen errores
                else
                {
                    var flag = false;

                    for(var i = 0; i < squareUpdated.numberSquare.length; i++)
                    {
                        
                    }
                }   
            });
        }
    });
}


//Exportamos las funciones
module.exports = {
    home,
    getSupervisor,
    getSupervisors,
    saveSquare,
    getSquare,
    getSquares,
    updateSquares
}