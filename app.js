'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos la libreria de body-parser
var bodyParser = require('body-parser');
var cors = require('cors');

//A la variable app le asignamos los métodos de express
var app = express();

app.use(cors());

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
//Cargamos la ruta de supervisores
var supervisor_routes = require('./routes/supervisor');
//Cargamos la ruta de movilidad
var mobility_routes = require('./routes/mobility');
var monthRoutes = require('./routes/month');
var weekRoutes = require('./routes/week');
var dayRoutes = require('./routes/day');
var mobilityDateRoutes = require('./routes/mobilityDate');
var mobilityRoutes = require('./routes/mobility');

var departmentMobility = require('./routes/departmentMobilityDate');

var squareMobility = require('./routes/squareMobilityDate');

//Middlewares

//Parseamos los datos por la URI
app.use(bodyParser.urlencoded({ extended: false }));
//Los codificamos como Json
app.use(bodyParser.json());

//Cors

//Rutas
app.use('/api', monthRoutes);
app.use('/api', weekRoutes);
app.use('/api', dayRoutes);
app.use('/api/tipo-trabajador', typeWorker_routes);
app.use('/api/centro-costo', costCenter_routes);
app.use('/api', department_routes);
app.use('/api', position_routes);
app.use('/api', employee_routes);
app.use('/api', supervisor_routes);
app.use('/api', mobility_routes);
app.use('/api', mobilityDateRoutes);
app.use('/api', mobilityRoutes);

app.use('/api', departmentMobility);

app.use('/api', squareMobility);

//Exportar
module.exports = app;