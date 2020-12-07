const mongoose = require('mongoose');

const requestSchema= new mongoose.Schema({
  date: String,
  search: String
})


 const requestModel = mongoose.model('logs', requestSchema);
 module.exports = requestModel