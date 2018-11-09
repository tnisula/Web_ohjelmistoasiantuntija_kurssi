var mongoose = require('mongoose');

var mongourl = 'mongodb://localhost/shop_list';
mongoose.connect(mongourl,function(err,con){
   if(err){
       console.log('Connection to db failed');
   } 
   else{
       console.log('Connected to db');
   }
});

var Schema = mongoose.Schema;

var user = new Schema({
   username:String,
   password:String,
   shoppingList:[]
});

var UserModel = mongoose.model('user',user,'user');

// Luo ensin yksi testikäyttäjä, joka voi loggautua sisälle
// Ota kommentit rivillä 31 pois testUser.save
// ja laita ne sitten takaisin

var testUser = new UserModel({
   username:'tnisula',
   password:'password',
});

//testUser.save();

function loginUser(data,req,resp){
    console.log(data.username);
    UserModel.findOne({'username':data.username,'password':data.password},function(err,doc){
       if(!err){
           if(doc){
               console.log(doc);
               console.log(req.session);
               req.session.username = data.username;
               req.session.password = data.password;
               
               resp.render('shoplist',{data:doc.shoppingList});
           }
           else {
               resp.send('Authentication failed');
           }
       } 
    });
}

function updateShoppingList(data,req,res){
    // console.log('akdskljsakdj');
    console.log(data);
    console.log(req.session.username);
    console.log(req.session.password);
    var query = {
        username:req.session.username,
        password:req.session.password
    };
    UserModel.findOneAndUpdate(query,{'shoppingList':data},function(err,docs){
    });
    res.send('added');
}

exports.loginUser = loginUser;
exports.updateShoppingList = updateShoppingList;