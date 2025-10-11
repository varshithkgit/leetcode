const mongoose=require("mongoose");
const {Schema}=mongoose;

const discussSchema= new Schema({
    firstname:{
        type:String,
        minLength:3,
        maxLength:10,
    },
     userId:{
        type:Schema.Types.ObjectId,
        ref:"userRegistration",
        required:true
    },
    topic:{
        type:String,
        enum:["Career","Contest","Compensation","Feedback","Interview"],
        required:true
    },
    header:{
        type:String,
        minLength:3,
        maxLength:50,
        required:true
    },
    content:{
        type:String,
        minLength:1,
        maxLength:250,
        required:true
    },
    stats:{
        votes:{
        type:[{
        type:Schema.Types.ObjectId,
        ref:"discusses"
        }],
        default:[]
        },
        views:{
        type:Number,
        default:0
        },
        comments:[
        {
            user:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                minLength:1,
                maxLength:250,
            },
            date:{
               type:Date,
               required:true
            }
        }
       ]
    }
},{timestamps:true});

const discussionModel=mongoose.model("discusses",discussSchema);
module.exports=discussionModel;