'use strict'

//Cargamos el modelo de supervisores
var Supervisor = require('../models/supervisor');
//Cargamos el modelo de bloques
var Square = require('../models/square');
//Cargamos el modelo de maquinas
var Machine = require('../models/machine');
//Cargamos el modelo de cliente
var Customer = require('../models/customer');
//Cargamos el modelo de roducto
var Product = require('../models/products');
//Cargamos el modelo de operadores
var Operator = require('../models/operator');
//Cargamos el modelo de empleados
var Employee = require('../models/employee');

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
    if(params.numberSquare && params.department)
    {
        //Al objeto le asignamos los valores del body
        square.numberSquare = params.numberSquare;
        square.department = params.department;

        //El objeto buscara por el documento
        Square.find({$and: [

            {numberSquare: square.numberSquare},
            {department: square.department}
            
        ]}).exec((err, squareRepeat) => {

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

    else
    {
        return res.status(406).send({
            message: "No puedes deja campos vacios en el formulario."
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

//Función para listar todos los objetos sin paginar
function getSquaresOnly(req, res)
{
    //El objeto busca en el documento
    Square.find().populate({path: 'department'}).exec((err, squares) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si existe un error al mostrar los objetos
        if(!squares) return res.status(404).send({
            message: "Bloques no encontrados."
        });

        //Si no existen errores
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

//Función para actualizar el departamento del bloque
function updateSquares(req, res)
{
    //Recogemos la id del bloque por parametro
    var squareId = req.params.id;
    //Recogemos los datos del body
    var update = req.body;

    //El objeto Bloque buscara por el documento
    Square.find({$and: [

        {numberSquare: update.numberSquare},
        {department: update.department},
        
    ]}).exec((err, squareRepeat) => {

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
            //Buscaremos el id correspondiente
            Square.findByIdAndUpdate(squareId, update, {new:true}, (err, numberSquareUpdated) => {

                //Si existe un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en la petición del servidor. Intentalo más tarde. 1"
                });

                //Si no se puede actualizar el departamento
                if(!numberSquareUpdated) return res.status(404).send({
                    message: "Ocurrio un error al actualizar el departamento. Intentalo de nuevo."
                });

                //Si no existen errores
                return res.status(201).send({update: numberSquareUpdated});
            });         
        }
    });
}

//Función para eliminar un bloque
function removeSquare(req, res)
{
    //Recogemos el id por parametro
    var squareId = req.params.id;

    //El objeto buscara por el documento
    Square.findByIdAndRemove(squareId, (err, squareDeleted) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo más tarde."
        });

        //Si existe un error al eliminar el bloque
        if(!squareDeleted) return res.status(404).send({
            message: "No se pudo eliminar el bloque. Intentalo de nuevo."
        });

        //Si existen errores
        return res.status(201).send({
            message: "Bloque eliminado correctamente."
        });
    });
}

//Función para agregar maquinas
function saveMachine(req, res)
{
    //Recogemos los datos por el body
    var params = req.body

    //Creamos el objeto de maquina
    var machine = new Machine();

    //Si el usuario no llena los datos dle formulario
    if(params.numberMachine && params.square)
    {
        //Asignamos al objeto el número de la maquina
        machine.numberMachine = params.numberMachine;
        machine.square = params.square;

        //El objeto busca por el documento
        Machine.find({$and: [

            {numberMachine: machine.numberMachine},
            {square: machine.square}

        ]}).exec((err, machineRepeat) => {

            //Si existe un error en el servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentelo de nuevo."
            });

            //Si la maquina se repite
            if(machineRepeat && machineRepeat.length >= 1)
            {
                return res.status(406).send({
                    message: "Los datos de esta maquina ya existen. Intenta con otro."
                });
            }

            //Si no existen errores
            else
            {
                //El objeto guaradara el registro
                machine.save((err, machineStored) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo de nuevo."
                    });

                    //Si existe un error al guardar los datos
                    if(!machineStored) return res.status(406).send({
                        message: "Hubo un error al guardar los datos. Intentalo de nuevo."
                    });

                    //Si no existen errores
                    return res.status(201).send({machine: machineStored});
                });
            }
        });
    }

    else
    {
        return res.status(406).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para mostar los datos de la maquina
function getMachine(req, res)
{
    //Recogemos el id por parametro
    var machineId = req.params.id;

    //El objeto busca por el documento el id
    Machine.findById(machineId).populate({path: 'square', populate: [{path: 'department'}]}).exec((err, machines) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo."
        });

        //Si no se encuentra la maquina solicitada
        if(!machines) return res.status(404).send({
            message: "No se ha encontrado la maquina solicitada. Intente con otra."
        });

        //Si no existen errores
        return res.status(200).send({machines});
    });
}

