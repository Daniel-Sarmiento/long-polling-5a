const express = require('express');
const cors = require('cors');
const app = express();


// 2
const notificaciones = [
    {id: 1, cuerpo: "se te ha asignado una actividad"}, // 0
    {id: 2, cuerpo: "te eliminaron de un proyecto"} // 1
]

let resClientes = [];

app.use(cors());
app.use(express.json());

app.get('/notificaciones', (req, res) => {

    res.status(200).json({
        success: true,
        notificaciones
    })
});

//  [res1, res2]
app.get('/nueva-notificacion', (req, res) => {
    resClientes.push(res); // res3
    // [res1, res2, res3]

    req.on('close', () => {
        const index = resClientes.length - 1; // 3 - 1 = 2
        resClientes = resClientes.slice(index, 1); // elimina res3
    });
});

app.post('/notificaciones', (req, res) => {
    let idNotificacion = notificaciones.length > 0 ? notificaciones[notificaciones.length -1].id + 1 : 1;

    const notificacion = {
        id: idNotificacion,
        cuerpo: req.body.cuerpo
    }

    notificaciones.push(notificacion);

    // responder a los clientes conectados
    responderClientes(notificacion);

    res.status(201).json({
        success: true,
        message: "notificación creada"
    })
});

function responderClientes(notificacion) {
    for (res of resClientes) {
        res.status(200).json({
            success: true,
            notificacion
        });
    }
    resClientes = [];
}

app.listen(3000, () => console.log("servidor en puerto 3000"))
