const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

const userSchema=new mongoose.Schema({
email:{
    type:String,
    required:[true,'Email is required for creating a user'], 
    trim:true,
    lowerCase:true,
    match:[/\S+@\S+\.\S+/, 'Please enter a valid email address.'],
    unique:[true,"Email already exists"]
},
name:
{
    type:String,
    required:[true,"Name is required for creating account."]
},
password:{
    type:String,
    required:[true,"Passwword is required for creating account."],
    minlength:[8,"Password should contain atleast 8 characters"],
    select:false
},
systemUser:{
type:Boolean,
default:false,
immutable:true,
select:false
}
},{
    timestamps:true
})


userSchema.pre("save",async function (){
if(!this.isModified("password")){
    return 
}
const hash=await bcrypt.hash(this.password,10)
this.password=hash
return 
})


userSchema.methods.comparePassword=async function (password) {
    console.log(password,this.password)
    return await bcrypt.compare(password,this.password)
}


module.exports=mongoose.model('User',userSchema)