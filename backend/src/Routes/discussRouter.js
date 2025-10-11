const express= require("express");
const {createDiscussion,getAllDiscussions,getDiscussionByUserId,delDiscussion,updDiscussionById,updateThumbsUp,createComment}=require("../controller/userDiscussions");
const discussRouter=express.Router();
const authorization=require("../middleware/authorization");

discussRouter.post("/createDiscussion",authorization,createDiscussion);
discussRouter.patch("/updDiscussion/:id",authorization,updDiscussionById);
discussRouter.get("/getAllDiscussions",authorization,getAllDiscussions);
discussRouter.get("/getDiscussionByUserId/:id",authorization,getDiscussionByUserId);
discussRouter.delete("/delDiscussion/:id",authorization,delDiscussion);

discussRouter.patch("/updateThumbsUp/:id",authorization,updateThumbsUp);
discussRouter.post("/createComment/:id",authorization,createComment);

module.exports=discussRouter;