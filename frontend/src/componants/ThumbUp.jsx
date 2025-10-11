import {ThumbsUpIcon} from "lucide-react";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useSelector } from "react-redux";


function ThumbUp({value,id}){
  
    const [values,setValues]=useState(value);
    const {dark}=useSelector(state=>state.slice);
    const {user}=useSelector(state=>state.auth);

    //incomplete updated backend but didn't show in frontend
    const updateLike=async () => {
      try{
        const {data}=await axiosClient.patch(`/discuss/updateThumbsUp/${id}?userId=${user._id}`);
        setValues(data);
       }catch(e){
        alert("Error: "+e);
       }
    }
      
     return(
      <div className="flex items-center gap-1 ">
            <ThumbsUpIcon className="w-4 h-4 " style={{fill:values?.includes(user._id)?`${dark?"white":"black"}`:"transparent"}} onClick={()=> updateLike()}/> {values.length}
      </div>
     )
  }

export default ThumbUp;