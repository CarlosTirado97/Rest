const jwt = require('jsonwebtoken');

// ======================
// VERIFICAR TOKEN
// ======================



let verificaToken = (req, res, next) => {


    //como obtener el header token
    let token = req.get('token');
    jwt.verify(token, process.env.SECRET_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

};


// ======================
// VERIFICAR ADMIN
// ======================

let AuthAdmin = (req, res, next) => {

    let usuario = req.usuario
    console.log(usuario.role);
    if (usuario.role == 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tienes autorizacion'
            }
        })
    }

}

module.exports = {
    verificaToken,
    AuthAdmin
}