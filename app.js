"use strict";
var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    moment = require('moment'),
    uniqid = require('uniqid'),
    nodemailer = require("nodemailer");

require('dotenv').config();


var url = process.env.DATABASEURL || "mongodb://localhost/entrymanagement";
mongoose.connect(url, { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(require("express-session")({
    secret: "Hello",
    resave: false,
    saveUninitialized: false
}));
app.use(function (req, res, next) {
    res.locals.curruser = req.user;
    next();
});
var visitor = require("./Association/models/visitors");

app.get("/", function (req, res) {

    res.redirect("/home");

});
app.post('/ast',function(req,res){
    console.log(req.body.name);
    
    res.send(req.body.name);
})

app.get("/home", function (req, res) {
    visitor.find({}, function (err, visitors) {
        if (err) {
            console.log("error");
        } else {
            // console.log(books);

            res.render("visitors/index", { visitors: visitors });
        }
    })

});


app.get("/addInfo", function (req, res) {
    res.render("visitors/new");
});

// app.get("/books/:id", function (req, res) {


//     book.findById(req.params.id).populate("comments").exec(function (err, showbook) {
//         if (err) {
//             res.send("error occured while showing database");

//         } else {
//             res.render("books/show", { book: showbook });
//         }

//     });
// });

app.post("/addInfo", function (req, res) {
  
    req.body.visitor.checkInTime = new Date().getTime();
    var t =new Date().getTime();
    req.body.visitor.status = 'In';
    req.body.visitor.uniqId = uniqid();
    visitor.create(req.body.visitor, function (err, newVisitor) {
        if (err) {
            console.log(err);

            res.send("New visitor is not created!!!!XD");
        }
        else {
            let testAccount = nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'gopalkota12345@gmail.com',
                    pass: 'Rohit #98'
                }
            });

            // send mail with defined transport object
            let info = transporter.sendMail({
                from: '"sfkhnjl"<gopalkota12345@gmail.com>', // sender address
                to: req.body.visitor.host.email, // list of receivers
                subject: req.body.visitor.name+ " checked in!!", // Subject line
                html: "<ul> <li>Name: " + req.body.visitor.name + "</li> <li>Phone: " + req.body.visitor.phone + "</li> <li>CheckInTime: " + moment(req.body.visitor.checkInTime).format('MMMM Do YYYY, h:mm:ss a') + "</li><li>Hostname: " + req.body.visitor.host.name + "</li> <li>Adressvisited: " + "</li> <ul>"

            });

            console.log("Message sent: %s", info.messageId);

            // console.log(req.body.visitor._id);

            // var request = require('request');
            // request('https://api.msg91.com/api/sendhttp.php?mobiles=' + req.body.visitor.host.phone + '&authkey=304827Aa60VBT65dd50905&route=4&sender=SENDER_NAME_YAHA_ONLY_6_CHAR&message=' + 'MESSAGE_YAHA' + '&country=91', function (error, response, body) {
            //     if (!error && response.statusCode == 200) {
            //         console.log(body);
            //     }
            // })

            // http://sms.bulksmsserviceproviders.com/api/send_http.php?authkey=29ade2fa4053fa2a60eb834706bf0203&mobiles=6354813121&message=hi&sender=BulkIN&route=B

            //  request('http://sms.bulksmsserviceproviders.com/api/send_http.php?authkey=C6BB2FFC92A2465CAA130A2C2A58F9FE-02-6&mobiles=' + req.body.visitor.host.phone + '&message=' + 'Name:'+req.body.visitor.name+'%0D%0A'+'Phone:'+req.body.visitor.phone+'%0D%0A'+'Email:'+req.body.visitor.email+'%0D%0A'+'checkInTime:'+req.body.visitor.checkInTime+ '&sender=BulkIN&route=B', function (error, response, body) {
            //     if (!error && response.statusCode == 200) {
            //         console.log(body);
            //     }
            // })

            // const accountSid = 'AC5b84ee4a467e586e1e6eba611d1b9fcf';
            // const authToken = '70a681d0ecee41deb0b444778a374e53';
            // const client = require('twilio')(accountSid, authToken);

            // client.messages
            //     .create({
            //         body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
            //         from: '+12563673281',
            //         to: '+918529832099'
            //     })
            //     .then(message => console.log(message.sid));


            // res.render("visitors/index", { visitoruniqId: req.body.visitor.uniqId });
            res.redirect("/getInfo/"+req.body.visitor.uniqId);
            
        }
    });
    // console.log('ssdfons',req.body.visitor._id);
    
    // res.redirect("/getInfo");

});
app.get("/getinfo/:uniqid",function(req,res){
    visitor.findOne({uniqId:req.params.uniqid},function(err,currentvisiter){
        res.render('visitors/currentVisitor',{currentvisiter:currentvisiter});
        // res.render("visitors/index", { visitors: visitors });
    });
});

// app.get("/checkout/:id", function (req, res) {

//     visitor.findById(req.params.id, function (err, showbook) {
//         if (err) {
//             res.send("error occured while showing database");

//         } else {

//             res.render("books/edit", { book: showbook });
//         }

//     });
// });
app.post("/checkout/:id", function (req, res) {
    // console.log(req.body.book.status);

    visitor.findById(req.params.id, function (err, checkoutVisitor) {
        // console.log("entry", updatedbook);

        // var couttime= new Date().getTime();
        // console.log(couttime);

        visitor.updateOne(checkoutVisitor, { status: 'Out', checkOutTime: new Date().getTime() }, function (err, out) {
            if (err) {
                res.send("there is an errr");
            }
            else {
                
                // console.log("checkouttime:::::",moment().format('MMMM Do YYYY, h:mm:ss a'));
                
                let testAccount = nodemailer.createTestAccount();
                let transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'gopalkota12345@gmail.com',
                        pass: 'Rohit #98'
                    }
                });

                let info = transporter.sendMail({
                    from: '"sfkhnjl"<gopalkota12345@gmail.com>', // sender address
                    to: checkoutVisitor.email, // list of receivers
                    subject: checkoutVisitor.name + " checked out!!", // Subject line
                    html: "<ul> <li>Name: " + checkoutVisitor.name + "</li> <li>Phone: " + checkoutVisitor.phone + "</li> <li>CheckInTime: " +moment( checkoutVisitor.checkInTime).format('MMMM Do YYYY, h:mm:ss a') + "</li><li>CheckOutTime: " + moment().format('MMMM Do YYYY, h:mm:ss a') + "</li><li>Hostname: " + checkoutVisitor.host[0].name + "</li> <li>Adressvisited: " + "</li> <ul>"
    
                });
    

               

                // console.log("Message sent: %s", info.messageId);







                res.redirect("/home");
            }
        });
    });
});
app.delete("/books/:id", function (req, res) {
    book.findByIdAndDelete(req.params.id, function (err, deletebook) {
        if (err) {
            res.redirect("/books");
        } else {
            res.redirect("/books");
        }
    });
});



app.listen(process.env.PORT || 3000, function () {
    console.log("start");

});
