const express=require("express");
const payRouter=express.Router();
const razorpayInstance=require('../utilis/razorpay');
const crypto=require('crypto');
const payment=require("../Model/paymentSchema");
require("dotenv").config()

payRouter.post("/createOrder",async (req,res) => {
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

payRouter.post("/checkPayment",async (req,res) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature,receipt_id}=req.body;

    const generatedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_ID).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    console.log(generatedSignature,razorpay_signature)
    console.log(razorpay_order_id,razorpay_payment_id);

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
            paymentId:razorpay_payment_id,
            signature:razorpay_signature,
            status:"success"
     })

     return res.json({status:"success"});
    }catch(e){
      res.status(400).json({status:"failure",msg:"Failed transaction"});
    }
})

module.exports=payRouter;