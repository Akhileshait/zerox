const User = require('../models/user')
const {v4: uuidv4} = require('uuid');
const { setUser } = require("../service/auth");
let path = require('path').join(__dirname, '../views');

async function userSignup(req, res){
     const {name, email, password}=req.body;
     await User.create({
          name,
          email, 
          password
     });

     return res.sendFile(`${path}/home.html`);
}

async function userLogin(req, res){
     const {email, password}=req.body;

     const user = await User.findOne({email, password});
     
     if(!user)
          return res.sendFile(`${path}/login.html`);

     const ssnId=uuidv4();
     setUser(ssnId, user);
     res.cookie("uid", ssnId);
     return res.sendFile(`${path}/home.html`);
}


module.exports = {userSignup, userLogin};