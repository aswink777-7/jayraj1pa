

  const mongoose = require('mongoose')
const connectionString = process.env.DATABASE
mongoose.connect(connectionString).then(()=>{
    console.log("mongoDb atlas connection connected with wastemgm server");
}).catch((err)=>{
    console.log(`mongo Db connection failed ${err}`);
})