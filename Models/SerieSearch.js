const mongoose = require('mongoose');

const serieSchema= new mongoose.Schema({
  name:String,
  image:{medium:String},
  summary:String,
  officialSite:String
})


 const serieModel = mongoose.model('series', serieSchema);
 module.exports = serieModel