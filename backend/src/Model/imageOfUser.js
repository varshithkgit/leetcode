const mongoose=require("mongoose");
const {Schema}=mongoose;

const ImageSchema=new Schema({
    userId:{
    type:Schema.Types.ObjectId,
    ref:"userRegistration",
    required:true 
   },
   cloudinaryPublicId:{
    type:String,
    required:true,
    unique:true
   },
   secureUrl:{
    type:String,
    required:true
   }
},{timestamps:true})

const image=mongoose.model("image",ImageSchema);
module.exports=image;