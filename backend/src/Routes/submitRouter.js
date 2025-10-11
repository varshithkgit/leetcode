const express=require("express");
const  submitRouter=express.Router();
const {userSubmit,runCode,getAllUserSubmits,getSubmissionsByPrblmId}=require("../controller/userSubmit");
const authorization=require("../middleware/authorization");
const submitRateLimiter=require("../middleware/submitRateLimiter")

submitRouter.post("/:id",authorization,submitRateLimiter,userSubmit);
submitRouter.post("/runCode/:id",authorization,runCode);
submitRouter.get("/getAllUserSubmits",authorization,getAllUserSubmits);
submitRouter.get("/getSubmissionsByPrblmId/:prblmId",authorization,getSubmissionsByPrblmId);

module.exports=submitRouter;