const express = require('express');
const fs = require('fs');
const short = require('short-uuid');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const User = require('./models/userModel');
const {  getUser,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById, checkInput } = require("./controllers/userController");

    const {
        getProductHandler,
        createProductHandler,
        getProductById,
        updateProductById,
        deleteProductById,
      } = require("./controllers/productController");


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

const app = express();
const data = fs.readFileSync("./data.json", "utf8");
const userData = JSON.parse(data);

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.path}`);
    next();
});

//app.use(checkInput);

//Routes
app.get('/api/user', getUser);
app.post('/api/user', checkInput, createUser);//Chaining
app.get("/api/user/:id", getUserById);
app.patch('/api/user/:id', updateUserById);
app.delete('/api/user/:id', deleteUserById);

/** product routes */
app.get("/api/product", getProductHandler);
app.post("/api/product", createProductHandler);
app.get("/api/product/:id", getProductById);
app.delete("/api/product/:id", deleteProductById);
app.patch("/api/product/:id", updateProductById);

app.listen(PORT,() => {
    console.log(`Server is running at port ${PORT}`);
});