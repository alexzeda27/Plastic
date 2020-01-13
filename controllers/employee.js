'use strict'

//Cargamos los modelos
var Employee = require('../models/employee');
var TypeWorker = require('../models/typeWorker');
var Position = require('../models/position');
var Department = require('../models/department');
var Operator = require('../models/operator');
var Supervisor = require('../models/supervisor');

//Cargamos los servicios
var jwt = require('../services/jwt');

//Cargamos la libreria de mongoose-pagination
var mongoosePaginate = require('mongoose-pagination');
//Cargamos la libreria bcrypt
var bcrypt = require('bcrypt-nodejs');
//Cargamos la libreria path de express
var path = require('path');
//Cargamos la libreria fs de express
var fs = require('fs');

//Función principal
function home(req, res)
{
    return res.status(200).send({
        message: "Hola mundo desde el servidor de NodeJS - Empleados."
    });
}

//Función para crear empleados
function saveEmployee(req, res)
{
    //Recogemos los valores por el body
    var params = req.body;

    //Creamos el objeto empleado
    var employee = new Employee();
    //Creamos el objeto de operador
    var operator = new Operator();
    //Creamos el objeto de supervisor
    var supervisor = new Supervisor();

    var modId = "5e018b937c253c4c0f44a3e3";
    var prodSup = "5e01872f7c253c4c0f44a3c8";
    var procSup = "5e0187267c253c4c0f44a3c7";

    //Si el empleado es el administrador.

        //Si el usuario llena todo el formulario
        if(params.payroll && params.name && params.surnameP && params.surnameM 
        && params.username && params.password && params.position && params.department)
        {
            //Al objeto empleado le asignamos los valores del body
            employee.payroll = params.payroll,
            employee.name = params.name,
            employee.surnameP = params.surnameP,
            employee.surnameM = params.surnameM,
            employee.username = params.username,
            employee.image = params.image,
            employee.email = params.email,
            employee.position = params.position,
            employee.department = params.department

            //El objeto buscara por el documento el payroll
            Employee.find({ $or: [

                {payroll: employee.payroll},
                {username: employee.username.toLowerCase()}

            ]}).exec((err, employeeRepeat) => {

                //Si existe un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                });

                //Si el payroll se repite
                if(employeeRepeat && employeeRepeat.length >= 1)
                {
                    return res.status(200).send({
                        message: "Ya existe un empleado con este número de nómina y/o nombre de usuario."
                    });
                }

                //Si no existen errores
                else
                {
                    //Encriptaremos la contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        employee.password = hash;

                            //El objeto se guardara en el documento
                            employee.save((err, employeeStored) => {

                            //Si existe un error en el servidor
                            if(err) return res.status(500).send({
                                message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                            });

                            //Si existe un error de insercción de datos
                            if(!employeeStored) return res.status(404).send({
                                message: "Hubo un error al registar a este empleado. Intentelo de nuevo."
                            });

                            //Si no existen errores
                            else
                            {
                                //Si el empleado es MOD
                                if(modId == employee.position)
                                {
                                    //Los datos se guardaran en el documento de operadores
                                    operator.save(employeeStored, (err, operatorStored) => {

                                        //Si existe un error en el servidor
                                        if(err) return res.status(500).send({
                                            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                                        });
            
                                        //Si existe un error de insercción de datos
                                        if(!operatorStored) return res.status(404).send({
                                            message: "Hubo un error al registar a este operador. Intentalo de nuevo."
                                        });
            
                                        //Si no existen errores, guardara el documento
                                        else
                                        {
                                            //Obtenemos el id del operador
                                            var operatorId = operator.id;

                                            //El objeto buscara por el documento
                                            Operator.findByIdAndUpdate(operatorId, {employee: employeeStored}, {new: true}, (err, operatorUpdated) => {

                                                //Si existe un error en el servidor
                                                if(err) return res.status(500).send({
                                                    message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                                                });

                                                //Si hubo un error al actualizar el documento
                                                if(!operatorUpdated) return res.status(404).send({
                                                    message: "No se pudieron ingresar los datos."
                                                })

                                                //Si no existen errores.
                                                return res.status(201).send({operator: employeeStored});
                                            });
                                        }
                                    });
                                }

                                //Si el empleado es Supervisor
                                if(procSup == employee.position || prodSup == employee.position)
                                {
                                    //Los datos se guardaran en el docuemnto de supervisores
                                    supervisor.save(employeeStored, (err, supervisorStored) => {

                                        //Si existe un error en el servidor
                                        if(err) return res.status(500).send({
                                            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                                        });

                                        //Si existe un error en la insercción de datos
                                        if(!supervisorStored) return res.status(404).send({
                                            message: "Hubo un error al registrar a este supervisor. Intentelo de nuevo."
                                        });

                                        //Si no existen errores, guardara el documento
                                        else
                                        {
                                            //Obtenemos el id del supervisor
                                            var supervisorId = supervisor.id;

                                            //El objeto buscara por el documento
                                            Supervisor.findByIdAndUpdate(supervisorId, {employee: employeeStored}, {new: true}, (err, supervisorUpdated) => {

                                                //Si existe un error en el servidor
                                                if(err) return res.status(500).send({
                                                    message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                                                });

                                                //Si hubo un error al actualizar el documento
                                                if(!supervisorUpdated) return res.status(404).send({
                                                    message: "No se pudieron ingresar los datos al documento de Supervisor"
                                                });

                                                //Si no existen errores
                                                return res.status(201).send({supervisor: employeeStored});
                                            });
                                        }
                                    });
                                }

                                //Si el empleado no es MOD
                                else
                                {
                                    return res.status(201).send({employee: employeeStored});
                                }
                            }
                        });
                    });
                }
            });
        }

        //Si el usuario no llena completamente el formulario
        else
        {
            return res.status(404).send({
                message: "No puedes dejar campos vacios en el formulario."
            });
        }
    }

