const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../modelos/usuario');
const { verificaToken, AuthAdmin } = require('../middlewares/autenticacion');
const app = express();


app.get('/usuario', verificaToken, (req, res) => {



    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            });


        });

})
app.post('/usuario', [verificaToken, AuthAdmin], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })


})
app.put('/usuario/:id', [verificaToken, AuthAdmin], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            usuarioDB
        });
    });


})
app.delete('/usuario/:id', [verificaToken, AuthAdmin], (req, res) => {

    let id = req.params.id;

    let body = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // if (usuarioEliminado.estado === false) {
        //     return res.status(400).json({
        //         ok: false,
        //         err: 'Usuario no encontrado'
        //     })
        // }
        res.json({
            ok: true,
            usuarioEliminado
        })
    })

    // Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }
    //     if (!usuarioEliminado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }
    //     res.json({
    //         ok: true,
    //         usuarioEliminado
    //     })
    // });

})

module.exports = app;