const userClient=require("../config/Redis");

const submitRateLimiter= async (req,res,next) => {
    try{
        //m-1
        // const userId=req.result._id;
        // const field=`submit_cooldown:${userId}`;
        // const time=Date.now();

        // Check if user has a recent submission
        // let val=await userClient.get(field);
        // val=parseInt(val);

        // const allowed=time-val;

        // if(allowed>10){
        //  await userClient.set(field,`${time}`);
        //  await userClient.expireAt(field,time+10000);
        // }else{
        //      return res.status(429).json({
        // error: 'Please wait 10 seconds before submitting again'
        // });   
        // }
       
        //m-2
        const userId=req.result._id;
        const field=`submit_cooldown:${userId}`

        // Check if user has a recent submission
        const exist =await userClient.exists(field);

        if(exist){
        return res.status(429).json({
        error: 'Please wait 10 seconds before submitting again'
        });      
      }
 
      // Set cooldown period
        await userClient.set(field,"cooldown_active",{
           EX: 10, // Expire after 10 seconds
           NX: true // Only set if not exists
        });

        next();
    }catch(err){
       res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports=submitRateLimiter;