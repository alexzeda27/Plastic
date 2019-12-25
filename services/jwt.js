'use strict'

//Cargamos la libreria para crear el token
var jwt = require('jwt-simple');
//Cargamos la libreria de moment
var moment = require('moment');
//Creamos una clave secreta
var secret = 'secret_key';

//Exportamos el token de trabajadores con sus atributos
exports.createToken = function(employee)
{
    var payload = {
        sub: employee._id,
        payroll: employee.nomina,
        name: employee.name,
        surnameP: employee.surnameP,
        surnameM: employee.surnameM,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        image: employee.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    //Codificamos el token de seguridad
    return jwt.encode(payload, secret);
};