//Función para logear empleados
function loginEmployee(req, res)
{
    //Recogemos los parametros por el body
    var params = req.body;

    //A las variables le asignamos los valores
    var username = params.username;
    var payroll = params.payroll;

    //El objeto buscara por el documento el email
    Employee.findOne({username: username}, (err, employee) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        //Si encuentra el correo
        if(employee)
        {
            //El objeto buscara el payroll 
            Employee.findOne({payroll: payroll}, (err, check) => {

                //Si hay un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor."
                });

                //Si la contraseña es incorrecta
                if(!check) return res.status(404).send({
                    message: "La password es incorrecta. Verifique nuevamente."
                });

                //Si la contraseña es correcta
                else
                {
                    //Si pide parametros de token
                    if(params.gettoken)
                    {
                        //Nos devuelve el token cifrado
                        return res.status(200).send({
                            token: jwt.createToken(employee)
                        });
                    }
              
                    //Si no, nos regresa el objeto empleado
                    return res.status(201).send({employee});
                }

            });
        }

        //Si el correo es incorrecto
        else
        {
            return res.status(404).send({
                message: "El nombre de usuario es incorrecto. Verifique nuevamente."
            });
        }
    });
}

//Función para obtener empleados por payroll
function getEmployee(req, res)
{
    //Asignamos como parametro el payroll
    var payroll = req.params.payroll;

    //El objeto busca por payroll y muestra sus documentos
    Employee.findOne({payroll: payroll}).populate({path: 'position', 
    populate: [{path: 'typeWorker'}, {path: 'costCenter'}]}).exec((err, employee) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        //Si el objeto no encuentra el documento
        if(!employee) return res.status(404).send({
            message: "No se encontro al empleado solicitado."
        });

        //Si no se presentan errores
        else
        {
            //Department desplegara su información
            Department.populate(employee, {path: 'department'}, (err, check) => {

                //Si existe un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                });

                //Si el objeto no encuentra el documento con el departamento
                if(!check) return res.status(404).send({
                    message: "No se encontro al empleado solicitado."
                });

                //Si no existen errores
                else
                {
                    return res.status(200).send({employee});
                }
            });
        }
    });
}

