const submit=require("../Model/submitSchema");
const {getIdByLanguage,submitBatch,getBatch}=require("../utilis/prblmUtility");
const prblmModel=require("../Model/prblmSchema");

const userSubmit= async (req,res)=>{
    try{
        const userId=req.result._id;
        const prblmId=req.params.id;
        
        //fetching prblm from db
        const prblm= await prblmModel.findById(prblmId);

        let {code,language}=req.body;

        if(language=="cpp")
            language="c++";

       //check
       if(!code||!language||!userId||!prblmId)
        return res.status(400).send("Some field is missing");

        //storing submit data first
        const submitData=await submit.create({
            code,
            language,
            totalTestCases:prblm.hiddenTestCases.length,
            userId,
            prblmId
        });

        const submission=prblm.hiddenTestCases.map(({input,output})=> ({
                    "source_code":code,
                    "language_id":getIdByLanguage(language),
                    "stdin":input,
                    "expected_output":output  
        }));

        const result=[];

        for(let val of submission){
           let p=await submitBatch(val)
           result.push(p);
        }
 
        const arrResult=result.map(v=> v.token);

        const theResult=await getBatch(arrResult);

        let passedTestCases=0;
        let errorMessage=null;
        let status="pending";
        let memory=0;
        let runtime=0;

        for(let val of theResult){
            if(val.status_id==3){
               runtime+=parseFloat(val.time);
               memory=Math.max(memory,val.memory);
               status="accepted";
               passedTestCases++;
            }else{
                if(val.status_id==4){
                    status="Wrong Answer";
                    errorMessage=val.stderr;
                }else{
                    status="error";
                    errorMessage=val.stderr;
                }
            }
        }

    //updating data after judge0 returning result
        submitData.runtime=runtime;
        submitData.memory=memory;
        submitData.status=status;
        submitData.errorMessage=errorMessage;
        submitData.passedTestCases=passedTestCases;

        //updating db m-1
        await submitData.save();

        //m-2
        // await submit.findByIdAndUpdate(submitData._id,submitData);

        if(!req.result.problemSolved.includes(prblmId)){
            req.result.problemSolved.push(prblmId);
            await req.result.save();
        }
        //response
        res.status(201).send(submitData);

    }catch(err){
        console.log(err);
      res.status(500).send("Internal server error: "+err);
    }
}

const runCode=async (req,res) => {
     try{
        const userId=req.result._id;
        const prblmId=req.params.id;
        
        //fetching prblm from db
        const prblm= await prblmModel.findById(prblmId);

        let {code,language}=req.body;
 
        
       
        if(language=="cpp")
            language="c++";

       //check
       if(!code||!language||!userId||!prblmId)
        return res.status(400).send("Some field is missing");

        const submission=prblm.visibleTestCases.map(({input,output})=> ({
                    "source_code":code,
                    "language_id":getIdByLanguage(language),
                    "stdin":input,
                    "expected_output":output  
        }));

        
        const result=[];

        for(let val of submission){
           let p=await submitBatch(val)
           result.push(p);
        }

         console.log("-----------------------");

        const arrResult=result.map(v=> v.token);


        console.log(arrResult);
        const theResult=await getBatch(arrResult);

        
        //response
        res.status(201).send(theResult);

    }catch(err){
      res.status(500).send("Internal server error: "+err);
    }
}

const getAllUserSubmits=async (req,res) => {
    try{
        const userId=req.result._id;

        const user=await submit.find({userId});

        // if(user.length==0)
        //     throw new Error("There are 0 submits from user")

        res.status(200).send(user);
    }catch(e){
        res.status(500).send("Internal server error: "+e);
    }
}

const getSubmissionsByPrblmId=async (req,res) => {
    const {prblmId}=req.params;
    try{
        if(!prblmId)
            throw new Error("Problem Id does not exist");

        const submissions=await submit.find({prblmId}).populate({
            path:"prblmId",
            select:"_id title difficulty tags language"
        });
;

         if(submissions.length==0)
            throw new Error("There are 0 submits from this problem id.")

        res.status(200).send(submissions);
    }catch(e){
        console.log(e)
       res.status(500).send("Internal server error: "+e);
    }
}

module.exports={userSubmit,runCode,getAllUserSubmits,getSubmissionsByPrblmId};