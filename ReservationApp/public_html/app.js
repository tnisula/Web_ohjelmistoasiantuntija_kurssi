//Load express module
var express = require('express');
var db = require('./database');

//Create express server
var app = express();

//Middleware layers
app.use(express.bodyParser());
app.use('/', express.static(__dirname));
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));


//requesthandlers
//This function will handle a client reuquest
//to url: http://localhost:8080/register_user
//This request comes from a form object in client
app.post('/register_user',function(req,res){
    db.addUser(req.body.firstname,req.body.lastname);
    res.redirect('/');
});

app.post('/login',function(req,res){
    db.login(req.body.first, req.body.last,req,res);
});

app.get('/seats',function(req,res){
    if(req.session.logged)
    {
        db.getSeats(res);
    }
    else
    {
        res.sendfile('index.html');
    }
});

app.put('/reserve_seat/:id', function(req,res){
    var id = req.params.id.split(':')[2];
    db.updateSeatInfo(id,req,res);
});

//Set server to listen port 8080
app.listen(8080);


