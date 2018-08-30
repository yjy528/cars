var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/caradmin');
var crypto=require("crypto");

var kittySchema = mongoose.Schema({
    uname: String,
    psword: String
});

var user = mongoose.model('user', kittySchema);

exports.findUname=function(name,callback){
    user.findOne({"uname":name},function(err,obj){
        callback(err,obj);
    })
}