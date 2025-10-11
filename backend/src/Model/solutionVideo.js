const mongoose=require("mongoose");
const {Schema}=mongoose;

const solutionVideo=new Schema({
   prblmId:{
    type:Schema.Types.ObjectId,
    ref:"prblm",
    required:true 
   },
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
   thumbnailUrl: {
    type: String
   },
   secureUrl:{
    type:String,
    required:true
   },
   duration:{
    type:Number
   }
},{timestamps:true});

const videoModel=mongoose.model("video",solutionVideo);
module.exports=videoModel;