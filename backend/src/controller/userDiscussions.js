const  discussionModel=require("../Model/discussSchema");

const createDiscussion= async (req,res)=>{
   try{
     const mandatoryField=["topic","content","header"];
     const isAllowed= mandatoryField.every(field=>Object.keys(req.body).includes(field));

     if(!isAllowed)
        throw new Error("Some requirred field is missing"); 

    const discussion=await discussionModel.create({...req.body,userId:req.result._id,firstname:req.result.firstname});
    res.status(201).send(discussion);
   }catch(e){
    res.status(500).send("Error: "+e);
   }
}

const updDiscussionById= async (req,res) => {

   const {id}=req.params;

   try{
         if(!id){
            throw new Error("Discussion id not present");
         }

         const discussion=await discussionModel.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});

         if(!discussion)
            throw new Error("Discussion not present");
         res.status(201).json({
            discussion,
            message:"Updated discussion successfully"
         })

   }catch(e){
      res.status(500).send("Error: "+e);
   }
}

const getAllDiscussions= async (req,res)=>{
       try{
         const all=await discussionModel.find({});

         if(all.length==0)
             throw new Error("There are no discussions");
         
         res.status(200).send(all);

       }catch(e){
         res.status(500).send("Error: "+e);
       }
}

const getDiscussionByUserId= async (req,res)=>{

   const {id}=req.params;

       try{
         if(!id){
            throw new Error("Discussion id not present");
         }

         const discussion= await discussionModel.find({userId:id});

         if(!discussion)
            throw new Error("Discussion not present");

          res.status(200).json({
              discussion,
              message:"Discussion sent successfully"
          })
       }catch(e){
         res.status(500).send("Error: "+e);
       }
}

const delDiscussion= async (req,res)=>{
   
   const {id}=req.params;

       try{
         if(!id){
            throw new Error("Discussion id not present");
         }

         const discussion=  await discussionModel.findByIdAndDelete(id);

         if(!discussion)
            throw new Error("Discussion not present");  

          res.status(200).send("Discussion deleted successfully");
       }catch(e){
         res.status(500).send("Error: "+e);
       }
}

const updateThumbsUp= async (req,res) => {
   const {id}=req.params;
   const {userId}=req.query;
   try{
      
      if(!id){
            throw new Error("Discussion id not present");
      }

      const discussion= await discussionModel.findById(id);

      if(!discussion)
            throw new Error("Discussion not present");  
      
      // console.log((discussion.stats.votes));
      const isPresent=discussion.stats.votes?.findIndex(id=>id==userId);
      if(isPresent!=-1)
         discussion.stats.votes.splice(isPresent,1);
      else
         discussion.stats.votes.push(userId);

      await discussion.save();
      res.status(200).send(discussion.stats.votes);
   }catch(e){
      console.log(e);
      res.status(500).send("Error: "+e);
   }
}

const createComment=async (req,res) => {
   const {id}=req.params;
   try{
      const {comment}=req.body;
      
      if(!id){
            throw new Error("Discussion id not present");
      }

      const discussion= await discussionModel.findById(id);

      if(!discussion)
            throw new Error("Discussion not present");  
      
      discussion.stats.comments=[{user:req.result.firstname,comment,date:new Date()},...discussion.stats.comments];

      await discussion.save();
      res.status(200).send(discussion.stats.comments);

   }catch(e){
     res.status(500).send("Error: "+e);
   }
}

module.exports={createDiscussion,getAllDiscussions,getDiscussionByUserId,delDiscussion,updDiscussionById,updateThumbsUp,createComment};