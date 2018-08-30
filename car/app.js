var express=require("express");
var app=express();
var control=require("./control/control.js");
var session = require('express-session');

app.set("view engine","ejs");

app.use(express.static("static"));
app.use(session({
    secret: 'shuoshuo',
    resave: false,
    saveUninitialized: true,
}));
// 显示每个页面
app.get("/",control.showIndex);
app.get("/customer",control.showCustomer);
app.get("/rent",control.showRent);
app.get("/return",control.showRecent);
app.get("/statistical",control.showStatistical);
app.get("/class",control.showClass);
app.get("/car",control.showCar);

// 管理员登录验证
app.post("/checklogin",control.checklogin);

//客户信息的增删改查
app.post('/add'	, control.add);
app.get('/staff',control.getAllStaff);
app.delete('/remove/:sid', control.deleteStaff);
app.get('/updata/:sid', control.showUpdate);
app.post('/toupdata/:sid', control.updatestaff);
app.get('/getCustomer', control.getCustomer);

//汽车种类的增删改查
app.post('/addCar'	, control.addCar);
app.get('/allCar',control.getAllCar);
app.delete('/removeCar/:sid', control.deleteCar);
app.get('/updataCar/:sid', control.showUpdateCar);
app.post('/toupdataCar/:sid', control.updateCar);

//汽车信息的增删改查
app.post('/addCarInfo'	, control.addCarInfo);
app.get('/getAllCarName',control.findAllCarName);
app.get('/allCarInfo',control.getAllCarInfo);
app.delete('/removeCarInfo/:sid', control.deleteCarInfo);
app.get('/updataCarInfo/:sid', control.showUpdateCarInfo);
app.post('/toupdataCarInfo/:sid', control.updateCaInfor);

//租赁管理
app.get('/findname',control.findname);
app.get('/allRent',control.getallRent);
app.get('/allRent/:category',control.getByName);
app.get('/updateState/:sid', control.updateState);

app.post('/addRent', control.addRent);


//租车统计
app.get('/rentStatistical',control.getAllRentCar);
app.get('/rentStatis',control.rentStatis);

// 归还
app.get('/returnState/:sid', control.returnState);
app.delete('/removeCarReturn/:sid', control.deleteCarReturn);
app.post('/addReturn', control.addReturn);
app.get('/returnStatistical',control.getAllReturnCar);

app.get("/result",control.showResult);
app.get("/resulttwo",control.showResulttwo);

app.listen(5555);