require('dotenv').config()
const express = require('express')
const cors = require('cors')
const wasteMgm =  express()
const router = require('./Routes/router')
require('./DB/connection')



wasteMgm.use(cors());
wasteMgm.use(express.json());
wasteMgm.use(router);
wasteMgm.use('/uploads',express.static('./uploads'))
const PORT = 4000 || process.env.PORT

wasteMgm.listen(PORT,()=>{
 console.log(`Waste Managment started at port ${PORT} and waiting for client requests!!!`);
})




// http get request resolving to http:localhost 4000
wasteMgm.get(`/`,(req,res)=>{
    res.send(`<h1>waste managment server started and waiting for client requests!!! </h1>`)
})




