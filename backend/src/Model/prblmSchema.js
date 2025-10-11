const mongoose=require("mongoose");
const {Schema}=mongoose;

const prblmSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,

    },
    difficulty:{
        type:String,
        required:true,
        enum:["easy","medium","hard"]
    },
    tags:{
        type:String,
        required:true,
        enum:["Array","Linkedlist","DP","Graph"]
    },
    visibleTestCases:[
        {
            input:{
            type:String,
            required:true,
            },
            output:{
            type:String,
            required:true,
            },
            explanation:{
            type:String,
            required:true,
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
            type:String,
            required:true,
            },
            output:{
            type:String,
            required:true,
            },
        }
    ],
    startCode:[
        {

            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true,
            }
        }
        
    ],
      referenceSolution:[
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],
    prblmCreator:{
        type:Schema.Types.ObjectId,
        ref:"userRegistration",
        required:true
    },
    Aprouch:[
        {
            concept:[{
                type:String
            }
            ],
            steps:[{
                type:String
            }],
            complexities:[{
                type:String
            }],
            name:{
                type:String,
                required:true,
                enum:["Brute Force","Better Aprouch","Optimized Aprouch"]
            }
        }
    ]
})

const prblmModel=mongoose.model("prblm",prblmSchema);
module.exports=prblmModel;