import { useState} from "react";
import axiosClient from "../utils/axiosClient";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function reverseString(str) {
  str=str.split("-");
  let newStr=[];
    for(let i of str){
       newStr.unshift(i)
    }

    return newStr.join("-");
}

export default function Comments({ array ,id}) {
  const [comments, setComments] = useState(array);
  const {register,handleSubmit,reset,formState:{errors}}=useForm();
  const  {dark}=useSelector(state=>state.slice);
   const navigate=useNavigate();

  const onSubmit=async (d) => {
    reset();
    try{
        const {data}=await axiosClient.post(`/discuss/createComment/${id}`,d);
        setComments(data);
        navigate("/",{replace:true});
    }catch(e){
        alert("Comment was not posteed due to some technical errors");
    }
  }

  return (
    <div className="overflow-hidden animate-fade-in-down transition-all duration-700 mt-4 space-y-4">
        <div
         className={`${dark?"bg-gray-800 border-[#FE7743]" : " bg-[#faf9f6] border-orange-600"} p-4 rounded-box shadow hover:shadow-md transition duration-300 border-l-4  space-y-1 relative`}
        >
            <form onSubmit={handleSubmit(onSubmit)}>

            <input type="text" className={`${dark?"bg-gray-700 ":" bg-[#F8EEDF] text-gray-900"} w-full p-4 pr-20 rounded-lg`} placeholder="Comment..." {...register('comment')}/>
            
            <button className={`btn btn-success btn-xs  text-white p-4 bg-green-600 hover:bg-green-500 border-none absolute right-7 top-7`} type="submit">
                <svg width="30px" height="30px" viewBox="-20 0 190 190" fill={"#FFFFFF"} xmlns="http://www.w3.org/2000/svg">
                 <path 
                 fillRule="evenodd" 
                 clipRule="evenodd" 
                 d="M76.33 132.14L62.5 143.73L58.59 144.26L49.84 114.11L19.06 104L113.82 67.8799L118.29 67.9799L103.36 149.19L76.33 132.14ZM100.03 83.1399L56.61 109.17L61.61 130.5L62.98 130.19L68.2 113.73L102.9 83.4799L100.03 83.1399Z" 
                 fill={"#FFFFFF"}/>
                </svg>
            </button>

            </form>
        </div>
      {comments.map(({ user, comment, date }, ix) => (
        <div
          key={ix}
          className={`${dark?"bg-gray-800 border-[#FE7743]" :"bg-[#faf9f6] border-orange-600"} p-4 rounded-box shadow hover:shadow-md transition duration-300 border-l-4 space-y-1`}
        >
          <div className="flex items-center">
            <h3 className={`font-semibold ${dark?"text-[#FE7743]":"text-orange-600"} inline mr-3`}>{user}</h3>
            <span className={`text-xs ${dark?"text-gray-400":"text-black"}`}>
              {reverseString(date.split("T")[0])}
            </span>
          </div>
          <p className={`text-sm ${dark?"text-gray-300":"text-black"}`}>{comment}</p>
        </div>
      ))}
    </div>
  );
}