//Función para listar las maquinas sin paginar
function getMachinesOnly(req, res)
{
    //El objeto buscara la colección
    Machine.find().populate({path: 'square', populate: [{path: 'department'}]}).exec((err, machines) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si no existen documento de maquinas
        if(!machines) return res.status(404).send({
            message: "No hay maquinas para mostrar."
        });

        //Si no existen errores
        return res.status(200).send({machines});
    });
}

//Función para mostrar las maquinas paginadas
function getMachines(req, res)
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
    Machine.find().sort('_id').populate({path: 'square', populate: [{path: 'department'}]}).paginate(page, itemsPerPage, (err, machines, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no hay usuarios registrados
        if(!machines) return res.status(404).send({
            message: "No hay registros de empleados."
        });

        //Si no existen errores
        else
        {
            //Si no existen errores, muestra los objetos paginados
            return res.status(200).send({
                machines,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        }
    });
}

//Función para actualizar maquinas
function updateMachines(req, res)
{
    //Obtenemos el id de la maquina
    var machineId = req.params.id;

    //Obtenemos los datos a actualizar
    var update = req.body;

    //Si el usuario no ingresa todos los campos del formulario
    if(update.numberMachine && update.square)
    {
        //El objeto buscara si hay alguna maquina repetida
        Machine.find({$and: [

            {numberMachine: update.numberMachine},
            {square: update.square}

        ]}).exec((err, machineRepeat) => {

            //Si existe un error en el servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
            });

            //Si la maquina ya existe en la base de datos
            if(machineRepeat && machineRepeat.length >= 1)
            {
                return res.status(406).send({
                    message: "Esta número de maquina ya existe. Prueba con otro número."
                });
            } 

            //Si no existen errores
            else
            {
                //El objeto buscara por el documento el id
                Machine.findByIdAndUpdate(machineId, update, {new:true}, (err, machineUpdated) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
                    });

                    //Si existe un error al actualiza el objeto
                    if(!machineUpdated) return res.status(406).send({
                        message: "Hubo un error al actualizar esta maquina. Intentalo de nuevo."
                    });

                    //Si no existen errores
                    return res.status(201).send({update: machineUpdated});
                });
            }
        });
    }

    else
    {
        return res.status(406).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para eliminar maquinas
function removeMachine(req, res)
{
    //Obtenemos el id de la maquina por parametro
    var machineId = req.params.id;

    //El objeto busca el documento por el id
    Machine.findByIdAndRemove(machineId, (err, machineRemoved) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si existe un error al eliminar la maquina
        if(!machineRemoved) return res.status(406).send({
            message: "Hubo un error al eliminar la maquina. Intentalo de nuevo."
        });

        //Si no existen errores
        return res.status(201).send({
            message: "Maquina eliminada correctamente."
        });
    });
}

//Función para agregar clientes
function createCustomer(req, res)
{
    //Recogemos los datos del body
    var params = req.body;

    //Creamos el objeto de Customer
    var customer = new Customer();

    //Si el usuario llena el formulario
    if(params.customerName)
    {
        //Al objeto le asignamos los valores del body
        customer.customerName = params.customerName;

        //El objeto buscara valores repetidos
        Customer.find({customerName: customer.customerName.toLowerCase()}).exec((err, customerRepeat) => {

            //Si existe un error en el servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
            });

            if(customerRepeat && customerRepeat.length >= 1)
            {
                return res.status(406).send({
                    message: "Ese cliente ya existe. Intente con otro."
                });
            }

            //Si no se repite
            else
            {
                customer.save((err, customerStored) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en el servidor. Intentalo de nuevo más tarde"
                    });

                    //Si existe un error al almacenar el registro
                    if(!customerStored) return res.status(406).send({
                        message: "No se pudo guardar el registro. Intentalo de nuevo"
                    });

                    //Si no existen errores
                    return res.status(201).send({customer: customerStored});
                });
            }
        })
    }

    //Si el usuario no llena el formulario
    else
    {
        return res.status(406).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para obtener los datos de un cliente
function getCustomer(req, res)
{
    //Recogemos el id por parametro
    var customerId = req.params.id;

    //El objeto buscara por el documento los datos
    Customer.findById(customerId, (err, customers) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si no encuentra registros
        if(!customers) return res.status(404).send({
            message: "No se han encontrado el registro de este cliente. Intenta con otro."
        });

        //Si no existen errores
        return res.status(200).send({customers});
    });
}

