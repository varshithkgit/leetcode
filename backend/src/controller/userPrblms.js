const {getIdByLanguage,submitBatch,getBatch}=require("../utilis/prblmUtility");
const prblmSchema=require("../Model/prblmSchema");
const SchemarModel=require("../Model/Schema");
const submit=require("../Model/submitSchema");
const videoModel = require("../Model/solutionVideo");

const prblmCreator=async (req,res)=>{
const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,referenceSolution,startCode,prblmCreator}=req.body;
      
try{
    for(const {language,completeCode} of referenceSolution){
// Submission format

// {
//     "source_code": "#include <stdio.h>\n\nint main(void) {\n  char name[10];\n  scanf(\"%s\", name);\n  printf(\"hello, %s\n\", name);\n  return 0;\n}",
//     "language_id": 150000,
//     "stdin": "world",
//     "expected_output": "hello, world"
//   }
        const submission=visibleTestCases.map(({input,output})=> ({
            "source_code":completeCode,
            "language_id":getIdByLanguage(language),
            "stdin":input,
            "expected_output":output 
            
        }))

       const result=[];
       
      for(let val of submission){
        let p=await submitBatch(val)
        result.push(p);
      }

        // [
            //     {
            //       "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
            //     },
            //     {
            //       "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
            //     }
            //   ]

      const arrResult=result.map(v=> v.token);

       // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"]

       const theResult=await getBatch(arrResult);
       
       for( let value of theResult){
        if(value.status_id!=3){
            return res.status(400).send("Error Occured");
        }
       }
    }

    // We can store it in our DB
    await prblmSchema.create({
        ...req.body,
        prblmCreator:req.result._id
       })

    res.status(201).send("Problem Created Successfully");

}catch(e){
    res.status(400).send("Error: "+e);
}
}

const updatePrblm= async (req,res)=>{
    const {id}=req.params;
    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,referenceSolution,startCode,prblmCreator}=req.body;
    try{
        if(!id){
            // m-1
            // throw new Error("Id doesn't exist");
            // m-2
            return res.status(400).send("Id doesn't exist")
        }

        const user=await prblmSchema.findById(id);

        if(!user){
            // m-1
            // throw new Error("User doesn't exist in Database");
            // m-2
            return res.status(404).send("Problem doesn't exist in Database")
        }

       for(const {language,completeCode} of referenceSolution){
        const submission=visibleTestCases.map(({input,output})=> ({
            "source_code":completeCode,
            "language_id":getIdByLanguage(language),
            "stdin":input,
            "expected_output":output 
            
        }))

       const result=[];

      for(let val of submission){
        let p=await submitBatch(val)
        result.push(p);
      }

        // [
            //     {
            //       "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
            //     },
            //     {
            //       "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
            //     }
            //   ]

      const arrResult=result.map(v=> v.token);

       // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"]

       const theResult=await getBatch(arrResult);
       
       for( let value of theResult){
        if(value.status_id!=3){
            return res.status(400).send("Error Occured");
        }
       }
    }

        const newPrblm=await prblmSchema.findByIdAndUpdate(id,req.body,{runValidators:true , new:true})
       //  new: true: Returns the updated document after the update is applied.
       // new: false (default): Returns the original document before the update.

       res.status(200).send(newPrblm);
    }catch(err){
       res.status(500).send("Error: "+err);
    }
}

const delPrblm = async (req,res)=>{
    try{
        const {id}=req.params;
        if(!id){
            // m-1
            // throw new Error("Id doesn't exist");
            // m-2
            return res.status(400).send("Id doesn't exist")
        }

        const prblm=await prblmSchema.findById(id);

        if(!prblm){
            // m-1
            // throw new Error("User doesn't exist in Database");
            // m-2
            return res.status(404).send("Problem doesn't exist in Database")
        }

        await prblmSchema.findByIdAndDelete(id);

        res.status(200).send("Deleted problem successfully");
    }catch(err){
        res.status(500).send("Error: "+err);   
    }
}

const getPrblmByIdForUpd= async (req,res) => {
    const {pid}=req.params;
    try{

        if(!pid){
            return res.status(400).send("Id doesn't exist");
        }

        const prblm = await prblmSchema.findById(pid).select("-prblmCreator");
        
        if(!prblm)
            return res.status(404).send("Problem  does not exist");
        
        res.status(200).json({
            prblm:prblm,
            message:"Got problem by id"
        })

    }catch(e){
        res.status(500).send("Error: "+e);
    }
}

