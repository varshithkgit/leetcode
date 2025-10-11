const mongoose=require("mongoose");
const {Schema}=mongoose;

const paymentSchema=new Schema({
    orderId:String,
    paymentId:String,
    signature:String,
    receiptId:String,
    status:{
        type:String,
        enum:["success","failure"]
    }

},{timestamps:true});

const payment=mongoose.model("payment",paymentSchema);
module.exports=payment;