//Función para obtener todos los clientes sin paginar
function getCustomersOnly(req, res)
{
    Customer.find((err, customers) => {

        //Si existen errores en el servidor.
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si no encuentra ningun registro de clientes
        if(!customers) return res.status(404).send({
            message: "No existen registros de clientes."
        });

        //Si no existen errores
        return res.status(200).send({customers});
    });
}

//Función para listar clientes paginados
function getCustomers(req, res)
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
    Customer.find().sort('_id').paginate(page, itemsPerPage, (err, customers, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no hay usuarios registrados
        if(!customers) return res.status(404).send({
            message: "No hay registros de empleados."
        });

        //Si no existen errores
        else
        {
            //Si no existen errores, muestra los objetos paginados
            return res.status(200).send({
                customers,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        }
    });
}

//Función para actualizar clientes
function updateCustomer(req, res)
{
    //Obtenemos el id del cliente
    var customerId = req.params.id;

    //Recogemos los datos del body
    var update = req.body;

    //Si el usuario llena todo el formulario
    if(update.customerName)
    {
        //El objeto buscara por el documento
        Customer.find({customerName: update.customerName.toLowerCase()}).exec((err, customerRepeat) => {

            //Si existe un error en el servidor
            if(err) return res.status(500).send({
                message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
            });

            //Si existe un cliente igual
            if(customerRepeat && customerRepeat.length >= 1)
            {
                return res.status(406).send({
                    message: "No puedes actualizar a este cliente porque ya existe. Prueba con otro."
                });
            }

            //Si no hay clientes repetidos
            else
            {
                Customer.findByIdAndUpdate(customerId, update, {new: true}, (err, customerUpdated) => {

                    //Si existen errores en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en el servidor. Intentalo más tarde."
                    });

                    //Si existe un error al actualizar el cliente
                    if(!customerUpdated) return res.status(406).send({
                        message: "Hubo un error al actualizar el cliente. Intentelo de nuevo."
                    });

                    //Si no existen errores
                    return res.status(201).send({update: customerUpdated});
                });
            }
        });
    }

    //Si el usuario no llena todo el formulario
    else
    {
        return res.status(406).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para eliminar clientes
function removeCustomer(req, res)
{
    //Recogemos el id por parametro
    var customerId = req.params.id;

    //Buscamos el objeto por el documento
    Customer.findByIdAndRemove(customerId, (err, customerRemoved) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si el objeto no existe
        if(!customerRemoved) return res.status(404).send({
            message: "El cliente no existe. Intenta con otro."
        });

        //SI no existen errores
        return res.status(201).send({
            message: "Cliente eliminado con exito."
        });
    });
}

//Función para crear productos
function createProducts(req, res)
{
    //Recogemos lod datos del body
    var params = req.body;

    //Creamos el objeto de poducto
    var product = new Product();

    //Si el usuario llena todo el formulario
    if(params.nameProduct && params.serialNumber && params.version && params.customer)
    {
        //Asignamos los datos al objeto
        product.nameProduct = params.nameProduct;
        product.serialNumber = params.serialNumber;
        product.version = params.version;
        product.customer = params.customer;

        //El objeto buscara en el documento un registro repetido
        Product.find({$or: [

            {nameProduct: product.nameProduct},
            {serialNumber: product.serialNumber},

        ]}).exec((err, productRepeat) => {

            //Si existen errores en el servidor.
            if(err) return res.status(500).send({
                message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
            });

            //Si el producto se repite
            if(productRepeat && productRepeat.length >= 1)
            {
                return res.status(406).send({
                    message: "Este registro ya existe en la base de datos."
                });
            }

            //Si no existen errores
            else
            {
                //EL objeto guardara el registro
                product.save((err, productStored) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
                    });

                    //Si existe un error al guardar el registro
                    if(!productStored) return res.status(406).send({
                        message: "Hubo un error al guardar este registro. Intentalo de nuevo."
                    });

                    //Si no existen errores
                    return res.status(201).send({product: productStored});
                });
            }
        });
    }

    //Si el usuario no llena todos los datos del formulario
    else
    {
        return res.status(406).send({
            message: "No puedes dejar campos vacios en el formulario."
        });
    }
}

