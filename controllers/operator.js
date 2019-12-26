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
    var employee = new Employee();

    var payroll = req.params.payroll;

    console.log(payroll);

    Operator.find({employee: {$payroll: payroll}}).populate({path: 'employee', 
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

module.exports = {
    home,
    getOperator
}