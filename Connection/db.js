const mongoose = require('mongoose')

const connectionString = process.env.DB_CONNECTION

mongoose.connect(connectionString).then(
    (res)=>{
        console.log(("NetFriends Connected Successfully with MongoDb Atlas"));
    }
).catch((err)=>{
    console.log(err);
})