//Función para obtener datos de un producto
function getProduct(req, res)
{
    //Recogemos el id por parametro
    var productId = req.params.id;

    //El objeto buscara el documento
    Product.findById(productId).populate({path: 'customer'}).exec((err, products) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si el objeto no encuentra el documento
        if(!products) return res.status(404).send({
            message: "No se encontro el registro. Intenta con otro."
        });

        //Si no existen errores
        return res.status(200).send({products});
    });
}

//Función para obtener todos los productos sin paginar
function getProductsOnly(req, res)
{
    //EL objeto buscara el documento
    Product.find().populate({path: 'customer'}).exec((err, products) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si no existen registros
        if(!products) return res.status(404).send({
            message: "No se encontraron registros de productos."
        });

        //Si no existen errores
        return res.status(200).send({products});
    });
}

//Función para obtener los datos paginados
function getProducts(req, res)
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
    Product.find().sort('_id').populate({path: 'customer'}).paginate(page, itemsPerPage, (err, products, total) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en la petición del servidor. Intentalo de nuevo más tarde."
        });

        //Si no hay usuarios registrados
        if(!products) return res.status(404).send({
            message: "No hay registros de empleados."
        });

        //Si no existen errores
        else
        {
            //Si no existen errores, muestra los objetos paginados
            return res.status(200).send({
                products,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        }
    });    
}

//Función para actualizar productos
function updateProduct(req, res)
{
    //Recogemos el id por parametro
    var productId = req.params.id;

    //Recogemos los datos del body
    var update = req.body;

    //El objeto buscara un documento repetido
    Product.find({$or: [
        
        {serialNumber: update.serialNumber},
        {version: update.version},
        {customer: update.customer}

    ]}).exec((err, productRepeat) => {

        //Si existe un error en el servidor.
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si el registro se repite
        if(productRepeat && productRepeat.length >= 1)
        {
            return res.status(406).send({
                message: "No se puede actualizar porque este registro ya existe."
            });
        }

        //Si el documento no se repite
        else
        {
            //EL objeto actualizara el documento
            Product.findByIdAndUpdate(productId, update, {new: true}, (err, productUpdated) => {

                //Si existe un error en el servidor
                if(err) return res.status(500).send({
                    message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
                });

                //Si existe un error al actualizar
                if(!productUpdated) return res.status(406).send({
                    message: "Hubo un error al actualizar el registro. Intentalo de nuevo."
                });

                //Si no existen errores
                return res.status(201).send({update: productUpdated});
            });
        }
    });
}

//Función para eliminar productos
function removeProduct(req, res)
{
    //Obtenemos el id del producto
    var productId = req.params.id;

    //El objeto buscara el documento
    Product.findByIdAndRemove(productId, (err, productRemoved) => {

        //Si existen errores en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si el registro no existe
        if(!productRemoved) return res.status(404).send({
            message: "No se encontro el registro. Intenta con otro."
        });

        //Si no existen errores
        return res.status(201).send({
            message: "Producto eliminado con exito."
        });
    });
}

