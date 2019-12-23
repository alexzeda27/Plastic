'use strict'

//Cargamos la libreria para crear el token
var jwt = require('jwt-simple');
//Cargamos la libreria de moment
var moment = require('moment');
//Creamos una clave secreta
var secret = 'secret_key';

//Exportamos el token de trabajadores con sus atributos
exports.createToken = function(worker)
{
    var payload = {
        sub: worker._id,
        nomina: worker.nomina,
        name: worker.name,
        surnameP: worker.surnameP,
        surnameM: worker.surnameM,
        typeWorker: worker.typeWorker,
        position: worker.position,
        department: worker.department,
        image: worker.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    //Codificamos el token de seguridad
    return jwt.encode(payload, secret);
};

