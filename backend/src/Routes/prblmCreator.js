const express=require("express");
const prblmRouter=express.Router();
const adminAuthorization=require("../middleware/adminAuthorization");
const authorization=require("../middleware/authorization");
const {prblmCreator,updatePrblm,delPrblm,getPrblmById,getAllPrblm,getAllUserSolvedPrblms,getAllSubmitsOfAPrblm,getPrblmByIdForUpd,updNotes,createNote,getNotes,removeNotes,activeStars,stars}=require("../controller/userPrblms");
 

prblmRouter.post("/create",adminAuthorization,prblmCreator);
prblmRouter.put("/update/:id",adminAuthorization,updatePrblm);
prblmRouter.delete("/delete/:id",adminAuthorization,delPrblm);

prblmRouter.get("/getPrblmByIdForUpd/:pid",adminAuthorization,getPrblmByIdForUpd);
prblmRouter.get("/getPrblmById/:id",authorization,getPrblmById);
prblmRouter.get("/getAllPrblm",authorization,getAllPrblm);
prblmRouter.get("/getAllUserSolvedPrblms",authorization,getAllUserSolvedPrblms);
prblmRouter.get("/getAllSubmitsOfAPrblm/:pId",authorization,getAllSubmitsOfAPrblm);

prblmRouter.get("/getNotes/:id",authorization,getNotes);
prblmRouter.post("/createNote",authorization,createNote);
prblmRouter.patch("/updNote",authorization,updNotes);
prblmRouter.delete("/removeNote/:prblmId",authorization,removeNotes);

prblmRouter.get("/stars",authorization,stars);
prblmRouter.put("/activeStars/:prblmId",authorization,activeStars)


module.exports=prblmRouter;