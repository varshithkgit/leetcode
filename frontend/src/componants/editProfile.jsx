import { motion } from "framer-motion";
import { UploadCloud, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

export default function EditProfile() {
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors},
        watch,
        setError,
        clearErrors    
    }=useForm();
    const [uploading,setUploading]=useState(false);
    const [uploadProgress,setUploadProgress]=useState(0);
    const [uploadedPhoto,setUploadedPhoto]=useState(null);
    const {profile}=useSelector(state=>state.slice);
    const navigate=useNavigate();

    const selectedFile=watch("imageFile")?.[0]
    

   const onsubmit= async(d)=>{

    const file=d?.imageFile[0];

    //started upload photo
    setUploadProgress(0);
    setUploading(true);
    clearErrors();

    try{
      //getting digiSignture
      const {data}=await axiosClient.get("/image/digiSign");
      const {timestamp,signature,public_id,api_key,upload_url}=data;

      //formatting data(credentials)
      const form =new FormData();
      form.append("file",file);
      form.append("timestamp",timestamp);
      form.append("signature",signature);
      form.append("public_id",public_id);
      form.append("api_key",api_key);

      //sending photo
      const uploadCloudinary=await axios.post(upload_url,form,{
        headers:{
        "Content-Type": "multipart/form-data"
        },
        onUploadProgress:(progress)=>{
          const percentage=Math.round((progress.loaded*100)/progress.total);
          setUploadProgress(percentage);
        }
      });

      //storing metadata
      const metaDataStore=await axiosClient.post("/image/storeMetaData",{
      cloudinaryPublicId:uploadCloudinary.data.public_id,
      secureUrl:uploadCloudinary.data.secure_url
      });

      setUploadedPhoto(metaDataStore.data.photoSolution);
      reset();
      
      await axiosClient.patch("/userauth/editProfile",{
        skills:d?.skills?.split(","),
        languages:d?.languages?.split(","),
        college:d?.college
      });
      alert("Updated Profile");
      navigate("/profile",{replace:true});
    }catch(e){
      console.log(e);
      setError("root", {
       type: "manual",
       message:  e?.response?.data||"Sorry unable to upload"
       });
    }finally{
      setUploadProgress(0);
      setUploading(false);
    }

      
   }

  return (
    <div className="flex justify-center items-center min-h-screen  bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl bg-gray-900 text-[#EFEEEA] p-8 rounded-3xl shadow-[0_0_30px_#FE7743]/20 space-y-8"
      >
        <h2 className="text-3xl font-bold text-center text-white">Edit Your Profile</h2>

        {/* Profile Picture Upload */}
        <form className="space-y-6" onSubmit={handleSubmit(onsubmit)}>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-800 border-2 border-gray-100 rounded-full overflow-hidden shadow-lg">
            <img
              src={profile?.secureUrl|| "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/500px-Unknown_person.jpg"}
              className="w-full h-full object-cover"
            />
          </div>
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-900 hover:bg-gray-600 text-sm rounded-xl font-medium transition-all">
            <UploadCloud size={18} />
            <span>Select Photo</span>
            <input 
            type="file" 
            accept="image/*"
            className="hidden" 
            {...register("imageFile",{
              required:"Please select an image file",
              validate:{
                isPhoto:(files)=>{
                  if(!files||!files[0]) return "Please select a image file";
                  let file=files[0];
                  return file.type.startsWith("image/") || "Please select a valid image file";
                },
                fileSize:(files)=>{
                  if(!files||!files[0]) return true;
                  const file=files[0];
                  const maxSize=1024*1024*10; //100MB
                  return file.size<=maxSize || "Please upload a file with size less than 100mb"
                }
              }
            })}
            disabled={uploading}
            />
             {errors.imageFile ? (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors?.imageFile?.message}</span>
                    </label>
              ):""}
          </label>
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
                {errors?.root && (
                  <div className="alert alert-error">
                    <span>{errors?.root?.message}</span>
                  </div>
                )}

            {/* Success Message */}
            {uploadedPhoto ? (
                  <div className="alert alert-success">
                    <div>
                      <h3 className="font-bold">Upload Successful!</h3>
                      <p className="text-sm">Uploaded: {new Date(uploadedPhoto.uploadedAt).toLocaleString()}</p>
                    </div>
                  </div>
            ):""}

        {/* Input Fields */}
        
          <div>
            <label className="block mb-1 text-sm font-semibold text-[#EFEEEA]">College</label>
            <input
              type="text"
              placeholder="Enter your college"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-text-gray-700"
              {...register("college",{required:"College name requirred"})}
            />
          </div>
          {
            errors.college && (
              <p className="text-red-400 text-sm mt-1">{errors?.college?.message}</p>
            )
          }

          <div>
            <label className="block mb-1 text-sm font-semibold text-[#EFEEEA]">Skills</label>
            <input
              type="text"
              placeholder="e.g., React, Node.js (comma-separated)"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-text-gray-700"
               {...register("skills",{required:"Atleast one skill requirred"})}
            />
          </div>
          {
            errors.skills && (
              <p className="text-red-400 text-sm mt-1">{errors?.skills?.message}</p>
            )
          }

          <div>
            <label className="block mb-1 text-sm font-semibold text-[#EFEEEA]">Languages Known</label>
            <input
              type="text"
              placeholder="e.g., c,c++ (comma-separated)"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-text-gray-700"
               {...register("languages",{required:"Atleast one language name requirred"})}
            />
          </div>
          {
            errors.languages && (
              <p className="text-red-400 text-sm mt-1">{errors?.languages?.message}</p>
            )
          }

          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-700 text-gray-900 hover:bg-gray-600 font-medium shadow-lg transition-all"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
