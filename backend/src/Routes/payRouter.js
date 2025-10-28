const express=require("express");
const payRouter=express.Router();
const razorpayInstance=require('../utilis/razorpay');
const crypto=require('crypto');
const payment=require("../Model/paymentSchema");
const authorization=require("../middleware/authorization");
require("dotenv").config()

payRouter.post("/createOrder",authorization,async (req,res) => {
    const {amount,receipt,currency="INR"}=req.body;
    try{
        const options={
            currency,
            amount:amount*100,  //in paise
            receipt
        }

        const order=await razorpayInstance.orders.create(options);
        res.status(201).json({...order,key:process.env.RAZORPAY_KEY_ID});
    }catch(e){
        console.log(e);
        res.status(500).send("Failed to create order");
    }
});

payRouter.post("/checkPayment",authorization,async (req,res) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature,receipt_id}=req.body;

    const generatedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");

    try{
        //checking signature
    if(generatedSignature!=razorpay_signature){
        return res.status(400).json({status:"failure",msg:"Invalid Signature"});
    }

    //checking if payment as been done actually
    const pay=await razorpayInstance.payments.fetch(razorpay_payment_id);

    if(pay.status!="captured")
        return res.status(500).json({status:"failure",msg:"Payment not captured"});



    //storing details in DB
      await payment.create({
            orderId:razorpay_order_id,
            receiptId:receipt_id,
            userId:req.result._id,
            paymentId:razorpay_payment_id,
            signature:razorpay_signature,
            status:"success"
     })

     return res.json({status:"success"});
    }catch(e){
      res.status(400).json({status:"failure",msg:"Failed transaction"});
    }
})

payRouter.get("/premium",authorization,async (req,res) => {
    try {
        const details=await payment.findOne({userId:req.result._id});

        if(!details) return res.status(200).send("Ur not bought premium");

        if(details.status!="success") return res.status(200).send("Ur payment was a failure or its pending");

        res.status(200).json({premium:true});
    } catch (error) {
        console.log(error);
        res.status(400).send("Error: "+error);
    }
})

module.exports=payRouter;