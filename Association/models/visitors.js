var mongoose = require("mongoose");
var Host = new mongoose.Schema({
    name: String,
    email: String,
});


var visitorSchema = new mongoose.Schema({
    
    name: String,
    email: String,
    phone:{
    type: String,
    // validate: {
    //   validator: function(v) {
    //     return /\d{3}-\d{3}-\d{4}/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid phone number!`
    // },
    // required: [true, 'User phone number required']
    },
    checkInTime:{
        type:Date
    },
    checkOutTime:{
        type:Date
    },
    address:String,
    status:String,
    uniqId:String,
    host: [Host]
});
module.exports = mongoose.model("visitor", visitorSchema);


