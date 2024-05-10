'use strict';
require('dotenv').config();
const { validationResult } = require('express-validator');
var jwt = require("jsonwebtoken");
var Sessions = require('../models/accesstoken');
var Users = require('../models/users');
const bcrypt = require('bcrypt');
var controller = {
   
    login_user: function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                status: 400,
                errors: errors.array()
            });
        }

        var data = req.body;
        Users.findOne({ email: data.email })
            .then(usuarios => {
                bcrypt.compare(data.password, usuarios.password, function(err, result) {
                   console.log(result);
                if (result) {
                    const payload = {
                        user: usuarios
                    };
                    let access_token = jwt.sign(payload, process.env.KEY, { expiresIn: '1d' });
                    let today = new Date().toISOString();
                    let update_session = {
                        user: usuarios.email,
                        key: access_token,
                        creationDate: today,
                        expirationDate: '1d',
                        active: true
                    }

                    Sessions.findOneAndUpdate({user:usuarios.email}, update_session, {upsert:true, new:true })
                    .then(session => {

                        if (!session) {
                            return res.status(401).send({
                                status: 401,
                                message: "Usuario No Encontrado",
                            });
                        }

                        return res.status(200).send({
                            status: 200,
                            message: "Login Correcto",
                            token: access_token
                        });
                    }).catch(error => {
                        console.error(error);
                        return res.status(500).send({
                            status: 500,
                            message: "Error Detectado"
                        });
                    });
                } else {
                    return res.status(401).send({
                        status: 401,
                        message: "Datos no validos"
                    });
                
                    
                }
                });

            }).catch(error => {
                console.error(error);
                return res.status(401).send({
                    status: 401,
                    message: "Datos no validos"
                });
            });
    },
    logout: function (req, res){
        const token = req.headers ['x-curso2024-access-token']
       Sessions.findOneAndDelete({user:req.decoded.user.email,key:token}).then(session => {
           
            if(!session){
                return res.status(200).send({
                    status: 200,
                    message: "Token Invalido",
                  
                });
               }
           
            return res.status(200).send({
                status: 200,
                message: "Sesion Finalizada",
              
            });
        }).catch(error => {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: "Token Invalido"
            });
        });
    }
}

module.exports = controller;
