const express  = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const PORT = process.env.PORT || 3300 ;

const app = express();
const data = fs.readFileSync('./data.json','utf8');
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.path}`);
    next();
})

app.get('/api/user', (req, res) => {
    res.json({
        status: 'success',
        statusCode: 200,
        data: {
            name: 'Komal Vyas',
            age: 31
        }
    });
});

app.post("/api/user", (req, res) => {
    console.log("request body", req.body);
    //console.log(req);
    res.json({
        status: 200,
        data: req.body,
    });
});

// app.use(function(req, res){
//     res.status(200).send("Hello World");
// });

app.use(function(req, res){
    res.status(404).send("Sorry can't find that!");
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})