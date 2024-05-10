'use strict';
const {validationResult} = require( 'express-validator');
var Users = require('../models/users');
const bcrypt = require('bcrypt');
const { error } = require('console');
var controller = {
    userlist: function(req, res) {
        Users.find({}).then(usuarios => {
            console.log(usuarios);
            return res.status(200).send({
                status: 200,
                message: "Usuarios Listados",
                data: usuarios
            });
        }).catch(error => {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: "Error Detectado"
            });
        });
    },
    userSingular: function(req, res) {
        var params = req.params;
        var iduser = params.iduser;
        Users.findOne({ iduser: parseInt(iduser) })
            .then(usuarios => {
                console.log(usuarios);
                return res.status(200).send({
                    status: 200,
                    message: "Usuario Encontrado",
                    data: usuarios
                });
            })
            .catch(error => {
                console.error(error);
                return res.status(500).send({
                    status: 500,
                    message: "Error Detectado"
                });
            });
    }
    
    ,

    createUser: function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                status:400,
                errors:errors.array()
            });
        }
    
        var data = req.body;
        // ¿Usuario existente?
        Users.findOne({ iduser:data.iduser }).then(usuarios => {
            console.log(usuarios);
            //Validacion de usuario duplicado 
            if (usuarios) {
                return res.status(400).send({
                    status:400,
                    message:"Usuario ya existente"
                });
            }

            //Crypt de passwords
            const saltRounds= 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(data.password, salt, function(err, hash){
                    var create_user = new Users();
                    create_user.iduser = data.iduser; 
                    create_user.nombre = data.nombre;
                    create_user.edad = data.edad;
                    create_user.email = data.email;
                    create_user.password = hash;
            
                    create_user.save().then(result => {
                        return res.status(200).send({
                            status: 200,
                            message: "Usuario guardado",
                            data: result
                        });
                    }).catch(error => {
                        console.error(error);
                        return res.status(500).send({
                            status: 500,
                            message: "Error detectado"
                        });
                    });
                });
            });
    
            
        }).catch(error => {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: "Error detectado"
            });
        });
    },
 
     updateUser: function(req, res){

        const errors = validationResult(req);
        if(!errors.isEmpty){
                return res.status(400).send({status:400, errors:errors.array()
                })
        }
        var params = req.params;
        var iduser = params.iduser;

        var data = req.body;
        const saltRounds= 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(data.password, salt, function(err, hash){
                var update_user= {

                    iduser: data.iduser,
                    nombre : data.nombre,
                    edad : data.edad,
                    email: data.email,
                    password: hash
            
                    }
                    Users.findOneAndUpdate({ iduser: parseInt(iduser) },update_user).then(usuarios => {
                       
                       if(!usuarios){
                        return res.status(200).send({
                            status: 200,
                            message: "Usuario No Encontrado",
                          
                        });
                       }
                        console.log(usuarios);
                        return res.status(200).send({
                            status: 200,
                            message: "Usuario Actualizado",
                          
                        });
                    }).catch(error => {
                        console.error(error);
                        return res.status(500).send({
                            status: 500,
                            message: "Error Detectado"
                        });
                    });
            

            });
        });
       
     },

     deleteUser: function(req, res){
        
        var params = req.params;
        var iduser = params.iduser;

        Users.findOneAndDelete({ iduser: parseInt(iduser)}).then(usuarios => {
            console.log(usuarios);
            if(!usuarios){
                return res.status(200).send({
                    status: 200,
                    message: "Usuario No Encontrado",
                  
                });
               }
           
            return res.status(200).send({
                status: 200,
                message: "Usuario Eliminado",
              
            });
        }).catch(error => {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: "Error Detectado"
            });
        });


     }


    
};

module.exports = controller;