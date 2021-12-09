var express = require("express");
var app = express();
var mongoose = require("mongoose");
var session = require("express-session");
var flash = require("express-flash");
mongoose.connect("mongodb://localhost/message_board");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(flash());

app.use( express.urlencoded({extended:true}) );

app.use(session({
    secret: "messages",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));


//  -----------------------------------------

mongoose.connect("mongodb://localhost/message_board");

var CommentSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Your name is required!"], minlength: 3},
    comment: {type: String, required: [true, "Comment field can not be left blank!"], minlength: 3},
    }, {timestamps: true})

var MessageSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Your name is required!"], minlength: 3},
    message: {type: String, required: [true, "Message field can not be left blank!"], minlength: 3},
    comments: [CommentSchema]
    }, {timestamps: true})

    mongoose.model("Comment", CommentSchema);
    mongoose.model("Message", MessageSchema);

    var Comment = mongoose.model("Comment");
    var Message = mongoose.model("Message");

//Routes
app.get("/", function(req, res){
    Message.find().populate("comments").exec(function(err, messages){
        if(err){
        }
        else{
            res.render("index", {posts:messages});
        }
    })
});

app.post("/message", function(req, res){
    var message = new Message({name: req.body.name, message: req.body.message});
    message.save(function(err){
        if(err){
            for(var key in err.errors){
                req.flash("messageform", err.errors[key].message);
            }
            res.redirect("/");
        }
        else{
            res.redirect("/");
        }
    })
});

app.post("/comment", function(req, res){
    Comment.create({name: req.body.name, comment: req.body.comment}, function(err, comment) {
        if(err){
            for(var key in err.errors){
                req.flash("commentform", err.errors[key].message);
            }
            res.redirect('/');
        }
        else{
            Message.findOneAndUpdate({_id: req.body.msgId}, {$push: {comments: comment}}, function(err, data) {
                if(err){
                    res.redirect('/');
                }
                else{
                    res.redirect('/');
                }
            })
        }
    })
});


// ------------------------------------------


app.listen( 8080, function(){
    console.log( "The users server is running in port 8080." );
});