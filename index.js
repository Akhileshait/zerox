require("dotenv").config();
const express = require('express');
let path = require('path').join(__dirname, 'views');
const path2 = require('path');
const {connectMongodb}= require("./DBconnect");
const app= express();
const userRoute=require("./routes/user")
const multer=require("multer")
const fs = require('fs');
const pdf = require('pdf-page-counter');
const sharedData = require('./share');
const {GridFsStorage}=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOver=require('method-override')
const crypto = require('crypto');
const bodyParser = require('body-parser');

const paymentRoute = require('./routes/paymentRoute');
const { default: mongoose } = require("mongoose");
app.use(bodyParser.json());
app.use('/',paymentRoute);

const port=8001;
connectMongodb("mongodb://127.0.0.1:27017/zerox").then(()=>{
     console.log("connected to MongoDB");
});

const conn=mongoose.createConnection("mongodb://127.0.0.1:27017/zerox");
// app.set("view engine", "ejs");

// app.set('views', path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", userRoute);

app.get("/test", async (req, res)=>{

     res.sendFile(`${path}/home.html`)
});

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const dbstorage = new GridFsStorage({
  url: "mongodb://127.0.0.1:27017/zerox",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        console.log(file);
        const filename = buf.toString('hex') + path2.extname(file.originalname);
        console.log("FileName is", filename);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads.files'
        };
        console.log(fileInfo);
        resolve(fileInfo);
      });
    });
  }
});
const dbupload = multer({dbstorage});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    return cb(null, file.originalname + '-' + uniqueSuffix);
  }
})

const upload = multer({storage});

app.post("/upload", upload.single("myFile"), (req, res)=>{
     console.log(req.file);
     let dataBuffer = fs.readFileSync(req.file.path);
 
     pdf(dataBuffer).then(function(data) {
     console.log(data);
     sharedData.setAmount(2*data.numpages);
     
     res.json({
          numpages: data.numpages,
          amount: data.numpages * 2
      });
     });
     
});

app.post("/success",dbupload.single("file"),  (req, res)=>{
  
});

app.listen(port, (req, res)=>{
     console.log(`Server running on Port ${port} ......`)
});

module.exports={dbupload};