//Función para obtener employees paginados
function getEmployees(req, res)
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
    Employee.find().sort('_id').populate({path: 'position', 
    populate: [{path: 'typeWorker'}, {path: 'costCenter'}]})
    .paginate(page, itemsPerPage, (err, employees, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no hay usuarios registrados
        if(!employees) return res.status(404).send({
            message: "No hay registros de empleados."
        });

        //Si no existen errores
        else
        {
            //El objeto de departamento mostrara su contenido
            Department.populate(employees, {path: 'department'}, (err, doc) => {

                //Si existe un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                });

                //Si existe un error en la consulta
                if(!doc) return res.status(404).send({
                    message: "Hubo un error al consultar el registro."
                });

                //Si no existen errores, muestra los objetos paginados
                return res.status(200).send({
                    employees,
                    total,
                    pages: Math.ceil(total/itemsPerPage)
                });
            });
        }
    });
}

//Función para actualizar los datos del empleado
function updateEmployee(req, res)
{
    //Recogemos el valor del payroll
    var payroll = req.params.payroll;

    //Recogemos los valores del body
    var update = req.body;

        //Si el empleado es el administrador

            //El objeto buscara por el documento
            Employee.find({ $or: [

                {payroll: update.payroll},
                {username: update.username.toLowerCase()}

            ]}).exec((err, employeeRepeat) => {

                var employee_isset = false;
                console.log(employeeRepeat);

                employeeRepeat.forEach((employee) => {
                    if(employee.payroll != payroll) employee_isset = true;
                });

                if(employee_isset) return res.status(500).send({
                    message: "Los datos de este empledo ya existen."
                });

                //El objeto buscara y actualizara
                Employee.findOneAndUpdate({payroll: payroll}, update, {new: true}, (err, employeeUpdated) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                    });

                    //Si la actualización tuvo un error
                    if(!employeeUpdated) return res.status(404).send({
                        message: "No se pudo actualizar este registro. Intentelo de nuevo."
                    });

                    else
                    {
                        return res.status(201).send({update: employeeUpdated});
                    }
                });
                
            });

    
}

//Función para eliminar datos del empleado
function removeEmployee(req, res)
{
    //Recogemos los parametros de payroll
    var payroll = req.params.payroll;
    var employeeId = req.params.id;
    var employee = req.params.employee;

    var employeePosition = req.params.position;

    var operatorId = req.params.id;
    var operatorEmployee = req.params.employee;
    var supervisorEmployee = req.params.employee;

    //Asignamos el id del administrador de personal
    var adminId = "5e061947c6a5b323fc1f28a9"

    var modId = "5e018b937c253c4c0f44a3e3";
    var prodSup = "5e01872f7c253c4c0f44a3c8";
    var procSup = "5e0187267c253c4c0f44a3c7";


    //Si el empleado es el administrador

        //El objeto buscara el documento solicitado
        Employee.findOneAndRemove({payroll: payroll}, (err, employeeDeleted) => {

            //Si existe un error en el servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo más tarde."
            });

            //Si se presenta algun error al eliminar el registro
            if(!employeeDeleted) return res.status(404).send({
                message: "Este número de nomina no existe. Verifique su información."
            });

            //Si no existen errores
            else
            {

                if(employeePosition == modId)
                {
                    Operator.findByIdAndRemove(employeeDeleted, (err, operators) => {

                        if(err) return res.status(500).send({
                            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                        });

                        if(!operators) return res.status(400).send({
                            message: "Surgio un error al eliminar este operador."
                        });

                        return res.status(200).send({
                            message: "Operador eliminado correctamente."
                        });
                    });
                }

                if(employeePosition == prodSup || employeePosition == procSup)
                {
                    Supervisor.findByIdAndRemove(employeeDeleted, (err, supervisors) => {

                        if(err) return res.status(500).send({
                            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                        });

                        if(!supervisors) return res.status(400).send({
                            message: "Surgio un error al eliminar a este supervisor."
                        });

                        return res.status(200).send({
                            message: "Supervisor eliminado correctamente."
                        });
                    });
                }

                return res.status(200).send({
                    message: "Empleado eliminado correctamente."
                });
            }
        });

}

