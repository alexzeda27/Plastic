'use strict'

//Cargamos al libreria de jwt-simple
var jwt = require('jwt-simple');
//Cargamos la libreria de moment
var moment = require('moment');
//Creamos una clave secreta
var secret = 'secret_key';

//Función para exportar los permisos del token
exports.ensureAuth = function(req, res, next)
{
    //Si la cabecera no tiene el token
    if(!req.headers.authorization)
    {
        return res.status(403).send({
            message: "Error en la petición, no tiene la cabecera de autenticación."
        });
    }

    //El token se reemplaza con una expresión regular
    var token = req.headers.authorization.replace(/['"]+/g, '');

    //Si es correcto
    try
    {
        //Se decodifica el token
        var payload = jwt.decode(token, secret);

        //Si aun no vence el tiempo de expiración
        if(payload.exp <= moment().unix())
        {
            return res.status(401).send({
                message: "El token ha expirado."
            });
        }
    }

    //Si no es correcto
    catch(ex)
    {
        return res.status(404).send({
            message: "El token no es valido."
        });
    }

    //Mandamos el token por el archivo de empleados
    req.employee = payload;
    
    next();
}