const getPrblmById= async(req,res)=>{
    const {id}=req.params;
    try{
         if(!id){
            return res.status(400).send("Id doesn't exist")
        }
        //m-1  of  .select('-name_field')
        const prblm=await prblmSchema.findById(id).select('-hiddenTestCases -prblmCreator');
        //m-2 of  .select('names_of_fields ')
        // const prblm=await prblmSchema.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');

        if(!prblm){
            return res.status(404).send("Problem doesn't exist in Database");
        }

        const video=await videoModel.findOne({prblmId:id});

        if(video){
            const response={
            secureUrl:video.secureUrl,
            cloudinaryPublicId:video.cloudinaryPublicId,
            thumbnailUrl:video.thumbnailUrl,
            duration:video.duration,
            ...prblm.toObject()
            }

            return res.status(200).json({
            prblm:response,
            message:"Got problem by id"
            });
        }

        res.status(200).json({
            prblm:prblm,
            message:"Got problem by id"
        });
    }catch(r){
        res.status(500).send("Error: "+r);
    }
}

const getAllPrblm=async (req,res)=>{
    try{
        const prblms=await prblmSchema.find({}).select('_id title difficulty tags');

        if(prblms.length==0){
            return res.status().send("The  database is empty");
        }

        res.status(200).send(prblms);
    }catch(r){
        res.status(500).send("Error: "+r);
    }
}

const getAllUserSolvedPrblms= async (req,res)=>{
    try{
       const userId=req.result._id;
    // m-1
    // const user=await SchemarModel.findById(userId).populate("problemSolved");

    // m-2
       const user=await SchemarModel.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags language"
       });
       res.status(200).send(user.problemSolved);
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}

const getAllSubmitsOfAPrblm=async (req,res) => {
    try{
     const allSubmits= await submit.find({userId:req.result._id,prblmId:req.params.pId});

     if(allSubmits.length==0){
        throw new Error("No Submission is persent");
     }

     res.status(200).send(allSubmits);
    }
    catch(err){
       res.status(500).send("Error: "+err);
    }
}

const getNotes=async (req,res) => {
     try{
        const {id}=req.params;

        const Notes=req.result.notes.find(obj=>obj.prblmId==id);
        
        
        if(!Notes){
            const response=[{title:"",body:""}];
            return res.status(200).send(response);
        }

        res.status(201).send(Notes);
    }catch(e){
        console.log(e)
        res.status(500).send("Error: "+e);
    }
}

const updNotes=async (req,res) => {
    try{
        const {prblmId,title,body,i}=req.body;

        const find= req.result.notes?.find(obj=>(obj.prblmId==prblmId));

        if(find){
        //     find.note=find.note.map(({title:t,body:b})=>{
        //         if(t==title){
        //             b=body;
        //         }
        //         return {title:t,body:b};
        //    });  
           find.note[i]={title,body}            
        }else{
            return res.send("There is no note for this problem");
        }
        await req.result.save();
        
        res.status(201).send(find.note);
    }catch(e){
        res.status(500).send("Error: "+e);
    }
}

const createNote=async (req,res) => {
     try{
        const {prblmId,array}=req.body;

        const find= req.result.notes?.find(obj=>(obj.prblmId==prblmId));
        // console.log(find);
       
        if(find){
            find.note=array;              
        }else{
            req.result.notes.push({prblmId,note:array});
            await req.result.save();
            const find= req.result.notes?.find(obj=>(obj.prblmId==prblmId));
            res.status(201).send(find.note);
            return;
        }

        await req.result.save();
        
        res.status(201).send(find.note);
    }catch(e){
        console.log(e);
        res.status(500).send("Error: "+e);
    }
}

const removeNotes=async (req,res)=>{
    try{
        const {prblmId}=req.params;
        const {index}=req.query;

        const find= req.result.notes?.find(obj=>(obj.prblmId==prblmId));

        if(find){
            find.note?.splice(index,1);              
        }

        await req.result.save();
        
        res.status(201).send("deleted Successfully");
    }catch(e){
        res.status(500).send("Error: "+e);
    }
}

const activeStars=async (req,res) => {
    try{
        const {prblmId}=req.params;

        const isPresent=req.result.List.findIndex(id=>id==prblmId);

        if(isPresent!=-1){
          req.result.List.splice(isPresent,1);
        }else{
          req.result.List?.push(prblmId);
        }
        
        await req.result.save();

        res.status(200).send("Updated Successfully");
    }catch(e){
        console.log(e);
        res.status(500).send("Internal server error");
    }
}

const stars=async (req,res) => {
    try{
    res.status(200).send(req.result.List);
    }catch(e){
      res.status(500).send("Error: "+e);
    }
}

module.exports={prblmCreator,delPrblm,updatePrblm,getAllPrblm,getPrblmById,getAllUserSolvedPrblms,getAllSubmitsOfAPrblm,getPrblmByIdForUpd,updNotes,createNote,getNotes,removeNotes,activeStars,stars};