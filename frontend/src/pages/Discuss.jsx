import { NavLink } from "react-router";
import Header from "../componants/Header";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useSelector } from "react-redux";
import ParticularDiscussion from "../componants/Particular";
import CreateButton from "../componants/createButton";


function Discuss(){
  const [discussions,setDiscussions]=useState([]);
  const [loading,setLoading]=useState(false);
  const [filter,setFilter]=useState("For you");
  const {user}=useSelector(state=>state.auth);
  const {dark}=useSelector(state=>state.slice);
  const [create,setCreate]=useState(false);
  
  
  useEffect(()=>{
    const getAllDiscussions= async () => {
      setLoading(true);
      try{
        const {data}=await axiosClient.get("/discuss/getAllDiscussions");
        setDiscussions(data);
      }catch(e){
        alert("There was a problem while  fetching discussions");
      }finally{
        setLoading(false);
      }
    }

    getAllDiscussions();
  },[user]);

  const main=filter=="For you"?discussions:discussions.filter(discussion=>discussion.topic==filter);
 
  if(loading){
     return(
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
     );
  }


   return(
    <>
    <Header></Header>

 <div className={`min-h-screen px-6 py-10 space-y-10 transition-all ${dark ? "bg-gray-900 text-white" : "bg-[#faf9f6] text-black"}`}>
 <div className="flex overflow-x-auto gap-4  py-2 w-full max-w-7xl mx-auto h-45 scrollbar-hide">
  {[
    "https://assets.leetcode.com/users/images/072c955f-6c0b-4b58-a80b-b97b0838ad23_1740642810.952664.png",
    "https://assets.leetcode.com/users/images/74bc2157-3a3e-472d-ad41-ee4bfd91cf99_1740642939.269674.jpeg",
    "https://assets.leetcode.com/users/images/94cb7048-59bf-41bd-9e49-056c74e0d123_1740642973.2215493.png",
    "https://assets.leetcode.com/users/images/424456fd-154f-4bd1-bd53-1b52d63b230b_1740642664.7449324.png",
    "https://assets.leetcode.com/users/images/b0a08a5c-c575-48f6-9110-b6ae4e011e98_1655746322.579097.png",
    "https://assets.leetcode.com/users/images/942e9e91-7f81-4513-8544-c462980a5d3a_1738741032.3553998.png",
    "https://assets.leetcode.com/users/images/1871a4e4-3f06-4e47-9b4d-e586265ab94d_1749761181.1134677.png"
  ].map((url, idx) => (
    <div
      key={idx}
      className={`min-w-[270px] h-full rounded-2xl shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1 flex-shrink-0 ${dark ? "bg-gray-800" : "bg-[#E8C999]"}`}
    >
      <NavLink to={"/explore"} className="h-full w-full block">
        <img
          src={url}
          alt={`User ${idx}`}
          className="h-full w-full object-cover rounded-2xl"
        />
      </NavLink>
    </div>
  ))}
 </div>


  <div className="flex items-center gap-4 flex-wrap w-[95%] mx-auto">
    <div className={`tabs tabs-boxed flex justify-between w-[40%] ${dark ? " text-white" : " text-black"}`}
    >
      {["For you", "Career", "Contest", "Compensation", "Feedback", "Interview"].map((tab) => (
        <button
          key={tab}
          className={`btn btn-sm border-none relative ${dark ? "bg-gray-800 text-white" : "bg-[#F8EEDF] text-black"}`}
          onClick={()=>setFilter(tab)}
        >
          {tab}
        </button>
      ))}
      </div>

         <button className={`btn btn-success btn-md ml-auto text-white ${create ? "" : "pl-7"} border-none relative bg-green-600 hover:bg-green-500 `} onClick={()=>{setCreate(!create)}}>
              {create?(
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                 <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
              ):(
                <>
                <svg aria-hidden="true" focusable="false" 
              data-prefix="far" 
              data-icon="pen-to-square" 
              className="svg-inline--fa fa-pen-to-square absolute left-4 top-1/2 h-[1em] -translate-x-1/2 -translate-y-1/2 align-[-0.125em]" 
              role="img" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512">
                <path 
                fill="currentColor" 
                d={`M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 
                  0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1
                 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 
                  138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 
                  88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 
                  24-10.7 24-24s-10.7-24-24-24H88z`}>
                </path>
                </svg>
                {"Create"}
                </>
                )}
        </button>
    
  </div>

  <div className="space-y-6">
    <div className={`overflow-hidden transition-all duration-800 ease-in-out ${create?"max-h-[1050px]":"max-h-0"}`}>
    <CreateButton></CreateButton>
    </div>
    {
    main.map((discussion, idx) => <ParticularDiscussion discussion={discussion} key={idx}></ParticularDiscussion>)
    }
  </div>
</div>
    </>
   )
}

export default Discuss;