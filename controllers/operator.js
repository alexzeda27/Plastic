'use strict'

//Cargamos el modelo de Operators
var Operator = require('../models/operator');
//Cargamos el modelo de Employee
var Employee = require('../models/employee');

//Función principal
function home(req, res)
{
    return res.status(200).send({
        message:"Hola mundo desde el servidor de NodeJS - Operador"
    });
}

//Función para obtener a los operadores
function getOperator(req, res)
{
    var operatorId = req.params.id;

    console.log(operatorId);

    Operator.findById(operatorId).populate({path: 'employee', 
    populate: [{path: 'position', populate: [{path: 'typeWorker'}, {path: 'costCenter'}]},
    {path: 'department'}]}).exec((err, operators) => {

        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        if(!operators) return res.status(404).send({
            message: "Este operador no existe. Verifica tu información."
        });

        return res.status(200).send({operators});
    });
}

//Función para obtener a los operadores paginados
function getOperators(req, res)
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
    Operator.find().sort('_id').populate({path: 'employee', 
    populate: [{path: 'position', populate: [{path: 'typeWorker'}, {path: 'costCenter'}]}, 
    {path: 'department'}]}).paginate(page, itemsPerPage, (err, operators, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no hay usuarios registrados
        if(!operators) return res.status(404).send({
            message: "No hay registros de empleados."
        });

        //Si no existen errores
        else
        {
            //Si no existen errores, muestra los objetos paginados
            return res.status(200).send({
                operators,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        }
    });
}

module.exports = {
    home,
    getOperator,
    getOperators
}