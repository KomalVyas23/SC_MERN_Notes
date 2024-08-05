const express = require('express');
const fs = require('fs');
const short = require('short-uuid');
const dotenv = require('dotenv');
const mongoose = require("mongoose");

dotenv.config();
const PORT = process.env.PORT || 3300;

/** database connection starts */
 mongoose.connect(process.env.DB_URL)
 .then((connection) => {
    console.log("DB Connected");
 }).catch((err) => {
    console.log(err);
 });

 /** DB Connection End */

 const userSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
   },
   email: {
    type: String,
    required: true,
    unique: true,
   },
   password: {
    type: String,
    required: true,
    minlength: 8,
   },
   confirmPassword: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
        validator: function(){
            return this.password === this.confirmPassword
        },
        message: "Password and confirm password should be same"
    }
   },
   createdAt: Date,
   id: String
 });

 const User = mongoose.model('User',userSchema);

const app = express();
const data = fs.readFileSync("./data.json", "utf8");
const userData = JSON.parse(data);

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.path}`);
    next();
});

//Routes
app.get('/api/user', getUser);
app.post('/api/user', createUser);
app.get("/api/user/:id", getUserById);

//Routes Handler
async function getUser (req, res){
    try{
      const userData = await User.find();
      if(userData === 0){
        throw new error("No user found")
      }else{
        res.status(200).json({
            message: userData,
        })
      }
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

async function createUser(req, res) {
    try{
  const id = short.generate();
    const userDetails = req.body;
    const isEmpty = Object.keys(userDetails).length === 0;
    if(isEmpty){
        res.status(400).json({
            status: 400,
            message: "Body cannot be empty",
        });
    }else{
      const user = await User.create(userDetails);
      res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    }
    }catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}

async function getUserById(req, res){
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      res.json({
        status: 200,
        message: "User found",
        data: user,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  }

app.listen(PORT,() => {
    console.log(`Server is running at port ${PORT}`);
});