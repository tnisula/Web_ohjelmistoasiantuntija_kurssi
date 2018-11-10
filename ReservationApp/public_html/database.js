var mongoose = require('mongoose');

var url = 'mongodb://localhost/data';

//Connect to database using the url defined below
mongoose.connect(url,function(err,res){
    
    if(err){
        console.log('Could not connect to database:' + url);
    }
    else{
        console.log('Connected to database:' + url);
    }
});

var Schema = mongoose.Schema;

//Create the needed schema for your data
var user = new Schema({
    first:{type:String, default:'No Name'},
    last:String,
    created:{type:Date, default:Date.now},
    isAdmin:{type:Boolean,unique:true}
});

//Register schema and store the model
var UserModel = mongoose.model("user",user);

var admin = new UserModel({
    first:'admin',
    last:'administrator',
    isAdmin:true
});

var koe = new UserModel({
    first:'koe',
    last:'koe',
    isAdmin:false
}); 

// admin.save(dbErrors); // run once to create admin account to db
// koe.save(dbErrors); 

var row = {
    placePrice:Number,
    seat:Number,
    reserved:Boolean,
    user:[user]
};


var seat = new Schema({
   place_id:{type:String,primary:true, unique:true},
   place:[row]
});

var SeatModel = mongoose.model('seat',seat);

createSeats(); 

function login(firstName,lastName,req,response){
    
    var query = {
        first:firstName,
        last:lastName
    };
    
    UserModel.findOne(query,function(err,match)
    {
        
        if(err){
            response.send('Error in login');
        }
        else
        {
            if(match){
                req.session.userF = req.body.first;
                req.session.userL = req.body.last;
                req.session.logged = true;
                if(match.first === 'admin' )
                {
                    response.sendfile('main_admin.html');    
                }
                else
                {
                    response.sendfile('main.html');
                }
            }
            else{
               response.send("Credentials not found"); 
            }
            
        }
    }); 
}

function addUser(firstname,lastname)
{
    if(firstname === 'admin')
        return;
    var temp = new UserModel({
        first:firstname,
        last:lastname,
        created: new Date()
    });
    
    temp.save(dbErrors);
}

function getSeats(resp)
{
    SeatModel.find(function(err,seats){
        
        if(!err)
            resp.send(seats);
    });
}

function updateSeatInfo(id,req,resp){

    SeatModel.findOne({},{'place._id':id},function(err,model_parent){
        if(err)
            resp.send('Error in reservation. Try again later');
        for(var i = 0; i < model_parent.place.length; i++){
            // Note: model_parent.place[i]._id is Obhect id
            // id is string
            // Cannot compare different types with ===,
            // because === does not type cast
            // == does type casting
            if(model_parent.place[i]._id == id) 
            {
                model_parent.place[i].reserved = true;
                model_parent.place[i].user = {first:req.session.userF,last:req.session.userL};
                model_parent.save(dbErrors);
                break;
            }
        }
        resp.send(req.session.userF + " " + req.session.userL);
    });
}

function removeReservation(id,req,resp){

    SeatModel.findOne({},{'place._id':id},function(err,model_parent){
        if(err)
            resp.send('Error in reservation. Try again later');
        for(var i = 0; i < model_parent.place.length; i++){
            // Note: model_parent.place[i]._id is Obhect id
            // id is string
            // Cannot compare different types with ===,
            // because === does not type cast
            // == does type casting
            if(model_parent.place[i]._id == id) 
            {
                model_parent.place[i].reserved = false;
                model_parent.place[i].user = {first:req.session.userF,last:req.session.userL};
                model_parent.save(dbErrors);
                break;
            }
        }
        resp.send(req.session.userF + " " + req.session.userL);
    });
}

function dbErrors(err)
{
    if(err){
          console.log('Error saving to db:' + err);
    }
    else{
          console.log('Data stored in database');
    }
}

function createSeats()
{
    var prices = new Array(12,12,12,10,15,15,15,17,10,10);
    var index = 1;
    var temp = new SeatModel();
    temp.place_id = "Rio";
    for(var row = 0; row < 10; row++)
    {
        for(var seat_index = 0; seat_index < 10; seat_index ++)
        {
           var one = {
               placePrice:prices[row],
               seat:index,
               reserved:false
           };
           temp.place.push(one);
           index++;
        }
    }
    
    temp.save(dbErrors);
}

exports.addUser = addUser;
exports.login = login;
exports.getSeats = getSeats;
exports.updateSeatInfo = updateSeatInfo;
exports.removeReservation = removeReservation;
