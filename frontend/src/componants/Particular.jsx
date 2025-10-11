import { EyeIcon, MessageCircleIcon } from "lucide-react";
import ThumbUp from "./ThumbUp";
import Comments from "./Comments";
import { useState } from "react";
import { useSelector } from "react-redux";


function reverseString(str){
  str=str.split("-");
  let newStr=[];
    for(let i of str){
       newStr.unshift(i)
    }

    return newStr.join("-");
}


function ParticularDiscussion({discussion}){
  const [comment,setComment]=useState(false);
  const {dark}=useSelector(state=>state.slice);
  
  return(
    <div className="p-6  shadow hover:shadow-lg transition-all">
        <div className={`text-sm mb-1 ${ dark ? "text-gray-400" : "text-gray-600"}`}>
          {discussion.firstname} • {reverseString(discussion.createdAt?.split("T")[0])}
        </div>
        <h3 className={`text-xl font-semibold ${dark ? "text-[#FE7743]" : "text-orange-600"}`}>
          {discussion.header}
        </h3>
        <p className={`leading-relaxed ${dark ? "text-gray-300" : "text-gray-700"}`}>
          {discussion.content}
        </p>
        <div className={`flex gap-6 text-sm pt-2 ${dark ? "text-gray-400" : "text-gray-600"}`}>
          <ThumbUp value={discussion.stats.votes} id={discussion._id}></ThumbUp>
          <div className="flex items-center gap-1">
            <EyeIcon className="w-4 h-4" /> {discussion.stats.views}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleIcon className="w-4 h-4" onClick={()=>{setComment(!comment)}}/> {discussion.stats.comments?.length}
          </div>
        </div>
        <div className={`overflow-y-scroll transition-all duration-800 ease-in-out ${comment?"max-h-[1050px]":"max-h-0"}`}>
        {comment?<Comments array={discussion.stats.comments} id={discussion._id}></Comments>:""}
        </div>
      </div>
  )
}

export default ParticularDiscussion;