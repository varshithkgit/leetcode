import { useForm } from 'react-hook-form';
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from '../utils/axiosClient';
import { useDispatch ,useSelector } from 'react-redux';
import { setNotes } from '../slice';

const noteSchema=z.object({
    title:z.string().min(1,'Title is required'),
    body:z.string().min(1,'Body is required')
    
});

function BodyOfNote({obj,i,prblmId}){

  //console.log(obj);
    const {
        register,
        handleSubmit,
        formState:{errors}
        }=useForm({
           resolver:zodResolver(noteSchema),
           defaultValues:{
            title:obj.title,
            body:obj.body
           }
          });
    const dispatch=useDispatch();
    const {dark}=useSelector(state=>state.slice);
    

    const onSubmit= async (d)=>{
      d.prblmId=prblmId;
      d.i=i;
      try{
       const {data}=await axiosClient.patch("/prblm/updNote",d);
       dispatch(setNotes(data));
       alert("Saved notes successfully.")
      }catch(e){
        alert("Error: "+e);
      }
    }

    return(
    
<section id={i} className='h-[700px]'>

  <form
  className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} w-full h-[200%] max-h-[90vh] p-6 rounded-lg border flex flex-col`}
  onSubmit={handleSubmit(onSubmit)}
>
  <input
    {...register("title")}
    className={`${dark ? "text-white border-gray-600 focus:border-blue-500" : "text-black border-gray-300 focus:border-blue-600"} text-xl font-bold mb-4 bg-transparent outline-none border-b`}
    placeholder="Note Title"
  />
  {errors.title && (
    <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
  )}

  <textarea
    {...register("body")}
    placeholder="Write your important notes here..."
    className={`${dark ? "bg-gray-900 text-gray-200 border-gray-600 focus:ring-blue-500" : "bg-white text-black border-gray-300 focus:ring-blue-400"} flex-1 min-h-[300px] max-h-[calc(90vh-160px)] p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 h-full`}
  ></textarea>
  {errors.body && (
    <p className="text-red-400 text-sm mt-1">{errors.body.message}</p>
  )}

  <div className="flex justify-end mt-4">
    <button
      type="submit"
      className={`${dark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-200 hover:bg-green-300 text-green-900"} btn px-4 py-2 rounded`}
    >
      Save Note
    </button>
  </div>
</form>
</section>

    )
}

export default BodyOfNote;