'use strict'

//Códigos HTTP

//Función GET


//Función POST & PUT
function responseCreated(res, message)
{
    return res.status(201).send({message: message});
}

//Función GET Not Found
function responseNotFound(res, message)
{
    return res.status(404).send({message: message});
}

//Función POST & PUT Not Accepted
function responseNotAccepted(res, message)
{
    return res.status(406).send({message: message});
}

//Función ErrorServer
function responseErrorServer(res)
{
    return res.status(500).send({message: "Hubo un error la petición del servidor. Intentelo de nuevo más tarde."});
}

//Exportar
module.exports = {
    responseCreated,
    responseNotFound,
    responseNotAccepted,
    responseErrorServer
}
