const mongoose=require("mongoose");
const {Schema}= mongoose;

const userSchema= new Schema({
    firstname:{
        type:String,
        minLength:3,
        maxLength:10,
        required:true
    },
    lastname:{
        type:String,
        minLength:3,
        maxLength:10,
    },
    emailID:{
        type:String,
        required:true,
        immutable:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:"user"
    },
    age:{
        type:Number,
        min:5,
        max:89
    },
    notes:[
        {
            prblmId:{
                type:Schema.Types.ObjectId,
                ref:"prblm" 
            },
            note:[
                {
            title:{
                type:String,
                maxLength:25
            },
            body:{
                type:String,
                maxLength:250
            }
            }
        ]
        }
    ],
    List:{
        type:[{
        type:Schema.Types.ObjectId,
        ref:"prblm"
        }],
        default:[]
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:"prblm" 
        }],
        default:[]
    },
    college:{
        type:String,
        default:""
    },
    skills:[
        {
            type:String
        }
    ],
    languages:[
        {
            type:String
        }
    ]
},{timestamps:true});

//m-2 for deleting submission
userSchema.post('findOneAndDelete',async (userInfo) => {
    if(userInfo){
        await mongoose.model('submitModel').deleteMany({userId:userInfo._id})
    }
});

const SchemarModel= mongoose.model("userRegistration",userSchema);
module.exports=SchemarModel;