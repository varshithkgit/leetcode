const cloudinary = require('cloudinary').v2;
const prblmModel=require("../Model/prblmSchema");
const videoModel=require("../Model/solutionVideo");

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const getDigitalSignature= async (req,res)=>{
    try{
        const {prblmId}=req.params;

       // Verify problem exists
        const prblm= await prblmModel.findById(prblmId);
        if(!prblm)
            return res.status(404).send("Problem does not exist");

        const userId=req.result._id;

        // Generate unique public_id for the video
        const timestamp=Math.round(new Date().getTime()/1000);
        const publicId=`leetcode-solutions/${prblmId}/${userId}_${timestamp}`;

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
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        });

    }catch(e){
     res.status(500).send("Failed  to generate upload credentials");
    }
}

const storeMetaData= async(req,res)=>{
    try{
     const {
      prblmId,
      cloudinaryPublicId,
      secureUrl,
      duration
     }=req.body;
    
    // const userId=req.result._id;

    //sometimes we may get meta data,but the video might have not been uploaded so verification of upload with Cloudinary
    const cloudinaryResource=cloudinary.api.resource(
        cloudinaryPublicId,
        {resource_type:"video"}
    )
   
    if(!cloudinaryResource){
        return res.status().send("Video not yet uploaded in cloudinary")
    }

    const videoExist=await videoModel.findOne({prblmId,userId:req.result._id,cloudinaryPublicId});

    if(videoExist)
        return res.status().send("Video already exist");

    //m-1 for  creating thumbnail
    // const thumbnailUrl=cloudinary.url(cloudinaryResource.public_id,{
    //     resource_type:"image",
    //     transformation: [
    //      { width: 400, height: 225, crop: 'fill' },
    //      { quality: 'auto' },
    //      { start_offset: 'auto' }  
    //     ],
    //     format:"jpg"
    // });

    // m-2 frome method by cloudinary
    const thumbnailUrl=cloudinary.image(cloudinaryPublicId, {start_offset: "8.5", resource_type: "video"})


    const video=await videoModel.create({
        prblmId,
        userId:req.result._id,
        cloudinaryPublicId,
        thumbnailUrl,
        secureUrl,
        duration:cloudinaryResource.duration || duration
    });


    res.status(201).json({
        message:"Meta Data saved successfully",
        videoSolution:{
            id: video._id,
            thumbnailUrl:video.thumbnailUrl,
            duration:video.duration,
            uploadedAt:video.createdAt
        }
    })

    }catch(e){
        console.log(e)
     res.status(500).send('Failed to save video metadata');
    }
}

const delMetaData= async (req,res)=>{
    try{
        const {vid}=req.params;

        const video=await videoModel.findByIdAndDelete(vid);

        if(!video)
            throw new Error("There no video for this problem in database");

        await cloudinary.uploader.destroy(video.cloudinaryPublicId,{resource_type:"video",invalidate:true});
 
        res.status(200).send("Deleted metadata successfully");

    }catch(e){
      res.status(500).send('Failed to delete video');    
    }
}

module.exports={getDigitalSignature,storeMetaData,delMetaData}

// const str=`
// 1}why invalidate:true

// . When you delete a video (or any asset) from Cloudinary, 
// it might still be accessible via cached copies on the CDN (Content Delivery Network) for up to 30 days.
//  This means that even though the asset is gone from Cloudinarys storage, 
//  users might still be able to access it through cached URLs.

// 2}how it works

// - When invalidate: true is set, Cloudinary sends a request to the CDN to remove cached copies of the asset.
// - The next time someone tries to access the asset, the CDN will check Cloudinary’s storage.
// - If the asset no longer exists, the request will return an error.
// - If the asset was replaced, the CDN will fetch the latest version.

// `