var mongoose = require("mongoose");
var express = require('express');
var uriString = 'mongodb://localhost/test';

var app = express();

app.configure(function () {
    app.use(
        "/", //the URL through which you want to access to you static content
        express.static(__dirname) //where your static content is located in your filesystem
    );
    
    app.use(
        "/tweet_page/tweets.html", 
        express.static(__dirname)
    );
        
    app.use(express.cookieParser());
    app.use(express.session({secret: '1234567890QWERTY'}));
});

var Schema = mongoose.Schema;


var tweet = new Schema({
   body:String,
   username:{type:String},
   userid:Number,
   created:{type:Date, default:Date.now}
});

//Register the Schema
var TweetModel = mongoose.model("Tweet",tweet);


mongoose.connect(uriString, function (err, res){
    
    if(err)
    {
        console.log("Connection to:" + uriString + " failed");
    }
    else
    {
        console.log("Connected to:" +  uriString);
    }
});


//Middlewares
app.use(express.bodyParser());

app.get('/', function(req,res)
{
    res.sendfile('index.html');
});

app.post('/new_tweet', function(req,res){
    req.session.tweedAppended=true;
    var temp = new TweetModel({
        body:req.body.body,
        username:req.body.username,
        userid:req.body.userid,
        created:new Date()
    });
    console.log(temp);
    temp.save(function(err)
    {
        if(err){
            res.send("Failed to save tweet " + err);
        }
        else{
            res.redirect("/");
        }
    });
    
});

//Get all tweets
app.get('/tweet_page',function(req,res){
   if(req.session.tweedAppended)
   {
     res.sendfile('tweets.html');
   }
   else
   {
       res.redirect('/');
   }
});

//Get all tweets
app.get('/read_tweets',function(req,res){
    TweetModel.find(function (err, tweets){
        if(err){
            res.send("Something went wrong. Try again later")
        }
        else
        {
            res.send(tweets);
        }
    });
});

app.delete('/delete_tweet/:id',function(req,res){
    var id = req.params.id.split(':')[2];
    TweetModel.findById(id, function(err,tweet){
        if(err){
            console.log('Error findinf id:' + err);
            res.send("Could not find tweet with id:" + id);
        }
        else{
            tweet.remove(function(err){
               if(err){
                   console.log('error removing tweet:' + err);
                   res.send('Could not remove tweet. Error:' + err);
               }
               else
               {
                   console.log('tweet deleted');
                   res.send('Deleted the tweet...')
               }
            });
        }
    });
});

app.put('/update_tweet/:id',function(req,res){
   console.log("update tweet"); 
   var id = req.params.id.split(':')[2];
   console.log('id:' + id);
   console.log('Data:' + req.body.data);
   
   TweetModel.findById(id, function(err,tweet){
      
      //Make updates
      tweet.body = req.body.data;
      tweet.save();
   });
   
});

app.post('/filter_tweets', function(req,res){
    //Get all tweets with given username. Append body, username and _id in query result
    TweetModel.find({'username':req.body.data},'body username created _id', function(err,tweet){
        if(err){
            console.log('filter failed');
            res.send('Could not find matches');
        }
        else{
            console.log('filter success');
            console.log(tweet);
            res.send(tweet);
        }
    });
});

app.listen(3000);
