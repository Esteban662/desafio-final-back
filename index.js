const connectionString = "mongodb+srv://movies:movies@cluster0.y3bo0.mongodb.net/request-logs?retryWrites=true&w=majority";
const PORT = "4500";
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch')
const RequestLog = require('./Models/RequestLog')
const SerieSearch = require('./Models/SerieSearch')
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send({ mensaje: "Funciona" })
})
app.set('trus proxy', true)
//GET Serie

app.get('/:serie', (req, res) => {

    SerieSearch.findOne({name : req.params.serie})
        .then((SerieFinded)=>{
            if(SerieFinded){
                res.status(200).send(SerieFinded)
                const newRequest = new RequestLog({
                    date: new Date(),
                    search: req.params.serie,
                    ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
                    responseFrom: "CACHE"
                })
            }else{
                fetch(`http://api.tvmaze.com/singlesearch/shows?q=${req.params.serie}`)
                .then((res)=>{return res.json()})
                .then((json)=>{
                    if(!json){return res.status(404).send({"Not Founded":"404 Serie Not Founded"})}
                    else{
                        res.status(200).send(json)
                        const newSerie = new SerieSearch({
                            name:json.name,
                            image:{medium:json.image.medium},
                            summary:json.summary,
                            officialSite:json.officialSite
                           })
                           newSerie.save().then((serieSaved)=>{
                               return console.log(serieSaved)
                            }).catch(err=>{ return console.log({"Error guardando serie":err})})
                            const newRequest = new RequestLog({
                                date: new Date(),
                                search: req.params.serie,
                                ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
                                responseFrom:"API"
                            })
                            newRequest.save().then((requestSaved) => {
                                console.log(requestSaved)
                            }).catch(err => { return console.log({ "Error": err }) })
                    }
                })
            }
        })
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
