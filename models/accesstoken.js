'use strict'

const mongoose = require('mongoose');
const { type } = require('os');
var Schema = mongoose.Schema;
var AccesstokenSchema = Schema({
    user:{type: String, require: true, unique: true},
    key: String,
    creationDate: Date,
    expirationDate: String,
    active: Boolean
})

module.exports = mongoose.model('accesstoken',AccesstokenSchema);