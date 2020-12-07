const mongoose = require('mongoose');

const requestSchema= new mongoose.Schema({
  date: String,
  search: String,
  ip:String,
  responseFrom:String
})


 const requestModel = mongoose.model('logs', requestSchema);
 module.exports = requestModel