//Función para subir imágenes del empleado
function uploadImageEmployee(req, res)
{
    //Obtenemos el payroll por parametro
    var payroll = req.params.payroll;

    //Si el archivo ya fue cargado
    if(req.files)
    {
        //Obtenemos la imágen completa
        var file_path = req.files.image.path;
        console.log(file_path);

        //Cortamos la imágen 
        var file_split = file_path.split('\\');
        console.log(file_split);

        //Obtenemos solo el nombre de la imágen
        var file_name = file_split[2];
        console.log(file_name);

        //Cortamos la extensión de la imágen
        var ext_split = file_name.split('\.');
        console.log(ext_split);

        //Obtenemos la extensión
        var file_ext = ext_split[1];
        console.log(file_ext);

        //Si los ficheros cargados son
        if(file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif')
        {
            //Actualizar documento del empleado
            Employee.findOneAndUpdate({payroll: payroll}, {image: file_name}, {new: true}, (err, imageUpdated) => {
                
                //Si hay un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                });

                //Si existe un error al actualizar la imágen
                if(!imageUpdated) return res.status(404).send({
                    message: "No se ha podido actualizar la imágen."
                });
                
                //Si no existen errores
                return res.status(200).send({employee: imageUpdated});
            });
        }
    
        //Si la extensión no es valida para la imágen
        else
        {
            //Método que elimina el archiv cargado
            fs.unlink(file_path, (err) => {
    
                return res.status(200).send({
                    message: "Extensión del archivo no valida."
                });
            });
        }
    }

    //Si no se han cargado imagenes
    else
    {
        return res.status(200).send({
            message: "No se han cargado imagenes."
        });
    }
}

//Función que devuelve imágenes de empleado
function getImageFiles(req, res)
{
    //Obtenemos el fichero 
    var image_file = req.params.imageFile;
    //Obtenemos la ruta donde se encuentra el fichero
    var path_file = './uploads/employees/' + image_file;

    //Comprobamos de que el fichero existe
    fs.exists(path_file, (exists) => {

        //Si existe el fichero, devuelve la imagen
        if(exists) res.sendFile(path.resolve(path_file));

        //Si no existe el fichero
        else
        {
            return res.status(404).send({
                message: "La imagen no existe en la base de datos."
            });
        }
    });
}

//Función que elimina las imágenes de empleado
function removeImageFiles(req, res)
{
    //Obtenemos el fichero
    var image_file = req.params.imageFile;

    var payroll = req.params.payroll;
    //Obtenemos la ruta donde se encuentra el fichero
    var path_file = './uploads/employees/' + image_file;

    //Comprobamos de que el fichero existe
    fs.exists(path_file, (exists) => {

        //Si existe el fichero elimina la imágen
        if(exists)
        {
            //Si existe el fichero, elimina la imagen
            if(exists) fs.unlink(path_file, (err) => {

                //Si existe un error 
                if(err) return res.status(500).send({
                    message: "Error al eliminar el archivo."
                });

                //Si no existen errores
                else
                {
                    Employee.findOneAndUpdate({payroll: payroll}, {$unset: {image: ""}}, (err, imageDeleted) => {

                        if(err) return res.status(500).send({
                            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
                        });

                        if(!imageDeleted) return res.status(406).send({
                            message: "Hubo un error al eliminar la imágen del documento de empleados."
                        });

                        return res.status(200).send({
                            message: "Imágen elimnada correctamente."
                        })
                    });
                }
            });
            
        } 

        //Si no existe el fichero
        else
        {
            return res.status(404).send({
                message: "La imágen no existe en la base de datos."
            });
        }
    });
}

//Exportamos los métodos
module.exports = {
    home,
    saveEmployee,
    loginEmployee,
    getEmployee,
    getEmployees,
    updateEmployee,
    removeEmployee,
    uploadImageEmployee,
    getImageFiles,
    removeImageFiles
}