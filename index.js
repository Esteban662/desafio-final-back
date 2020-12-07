const connectionString = "mongodb+srv://movies:movies@cluster0.y3bo0.mongodb.net/request-logs?retryWrites=true&w=majority";
const PORT = "4500";
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch')
const RequestLog = require('./Models/RequestLog')
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send({ mensaje: "Funciona" })
})

//GET Serie

app.get('/:serie', (req, res) => {
    fetch(`http://api.tvmaze.com/singlesearch/shows?q=${req.params.serie}`)
        .then((res) => { return res.json() })
        .then((json) => {
            if (!json) {
                res.status(404).send({ "Not Found": "404 Product Not Founded" })
            } else {
                res.status(200).send(json)
                const newRequest = new RequestLog({
                    date: new Date(),
                    search: req.params.serie
                })
                newRequest.save().then((requestSaved)=>{
                    console.log(requestSaved)
                }).catch(err=>{return console.log({"Error":err})})
            }
        }).catch(err => { res.status(500).send({ Error: err }) })
})

mongoose.connect(connectionString, ((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Conexion con base de datos establecida")
        app.listen(PORT, (() => {
            console.log("Server Express Listening")
        }))

    }
}))
