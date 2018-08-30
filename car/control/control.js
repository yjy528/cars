var formidable=require("formidable");
var crypto=require("crypto");
var user=require("../models/user.js");
var Staff=require("../models/customer.js");
var Car=require("../models/carCategory.js");
var CarInfo=require("../models/carinfo.js");
var rentInfo=require("../models/rentInfo.js");
var returnInfo=require("../models/returnInfo.js");

var url=require("url");

// 显示各个页面
exports.showIndex=function(req,res){
    res.render("index");
}
exports.showCustomer=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("customer1",{
        "uname":req.session.uname
    });
}
exports.showRent=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("rent-register2",{
        "uname":req.session.uname
    });
}
exports.showRecent=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("return-register3",{
        "uname":req.session.uname
    });
}
exports.showStatistical=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("statistical-analysis4",{
        "uname":req.session.uname
    });
}
exports.showClass=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("category-files5",{
        "uname":req.session.uname
    });
}
exports.showCar=function(req,res){
    if(!(req.session.login==1 && req.session.uname)){
        res.send("本页面需要登录，请<a href='/'>登录</a>");
        return;
    }
    res.render("car-files6",{
        "uname":req.session.uname
    });
}

// 登录检测
exports.checklogin=function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files) {
        var uname=fields.uname;
        var psword=fields.psword;
        var jiami=crypto.createHmac('sha256',psword).digest('hex');
        user.findUname(uname, function (err, obj) {
            if (!obj) {
                res.json({"result": -1})
                return;
            }
            if(jiami===obj.psword){
                req.session.login=1;
                req.session.uname=uname;
                res.json({"result": 1});
                return;
            }else{
                res.json({"result":-2});
                return;
            }
        })
    })
}

// 客户信息的增删改查
exports.add=function (req,res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Staff.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};
exports.deleteStaff = function(req,res){
    var sid = req.params.sid;
    Staff.find({"_id" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }


        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
};
exports.showUpdate = function(req,res){
    var sid = req.params.sid;
    Staff.find({"_id" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result":-1});
            return;
        }
        res.json({
            "updata" : results
        });
    });
};
exports.updatestaff = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Staff.find({"_id" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }

            var thestaff = results[0];
            thestaff.name = fields.name;
            thestaff.sex = fields.sex;
            thestaff.phone = fields.phone;
            thestaff.address = fields.address;
            thestaff.idcard = fields.idcard;
            thestaff.license = fields.license;


            //持久化
            thestaff.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
};
exports.getAllStaff = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    Staff.count({},function(err,count){
        Staff.find({}).sort({"sid":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

};
exports.getCustomer=function(req,res){
    Staff.find({},function(err,results){
        res.json({"results" : results});
    });
}

//汽车档案的增删改查
exports.addCar=function (req,res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Car.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};
exports.deleteCar = function(req,res){
    var sid = req.params.sid;
    Car.find({"_id" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
};
exports.showUpdateCar = function(req,res){
    var sid = req.params.sid;
    Car.find({"_id" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result":-1});
            return;
        }
        res.json({
            "updata" : results
        });
    });
};
exports.updateCar = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

        Car.find({"_id" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestaff = results[0];
            //更改属性
            // thestaff.sid = fields.sid;
            thestaff.category = fields.category;
            //持久化
            thestaff.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
};
exports.getAllCar = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    Car.count({},function(err,count){
        Car.find({}).sort({"sid":1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

};

//汽车信息的增删改查
exports.addCarInfo=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        CarInfo.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};
exports.deleteCarInfo = function(req,res){
    var sid = req.params.sid;
    CarInfo.find({"_id" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
};
exports.showUpdateCarInfo = function(req,res){
    var sid = req.params.sid;
    CarInfo.find({"_id" : sid},function(err,results){

        if(results.length == 0){
            res.json({"result":-1});
            return;
        }
        res.json({
            "updata" : results
        });
    });
};
exports.updateCaInfor = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

        CarInfo.find({"_id" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestaff = results[0];
            //更改属性
               thestaff.name  = fields.name;
               thestaff.category  = fields.category;
               thestaff.price  = fields.price;

            //持久化
            thestaff.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
};
exports.getAllCarInfo = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    CarInfo.count({},function(err,count){
        CarInfo.find({}).sort({"sid":1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};
exports.findAllCarName=function(req,res){
    Car.find({},function(err,obj){
        res.json({"results" : obj});
    })
}

//租赁
exports.findname=function(req,res){
    CarInfo.find({},function(err,obj){
        // console.log(obj);
        var arr=[];
        for(var i=0;i<obj.length;i++){
            arr.push(obj[i].category)
        }

        function unique3(arr){
            var res = [];
            var obj = {};
            for(var i=0; i<arr.length; i++){
                if( !obj[arr[i]] ){
                    obj[arr[i]] = 1;
                    res.push(arr[i]);
                }
            }
            return res;
        }
        res.json({
            "allname":unique3(arr),
            "all":obj
        });
    })
}
exports.getallRent = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    CarInfo.count({},function(err,count){
        CarInfo.find({}).sort({"state":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};
exports.getByName = function(req,res){
    var category = req.params.category;
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    CarInfo.count({"category":category},function(err,count){
        CarInfo.find({"category":category}).sort({"state":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};
exports.addRent=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        rentInfo.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};
exports.updateState = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
     CarInfo.find({"_id" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestaff = results[0];
            //更改属性
            thestaff.state  = 1;
            thestaff.rentcount  = parseInt(thestaff.rentcount) + 1;
            //持久化
            thestaff.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
};

//租车统计
exports.getAllRentCar = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    rentInfo.count({},function(err,count){
        rentInfo.find({}).sort({"sid":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};

//归还
exports.rentStatis=function(req,res){  //在租赁的所有车
    rentInfo.find({},function(err,obj){
        res.json({"all":obj});
    })
}
exports.returnState = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    CarInfo.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }
        var thestaff = results[0];
        //更改属性
        thestaff.state  = 0;
        //持久化
        thestaff.save(function(err){
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        });
    });
};
exports.deleteCarReturn = function(req,res){
    var sid = req.params.sid;
    rentInfo.find({"sid" : sid},function(err,results){
        // console.log(results);
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
};
exports.addReturn=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        returnInfo.addStaff(fields,function(result){
            res.json({"result" : result});
        });
    });
};

// 归还统计
exports.getAllReturnCar = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 9;
    returnInfo.count({},function(err,count){
        returnInfo.find({}).sort({"sid":-1}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
};

exports.showResult=function(req,res){
    CarInfo.find({},function(err,result){
        res.json({"result":result})
    })
}
exports.showResulttwo=function(req,res){
    returnInfo.find({},function(err,result){
        res.json({"result":result})
    })
}
// exports.getAll=function(req,res){
//     Kitten.find({},function(err,r){
//
//         if(err){
//             return;
//         }
//         res.json({
//             "results":r
//         })
//     })
// };
// exports.updateInfo=function(req,res){
//     var sid=req.params.sid;
//     var form = new formidable.IncomingForm();
//     form.parse(req,function(err,fields,files){
//         Kitten.update({"num":sid},{"$set":fields},function(err,r){
//             res.redirect("/")
//             // res.send("修改成功<a href='/'>返回查看结果</a>")
//         })
//     })
// }
//















