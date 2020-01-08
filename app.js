'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos la libreria de body-parser
var bodyParser = require('body-parser');

//A la variable app le asignamos los métodos de express
var app = express();

//Cargar rutas

//Cargamos la ruta de tipo de trabajadores
var typeWorker_routes = require('./routes/typeWorker');
//Cargamos la ruta de centro_costos
var costCenter_routes = require('./routes/costCenter');
//Cargamos la ruta de departamentos
var department_routes = require('./routes/department');
//Cargamos la ruta de puestos
var position_routes = require('./routes/position');
//Cargamos la ruta de empleados
var employee_routes = require('./routes/employee');
//Cargamos la ruta de operadores
var operator_routes = require('./routes/operator');
//Cargamos la ruta de supervisores
var supervisor_routes = require('./routes/supervisor');

var mobility_routes = require('./routes/mobility');

//Middlewares

//Parseamos los datos por la URI
app.use(bodyParser.urlencoded({ extended: false }));
//Los codificamos como Json
app.use(bodyParser.json());

//Cors

//Rutas
app.use('/api/tipo-trabajador', typeWorker_routes);
app.use('/api/centro-costo', costCenter_routes);
app.use('/api', department_routes);
app.use('/api/puesto', position_routes);
app.use('/api', employee_routes);
app.use('/api/operador', operator_routes);
app.use('/api/supervisor', supervisor_routes);

app.use('/api/movilidad', mobility_routes);

//Exportar
module.exports = app;