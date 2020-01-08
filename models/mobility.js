' use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MobilitySchema = Schema({

    month: String,
    week: String,
    operatorEncounter: String,
    indicator: String,
    observations: String,
    department: { type: Schema.ObjectId, ref: 'Department' },
    square: { type: Schema.ObjectId, ref: 'Square' },
    machine: { type: Schema.ObjectId, ref: 'Machine' },
    operator: { type: Schema.ObjectId, ref: 'Operator' }
});

module.exports = mongoose.model('Mobilitie', MobilitySchema);