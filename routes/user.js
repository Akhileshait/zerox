const express = require("express");
const {userSignup, userLogin} = require("../controllers/user")
let path = require('path').join(__dirname, '../views');
const router = express.Router();

router.get("/", (req, res)=>{
     res.sendFile(`${path}/signup.html`)
});

router.get("/login", (req, res)=>{
     res.sendFile(`${path}/login.html`)
})

router.post('/user', userSignup)
router.post('/user/login', userLogin)



module.exports = router;