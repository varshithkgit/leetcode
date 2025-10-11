import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import axios from "axios"
import { useForm } from "react-hook-form";
import { useState } from "react";

function AdminUpload(){
   const {id}=useParams();

   const [uploading,setUploading]=useState(false);
   const [uploadProgress,setUploadProgress]=useState(0);
   const [uploadedVideo,setUploadedVideo]=useState(null);

   const {
    register,
    handleSubmit,
    watch,
    formState:{errors},
    reset,
    setError,
    clearErrors
   }=useForm();

   const selectedFile = watch('videofile')?.[0];

   const onSubmit=async (data) => {
   
    const file=data.videofile[0];

    // Starting to upload video on Cloudinary
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try{
        //Step-1 getting signature
       const {data}=await axiosClient.get(`/video/getDigitalSignature/${id}`);
       const {api_key,cloud_name,public_id,signature,timestamp,upload_url}=data;

       //Step-2 Create FormData for Cloudinary upload
       const formData=new FormData();
       formData.append("file",file);
       formData.append("signature",signature);
       formData.append("api_key",api_key);
       formData.append("timestamp",timestamp);
       formData.append("public_id",public_id);

      //Step-3 Uploading directly to Cloudinary
      const uploadCloudinary=await axios.post(upload_url,formData,{
        headers:{
        "Content-Type": "multipart/form-data"
        },
        onUploadProgress:(progressEvent)=>{
            const percentage=Math.round((progressEvent.loaded*100)/progressEvent.total);
            setUploadProgress(percentage);
        }
      });
      
      const cloudinaryResult=uploadCloudinary.data;

      //Step-4 Save metaData in DB
      const metaDataSave=await axiosClient.post("/video/storeMetaData",{
      prblmId:id,
      cloudinaryPublicId:cloudinaryResult.public_id,
      secureUrl:cloudinaryResult.secure_url,
      duration:cloudinaryResult.duration
      });


    setUploadedVideo(metaDataSave.data.videoSloution);
    reset();// Reset form after successful upload

    }catch(e){
       console.log(e);
       setError("root", {
       type: "manual",
       message:  e.response?.data?.message ||"Video  failed to uploading"
       });
    }finally{
        setUploading(false);
        setUploadProgress(0);
    }

   }

      // Format file size
      const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
    
      // Format duration
      const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

   return(

  <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
  <div className="max-w-7xl mx-auto">
    {/* Page Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-extrabold tracking-tight">📹 Upload Video</h1>
    </div>

    {/* Form Container */}
    <div className="bg-gray-900 border border-gray-800 shadow-xl rounded-lg overflow-hidden p-6">
      <div className="card bg-transparent">
        <div className="card-body">
          <h2 className="text-2xl font-bold mb-4">Upload Video File</h2>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* File Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-gray-300">Choose video file</span>
              </label>
              <input 
              type="file" 
              accept="video/*" 
              className={`file-input file-input-bordered w-full bg-gray-800 border-gray-700 text-gray-300 ${errors.videofile?'file-input-error' : ''}`}
              {...register("videofile",{
                required: 'Please select a video file',
                validate: {
                isVideo:(files)=>{
                   if(!files||!files[0]) return "Please select a video file";
                   const file=files[0];
                   return file.type.startsWith("video/")|| 'Please select a valid video file';
                },
                fileSize:(files)=>{
                   if(!files||!files[0]) return true;
                   const file=files[0];
                   const maxSize=1024*1024*10;
                   return file.size<=maxSize ||"File size should be less than 100MB"
                }
              }
              })}
              disabled={uploading}
              />
               {errors.videofile ? (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.videofile.message}</span>
                    </label>
                ):""}
            </div>

             {/* Selected File Info */}
             {
                selectedFile ?(
                  <div className="alert alert-info">
                    <div>
                      <h3 className="font-bold">Selected File:</h3>
                      <p className="text-sm">{selectedFile.name}</p>
                      <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                ):""
             }

            {/* Upload Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <progress className="progress progress-primary w-full bg-gray-700" value={uploadProgress} max="100"></progress>
            </div>

            {/* Error Message */}
                {errors.root && (
                  <div className="alert alert-error">
                    <span>{errors.root.message}</span>
                  </div>
                )}

            {/* Success Message */}
            {uploadedVideo ? (
                  <div className="alert alert-success">
                    <div>
                      <h3 className="font-bold">Upload Successful!</h3>
                      <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
                      <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                    </div>
                  </div>
            ):""}

            {/* Upload Button */}
            <div className="card-actions justify-end">
              <button 
              type="submit" 
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition duration-200 ${uploading?"loading":""}`}
              disabled={uploading}
              >
                {uploading?"Uploading...":"Upload Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

   )
}

export default AdminUpload;