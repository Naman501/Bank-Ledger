const dotenv=require('dotenv')
const mongoose= require('mongoose')

dotenv.config();

const DbUri=process.env.MONGO_URI

async function connectDB(){

  await mongoose.connect(DbUri).then(()=>{
        console.log("DB connected Successfully!")
    }).catch((err)=>{
        console.log('Db connection Error',err)
        process.exit(1);
    })
}

module.exports=connectDB