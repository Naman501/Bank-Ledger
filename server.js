const dotenv=require('dotenv')
dotenv.config()
const app=require('./src/app')

const connectDB=require('./src/config/db')

connectDB()


// app.get('/',(req,res)=>{
//     console.log('Yo')
//     res.send('YO')
// })

app.listen(2000,()=>{
    console.log('Server running on port 2000')
})