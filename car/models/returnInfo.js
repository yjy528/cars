var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/caradmin');

var staffSchema = new mongoose.Schema({
    sid: Number,
    name : String,
    customer : String,
    actpay : Number,
    oddmoney : Number,
    date : Date,
    manager : String
});

staffSchema.statics.addStaff = function(json,callback){
    returnInfo.checkSid(json.name,function(torf){
        if(torf){
            var s = new returnInfo(json);
            s.save(function(err){
                if(err){
                    callback(-2)
                    return;
                }
                callback(1);
            });

        }else{
            callback(-1);
        }
    });
};
staffSchema.statics.checkSid = function(name,callback){
    this.find({"name" : name} , function(err,results){
        callback(results.length == 0);
    });
};

var returnInfo = mongoose.model("returnInfo",staffSchema);


module.exports = returnInfo;