const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const submitSchema=new Schema({
    language:{
        type:String,
        required:true,
        enum:["java","javascript","c++"]
    },
    totalTestCases:{
        type:Number,
        default:0
    },
    passedTestCases:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","error","Wrong Answer"]
    },
    memory:{
        type:Number,//kb
        default:0
    },
    runtime:{
        type:Number,//ms
        default:0
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"userRegistration",
        required:true
    },
    prblmId:{
        type:Schema.Types.ObjectId,
        ref:"prblm",
        required:true
    },
    code:{
        type:String,
        required:true
    }
},{timestamps:true});

submitSchema.index({userId:1,prblmId:1});

const submit=mongoose.model("submitModel",submitSchema);
module.exports=submit;