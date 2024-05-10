'use strict'
const mongoose = require('mongoose');
var app = require("./app");
var port = 3001;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://micgutierrez17:w95nhrirwlzsAwJx@cluster0.q7qiz3k.mongodb.net/curso2024",{useNewUrlParser:true, useUnifiedTopology: true})
.then(() => {
    console.log("Cnnexión a la base de datos establecida con exito");
    var server = app.listen(port,() =>{
        console.log(`El servidor está en puerto ${port}`)
    });

    server.timeout = 120000;
})
.catch(err => console.log(err));