const cloudinary = require('cloudinary').v2;
const image =require("../Model/imageOfUser");

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const getDigitalSignature= async (req,res)=>{
    try{

        const userId=req.result._id;

        // Generate unique public_id for the photo
        const timestamp=Math.round(new Date().getTime()/1000);
        const publicId=`leetcode-user-images/${userId}_${timestamp}`;

        //Upload parameters
        const uploadParams={
            timestamp,
            public_id:publicId
        }

        //creating digital signature
        const signature=cloudinary.utils.api_sign_request(uploadParams,process.env.CLOUDINARY_API_SECRET);

        res.status(200).json({
            timestamp,
            public_id:publicId,
            signature,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        });

    }catch(e){
     res.status(500).send("Failed  to generate upload credentials");
    }
}

const storeMetaData= async(req,res)=>{
    try{
     const {
      cloudinaryPublicId,
      secureUrl
     }=req.body;
    
    // const userId=req.result._id;

    //sometimes we may get meta data,but the photo might have not been uploaded so verification of upload with Cloudinary
    const cloudinaryResource=cloudinary.api.resource(
        cloudinaryPublicId,
        {resource_type:"image"}
    )
   
    if(!cloudinaryResource){
        return res.status().send("image not yet uploaded in cloudinary")
    }

    const photoExist=await image.findOne({userId:req.result._id});

    if(photoExist)
        return res.status(400).send("image already exist");


    const photo=await image.create({
        userId:req.result._id,
        cloudinaryPublicId,
        secureUrl
    });


    res.status(201).json({
        message:"Meta Data saved successfully",
        photoSolution:{
            id: photo._id,
            uploadedAt:photo.createdAt
        }
    })

    }catch(e){
        console.log(e)
     res.status(500).send('Failed to save photo metadata');
    }
}

const delMetaData= async (req,res)=>{
    try{
        const {pid}=req.params;

        const photo=await image.findByIdAndDelete(pid);

        if(!photo)
            throw new Error("There no photo of this user in database");

        await cloudinary.uploader.destroy(photo.cloudinaryPublicId,{resource_type:"image",invalidate:true});
 
        res.status(200).send("Deleted metadata successfully");

    }catch(e){
      res.status(500).send('Failed to delete photo');    
    }
}

module.exports={getDigitalSignature,storeMetaData,delMetaData}
