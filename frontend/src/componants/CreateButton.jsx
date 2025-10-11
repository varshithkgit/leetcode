import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../utils/axiosClient";
import { replace, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const createSchema=z.object({
    topic:z.enum(["Career","Contest","Compensation","Feedback","Interview"]),
    header:z.string().min(1,"Topic is required"),
    content:z.string().min(1,"Content is required")
})

function CreateButton(){
  const {register,handleSubmit,formState:{errors},reset}=useForm({resolver:zodResolver(createSchema)});
  const navigate=useNavigate();
  const {dark}=useSelector(state=>state.slice)

  const onSubmit= async (d)=>{
    reset();
   try{
     const {data}=await axiosClient.post("/discuss/createDiscussion",d);
     alert("Posted Successfully");
     navigate("/",{replace:true})
   }catch(e){
     alert("There was some error: "+e);
   }
  }
  
    return(
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className={`card shadow-lg mt-4 ${dark ? "bg-gray-800" : "bg-[#F8EEDF]"}`}>
      <div className="card-body space-y-4">

        <div className="form-control">
          <label className="label">
            <span className={`label-text ${dark ? "text-gray-400" : "text-gray-700"} ${errors.topic ? "border-red-500" : ""}`}>Topic : -</span>
          </label>
          <select className={`select select-bordered ml-4 ${dark ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`} {...register('topic')}>
            <option value="">Choose a topic</option>
            <option value="Career">Career</option>
            <option value="Contest">Contest</option>
            <option value="Compensation">Compensation</option>
            <option value="Feedback">Feedback</option>
            <option value="Interview">Interview</option>
          </select>
          {errors.topic && (
          <p className="text-red-400 text-sm mt-1">{errors.topic.message}</p>
        )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className={`label-text font-semibold ${dark ? "text-[#FE7743]" : "text-orange-600"} ${errors.header ? "border-red-500" : ""}`}>Title : -</span>
          </label>
          <input
            type="text"
            placeholder="Enter discussion title"
            className={`input input-bordered w-full ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}`}
            {...register('header')}
          />
          {errors.header && (
          <p className="text-red-400 text-sm mt-1">{errors.header.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className={`label-text font-semibold ${dark ? "text-[#FE7743]" : "text-orange-600"} ${errors.content ? "border-red-500" : ""}`}>Content : -</span>
          </label>
          <textarea
            placeholder="Write your message here..."
            className={`textarea textarea-bordered w-full ${dark ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"}`}
            rows={4}
            {...register('content')}
          />
        {errors.content && (
          <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
        )}
        </div>

        <div className="form-control">
          <button className={`btn btn-success btn-md border-none text-white bg-green-600 hover:bg-green-500`} type="submit">Post Discussion</button>
        </div>
      </div>
    </div>
  </form>

    )
}

export default CreateButton;