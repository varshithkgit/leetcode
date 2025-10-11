import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useSelector,useDispatch} from "react-redux";
import { setStars } from "../slice";


function Star({prblmId}){
    const {stars}=useSelector(state=>state.slice);
    const [active,setActive]=useState(stars.includes(prblmId));
    const dispatch=useDispatch();

    const handleSave=async () => {
      try{
        const {data}=await axiosClient.put(`/prblm/activeStars/${prblmId}`); 
        if(!active) alert("Saved successfully");
        if(data) setActive(!active);
      }catch(e){
        alert("Unable to save problem.");
      }
    }

    useEffect(()=>{
    const getAllStar=async()=>{
      try{
        const {data}=await axiosClient.get(`/prblm/stars`); 
        dispatch(setStars(data));
      }catch(e){
        alert("Unable to fetch saved problems: "+e);
      }
     }

    getAllStar();
    },[active]);
    

    return(
    <div className="relative group" onClick={()=>handleSave()}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={active?"yellow":"transparent"}
      className="w-4 h-4 transition-colors ease-in duration-[0.10s]"
      viewBox="0 0 16 16"
      stroke="yellow"
    >
      {/* m-1:title nulla method */}
      {/* <title>{active?"Unsave in List":"Save in List"}</title> */}
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>

    {/* m-2:custom title*/}
    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
       {active?"Unsave this question":"Save this question"} 
    </span>
    </div>
    )
}

export default Star;