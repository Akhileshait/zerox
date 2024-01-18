const Razorpay = require('razorpay'); 
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const express = require('express');
const app = express();
const sharedData = require('../share');
const {dbupload}=require('../index')
const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});


const createOrder = async(req,res)=>{
    try {
        
        console.log('Amount:', sharedData.getAmount());
        const amount=sharedData.getAmount()*100 ;
        
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }
        console.log(options);
        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        // product_name:req.body.name,
                        // description:req.body.description,
                        contact:"8567345632",
                        name: "Sandeep Sharma",
                        email: "sandeep@gmail.com",
                        
                    });
                    // res.redirect('/success');
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!'});
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    createOrder
}