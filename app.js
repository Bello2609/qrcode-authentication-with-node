const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
//routes
const userRoute = require("./routes/user");
const qrcodeRoute = require("./routes/qrcode");
//body parser
app.use(bodyparser.urlencoded({ extended: false }));
//to parse json data
app.use(bodyparser.json());

app.use(cors());

app.use(userRoute);
app.use(qrcodeRoute);
mongoose.connect(process.env.mongo_url).then(connect=>{
    console.log(connect);
    app.listen(2200, ()=>{
        console.log("server running at port 2200");
    })
}).catch(err=>{
    console.log(err);
})