//Función para actualizar el operador
function updateOperator(req, res)
{
    //Obtenemos el numero de nomina del operador
    var operatorId = req.params.id;

    //Obtenemos los datos del body
    var update = req.body;

    //El objeto buscara el payroll
    Operator.findById(operatorId, (err, operatorUpdated) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si el objeto no encuntra el operador
        if(!operatorUpdated) return res.status(404).send({
            message: "No se encontro el operador. Intenta con otro."
        });

        //Si el operador existe
        else
        {
            //Creamos una bandera para bloques
            var flagSquare = false;
            //Creamos una bandera para maquinas
            var flagMachine = false;

            //El bucle recorrera nuestro arreglo de bloques
            for(var i = 0; i < operatorUpdated.square.length; i++)
            {
                //Si encuentra una coincidencia en bloques
                if(operatorUpdated.square[i] == update.square)
                {
                    //Cambia la bandera a true
                    flagSquare = true;
                    break;
                }
            }

            //EL bucle recorrera el arreglo de maquinas
            for(var i = 0; i < operatorUpdated.machine.length; i++)
            {
                //Si encuentra una coincidencia en maquinas
                if(operatorUpdated.machine[i] == update.machine)
                {
                    //Cambia la bandera a true
                    flagMachine = true;
                    break;
                }
            }

            //Si lo que se va a actulizar es el bloque
            if(update.square)
            {
                //Si la bandera de bloques es true
                if(flagSquare == true) return res.status(406).send({
                    message: "No puedes agregar este bloque porque ya esta registrado en el operador."
                });

                //Si la bandera es falsa
                else
                {
                    //El objeto buscara y actualizara los datos
                     return Operator.findByIdAndUpdate(operatorId, {$push: {square: [update.square]}}, {new: true}, (err, operatorUpdated) => {

                        //Si existe un error en el servidor
                        if(err) return res.status(500).send({
                            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
                        });

                        //Si existe un error al actualizar los datos
                        if(!operatorUpdated) return res.status(406).send({
                            message: "Ocurrio un error al actualizar los datos del operador."
                        });

                        //Si no existen errores
                        return res.status(201).send({update: operatorUpdated});
                    });
                }
            }

            //Si lo que se actualizara es la maquina
            if(update.machine)
            {
                //Si la bandera de maquinas es true
                if(flagMachine == true) return res.status(406).send({
                    message: "No puedes agregar esta maquina porque ya esta registrada en el operador."
                });

                //Si la bandera es falsa
                else
                {
                    //El objeto buscara y actualizara los datos
                     return Operator.findByIdAndUpdate(operatorId, {$push: {machine: [update.machine]}}, {new: true}, (err, operatorUpdated) => {

                        //Si existe un error en el servidor
                        if(err) return res.status(500).send({
                            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
                        });

                        //Si existe un error al actualizar los datos
                        if(!operatorUpdated) return res.status(406).send({
                            message: "Ocurrio un error al actualizar los datos del operador."
                        });

                        //Si no existen errores
                        return res.status(201).send({update: operatorUpdated});

                    });
                }
            }

            //Si lo que se actualizara son ambas
            if(update.square && update.machine)
            {
                console.log(update.machine);
                console.log(update.square);

                //El objeto buscara y actualizara los datos
                 return Operator.findByIdAndUpdate(operatorId, {$push: {square: [update.square], machine: [update.machine]}}, {new: true}, (err, operatorUpdated) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
                    });

                    //Si existe un error al actualizar los datos
                    if(!operatorUpdated) return res.status(406).send({
                        message: "Ocurrio un error al actualizar los datos del operador."
                    });

                    //Si no existen errores
                    return res.status(201).send({update: operatorUpdated});
                });
            }

            //Si no se actualiza ninguna de ellas
            else
            {
                //El objeto buscara y actualizara los datos
                return Operator.findByIdAndUpdate(operatorId, update, {new: true}, (err, operatorUpdated) => {

                    //Si existe un error en el servidor
                    if(err) return res.status(500).send({
                        message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
                    });

                    //Si existe un error al actualizar los datos
                    if(!operatorUpdated) return res.status(406).send({
                        message: "Ocurrio un error al actualizar los datos del operador."
                    });

                    //Si no existen errores
                    return res.status(201).send({update: operatorUpdated});
                });
            }
        }
    });
}

//Función para obtener operadores
function getOperators(req, res)
{
    //El objeto buscara los registros
    Operator.find().populate({path: 'employee', populate: [{path: 'position', populate: [{path: 'typeWorker'}, 
    {path: 'costCenter'}]}, {path: 'department'}]}).exec((err, operators) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo maás tarde."
        });

        //Si no existen operadores
        if(!operators) return res.status(404).send({
            message: "No hay ningun operador registrado."
        });

        //Si no existen errores
        return res.status(200).send({operators});
    });
}

//Función para eliminar operadores
function removeOperator(req, res)
{
    //Obtenemos el id por parametro
    var operatorId = req.params.id;

    //El objeto eliminara el registro de operadores
    Operator.findByIdAndRemove(operatorId, (err, operatorDeleted) => {

        //Si existe un error en el servidor
        if(err) return res.status(500).send({
            message: "Hubo un error en el servidor. Intentalo de nuevo más tarde."
        });

        //Si no existe el operador
        if(!operatorDeleted) return res.status(404).send({
            message: "El operador no existe."
        });

        //Si no existen errores
        return res.status(201).send({
            message: "Operado eliminado con exito."
        })
    });
}

//Exportamos las funciones
module.exports = {
    home,
    getSupervisor,
    getSupervisors,
    saveSquare,
    getSquare,
    getSquaresOnly,
    getSquares,
    updateSquares,
    removeSquare,
    saveMachine,
    getMachine,
    getMachinesOnly,
    getMachines,
    updateMachines,
    removeMachine,
    createCustomer,
    getCustomer,
    getCustomersOnly,
    getCustomers,
    updateCustomer,
    removeCustomer,
    createProducts,
    getProduct,
    getProductsOnly,
    getProducts,
    updateProduct,
    removeProduct,
    updateOperator,
    getOperators,
    removeOperator
}