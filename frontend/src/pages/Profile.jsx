import { useState , useEffect} from "react";
import { useSelector ,useDispatch} from "react-redux";
import axiosClient from "../utils/axiosClient";
import Header from "../componants/Header";
import {logoutUser} from "../authSlice"
import { NavLink } from "react-router";
import Progress from "../componants/Progress";
import PaymentGateWay from "../componants/PaymentGateWay";

function reverseString(str){
  str=str?.split("-");
  let newStr=[];
    for(let i of str){
       newStr.unshift(i)
    }

    return newStr.join("-");
}


const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

function Profile() {
    const [prblms,setPrblms]=useState([]);
    const [userSolvedPrblms,setUserSolvedPrblms]=useState([]);
    const [tabPanel,setTabPanel]=useState("Recent AC");
    const {user}=useSelector(state=> state.auth);
    const {dark}=useSelector(state=>state.slice);
    const [discuss,setDiscuss]=useState([]);
    const [submits,setSubmits]=useState([]);
    const [recentAc,setRecentAc]=useState([]);

    const dispatch=useDispatch();
    const {stars}=useSelector(state=>state.slice);
    const {profile}=useSelector(state=>state.slice);
    
    useEffect(()=>{
    const getAllProblem= async()=>{
      try{
         const {data}= await axiosClient.get("/prblm/getAllPrblm",);
         setPrblms(data)
         
      }catch(e){
        alert(e);
      }
    }   
  
    const getAllUserSolvedPrblms= async()=>{
      try{
         const {data}= await axiosClient.get("/prblm/getAllUserSolvedPrblms",);
        setUserSolvedPrblms(data);
      }catch(e){
        alert(e);
      }
    }

    const getDiscussionByUserId= async () => {
        try{

            const {data}= await axiosClient.get(`/discuss/getDiscussionByUserId/${user._id}`);
            setDiscuss(data.discussion);
        }catch(e){
            alert(e);
        }
    }

    const getAllUserSubmits= async () => {
        try{
            const {data}= await axiosClient.get(`/submit/getAllUserSubmits`);
            const year=new Date().getFullYear();
            const submitsInPast= data.map((curr)=>{
                 const yr=new Date(curr.createdAt).getFullYear();
                 if(yr==year) 
                   return curr;
            });
            setSubmits(submitsInPast);
            setRecentAc(data?.slice(Math.floor(data.length/2)));
        }catch(e){
            alert(e);
        }
    }

    
    getAllProblem();
    if(user) getAllUserSolvedPrblms();
    getDiscussionByUserId();
    getAllUserSubmits();
     },[user]);

   const handleLogout=()=>{
        dispatch(logoutUser());
        //  setUserSolvedPrblms([]);
    }

    const handleDeleteProfile=async()=>{
          try{
            if(confirm("Are u sure u wanna delete your profile?")){
                await axiosClient.delete("/userauth/deleteProfile");
                alert("Your profile was deleted successfully");
            }
          }catch(e){
             alert("There was an issue while deleting ur profile try again later.")
          }
    }


  return (
    <>
    <Header></Header>
    <div className={`${dark ? "bg-gray-900" : "bg-gray-100"} min-h-screen p-6 flex flex-col md:flex-row gap-4`}>
      <div className="w-full md:w-1/4 flex flex-col gap-4">
        <div className={`${dark ? "bg-gray-800 shadow-lg" : "bg-white shadow-md"} rounded-box p-4`}>
          <div className="flex flex-col items-center">
            <div className={`${dark ? "bg-gray-700" : "bg-gray-300"} w-20 h-20 rounded-full mb-2`}>
            <img
            className="w-full h-full rounded-full object-cover"
            src={profile?.secureUrl|| "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/500px-Unknown_person.jpg"}
            />
            </div>
            <h2 className="text-xl font-semibold">{user.firstname}</h2>
            <p className={`${dark ? "text-gray-500" : "text-gray-700"} text-sm`}>Rank ~5,000,000</p>
            {/* <button className="btn btn-sm btn-success mt-2">Edit Profile</button> */}
            <p className={`${dark ? "text-gray-400" : "text-gray-600"} mt-1 text-xs`}>@{profile?.college || profile?._doc?.college||"No enough data"}</p>
          </div>
        </div>

        <div className={`${dark ? "bg-gray-800 shadow" : "bg-white shadow"} rounded-box p-4`}>
          <h3 className={`${dark ? "text-white" : "text-black"} font-semibold mb-2`}>Community Stats</h3>
          <ul className={`${dark ? "text-gray-500" : "text-gray-700"} text-sm space-y-1`}>
            <li>👁️ Views: 0</li>
            <li>✅ Solved: {userSolvedPrblms.length}</li>
            <li>💬 Discuss: {discuss?.length}</li>
            <li>⭐ List: {stars?.length}</li>
          </ul>
        </div>

        <div className={`${dark ? "bg-gray-800 shadow" : "bg-white shadow"} rounded-box p-4`}>
          <h3 className={`${dark ? "text-white" : "text-black"} font-semibold mb-2`}>Languages</h3>
          <p className={`${dark ? "text-gray-400" : "text-gray-600"} text-md`}>{profile?.languages?.join(", ") || profile?._doc?.languages?.join(", ") || "Not enough data"}</p>
          <h3 className={`${dark ? "text-white" : "text-black"} font-semibold my-2`}>Skills</h3>
          <p className={`${dark ? "text-gray-400" : "text-gray-600"} text-sm`}>{profile?.skills?.join(", ")|| profile?._doc?.skills?.join(", ") ||"Not enough data"}</p>
        </div>

        <div className={`${dark ? "bg-gray-800 shadow-xl" : "bg-white shadow-md"} h-[360px] rounded-box p-6 flex flex-col justify-between animate-fade-in`}>
          <div>
           <h3 className={`${dark ? "text-white" : "text-black"} text-lg font-semibold mb-4`}>Account Actions</h3>

            <button
              onClick={handleLogout}
              className="w-full btn btn-outline btn-error mb-4 transition-transform duration-300 hover:scale-105"
            >
              Logout
            </button>

            <button 
            className={`w-full btn btn-outline mb-4 transition-transform duration-300 hover:scale-105 ${
           dark
             ? "border-amber-50 text-amber-50 btn-ghost hover:text-black"
             : "border-amber-700 text-amber-700 btn-ghost hover:text-black"
             }`}

            onClick={handleDeleteProfile}
            >
              delete Profile
            </button>

            {user.role === "admin" && (
              <NavLink
               to="/admin"
               className="w-full btn btn-outline btn-info transition-transform duration-300 hover:scale-105 text-center"
              >
               Admin Panel
              </NavLink>
            )}

            <NavLink to={"/editProfile"}>
            <button className="w-full btn btn-outline btn-success mt-4 transition-transform duration-300 hover:scale-105">
              Edit Profile
            </button>
            </NavLink>
         </div>

        <div className={`text-center mt-6 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
         Made with ❤️ by Varshith K
        </div>
      </div>

      </div>

      <div className="w-full md:w-3/4 flex flex-col gap-4">
      <div className="flex gap-x-4 ">
<div className={`${dark ? "bg-gray-800 shadow" : "bg-white shadow-md"} w-[50%] rounded-box p-4`}>

  <div className="flex justify-center items-center relative">
    <div className="relative w-50 h-50">
      {/* Background Circle */}
<svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
  {/* EASY (Green) */}
  <circle
    cx="100"
    cy="100"
    r="90"
    stroke="#D1FAE5"  // bg-green-100
    strokeWidth="8"
    strokeDasharray="565.4"
    strokeDashoffset="465.8"
    fill="transparent"
    strokeLinecap="round"
    transform="rotate(235 100 100)"
  />
  <circle
    cx="100"
    cy="100"
    r="90"
    stroke="#6EE7B7"  // green-300
    strokeWidth="8"
    strokeDasharray="565.4"
    strokeDashoffset={
      prblms.length !== 0
        ? 100*(1-userSolvedPrblms?.filter(qna=>qna.difficulty=="easy").length/prblms.length)+465.8
        : 565.4
    }
    className={`transition-[stroke-dashoffset] duration-[1.4s] ease-out`}
    strokeLinecap="round"
    fill="transparent"
    transform="rotate(235 100 100)"
  />

  {/* MEDIUM (Yellow) */}
  <circle
    cx="100"
    cy="100"
    r="90"
    stroke="#FEF9C3"
    strokeWidth="8"
    strokeDasharray="565.4"
    strokeDashoffset="405"
    fill="transparent"
    strokeLinecap="round"
    transform="rotate(308 100 100)"
  />
  <circle
    cx="100"
    cy="100"
    r="90"
    stroke="#FCD34D"
    strokeWidth="8"
    strokeDasharray="565.4"
    strokeDashoffset={
      prblms.length !== 0
        ? 159.6 * (1 - userSolvedPrblms?.filter(qna=>qna.difficulty=="medium").length / prblms.length) + 405.8
        : 565.4
    }
    className="transition-[stroke-dashoffset] duration-[1.4s] ease-out"
    strokeLinecap="round"
    fill="transparent"
    transform="rotate(308 100 100)"
  />

  {/* HARD (Red) */}
  <circle
    cx="100"
    cy="100"
    r="90"
    stroke="#FEE2E2"
    strokeWidth="8"
    strokeDasharray="565.4"
    strokeDashoffset="465.8"
    fill="transparent"
    strokeLinecap="round"
    transform="rotate(60 100 100)"
  />
  <circle
    cx="100"
    cy="100"
    r="90"
    stroke="#FCA5A5"
    strokeWidth="8"
    strokeDasharray="565.4"
    strokeDashoffset={
      prblms.length !== 0
        ? 100 * (1 - userSolvedPrblms?.filter(qna=>qna.difficulty=="hard").length / prblms.length) + 465.8
        : 565.4
    }
    className="transition-[stroke-dashoffset] duration-[1.4s] ease-out"
    strokeLinecap="round"
    fill="transparent"
    transform="rotate(60 100 100)"
  />
</svg>


      {/* Center Text */}
     <div className={`absolute inset-0 flex items-center justify-center text-sm font-medium ${dark ? "text-gray-100" : "text-gray-900"}`}>
        <span className="font-bold text-2xl absolute top-20 right-27">{userSolvedPrblms.length}</span>/{prblms.length}
        <div className={`absolute bottom-7 font-bold text-lg ${dark ? "text-gray-100" : "text-gray-900"}`}>
          Solved
         </div>
      </div> 
    </div>
     
     <div className=" flex flex-col gap-2 text-sm text-center absolute right-3 ">
        <div className={`${dark ? "bg-green-300 text-green-700" : "bg-green-100 text-green-900"} py-1 px-5 rounded`}><span className="font-medium">Easy</span><br />{userSolvedPrblms?.filter(qna=>qna.difficulty=="easy").length}/{prblms?.filter(qna=>qna.difficulty=="easy").length}</div>
        <div className={`${dark ? "bg-yellow-300 text-yellow-700" : "bg-yellow-100 text-yellow-900"} py-1 rounded`}><span className="font-medium">Medium</span><br />{userSolvedPrblms?.filter(qna=>qna.difficulty=="medium").length}/{prblms?.filter(qna=>qna.difficulty=="medium").length}</div>
        <div className={`${dark ? "bg-red-300 text-red-700" : "bg-red-100 text-red-900"} py-1 rounded`}><span className="font-medium">Hard</span><br />{userSolvedPrblms?.filter(qna=>qna.difficulty=="hard").length}/{prblms?.filter(qna=>qna.difficulty=="hard").length}</div>
      </div>
  </div>
</div>
       
<PaymentGateWay></PaymentGateWay>

      </div>

      {submits.length>0?<Progress submits={submits}></Progress>:""}

      <div className={`${dark ? "bg-gray-800 shadow" : "bg-white shadow-md"} rounded-box p-4`}>
  <div role="tablist" className="tabs tabs-bordered gap-1 text-amber-50">
    <a role="tab" className={`tab tab-bordered rounded-xl ${
    dark
    ? "!text-white hover:bg-gray-700 focus:bg-gray-700"
    : "text-gray-900 hover:bg-gray-300 focus:bg-gray-300"
    } ${tabPanel == "Recent AC" ? (dark ? "bg-gray-700" : "bg-gray-200") : ""}`}
     onClick={()=>setTabPanel("Recent AC")}>Recent AC</a>

    <a role="tab" className={`tab tab-bordered rounded-xl ${
  dark
    ? "!text-white hover:bg-gray-700 focus:bg-gray-700"
    : "text-gray-900 hover:bg-gray-300 focus:bg-gray-300"
} ${tabPanel == "List" ? (dark ? "bg-gray-700" : "bg-gray-200") : ""}`}
 onClick={()=>setTabPanel("List")}>List</a>

    <a role="tab" className={`tab tab-bordered rounded-xl ${
  dark
    ? "!text-white hover:bg-gray-700 focus:bg-gray-700"
    : "text-gray-900 hover:bg-gray-300 focus:bg-gray-300"
} ${tabPanel == "Solved" ? (dark ? "bg-gray-700" : "bg-gray-200") : ""}`}
 onClick={()=>setTabPanel("Solved")}>Solved</a>
    <a role="tab" className={`tab tab-bordered rounded-xl ${
  dark
    ? "!text-white hover:bg-gray-700 focus:bg-gray-700"
    : "text-black hover:bg-gray-300 focus:bg-gray-300"
} ${tabPanel == "Discuss" ? (dark ? "bg-gray-700" : "bg-gray-200") : ""}`}
 onClick={()=>setTabPanel("Discuss")}>Discussions</a>
  </div>

{tabPanel=="Recent AC" &&(
  <div className="mt-4">
   <div className="space-y-4 h-[300px] overflow-y-scroll">
    {
   recentAc.map((obj,i)=>(
    <div key={i} className={`${dark ? "bg-gray-900 text-white shadow" : "bg-gray-100 text-black shadow-md"} p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center`}>
      <div>
        <p className={`${dark ? "text-gray-400" : "text-gray-600"} text-sm`}>Submitted at {reverseString(obj?.createdAt.split("T")[0])} · {obj?.prblmId?.difficulty}</p>
      </div>
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        <span className="badge badge-success">{obj?.status}</span>
        <span className="badge badge-outline">{obj?.language}</span>
        <span className={`${dark ? "text-gray-400" : "text-gray-600"} text-sm`}>Runtime: {obj?.runtime}ms</span>
      </div>
    </div>
    ))
    }
   </div>
  </div>
)
}
{
  tabPanel=="Discuss" 
  &&
  (
    <div className="h-[300px] overflow-y-scroll">
{
discuss.map((obj)=>(
<div className="space-y-4" key={obj._id}>
  <div className={`${dark ? "bg-gray-900 text-white shadow" : "bg-white text-black shadow-md"} p-4 rounded-box my-5`}>
    <h3 className={`text-lg font-semibold ${dark ? "text-[#FE7743]" : "text-[#FE7743]"}`}>{obj.header}</h3>
    <p className={`${dark ? "text-gray-400" : "text-gray-600"} text-sm`}>Category: {obj.topic} • Posted on {reverseString(obj.createdAt.split("T")[0])}</p>
    <div className={`flex gap-4 mt-2 text-sm ${dark ? "text-gray-500" : "text-gray-700"}`}>
      <span>💬 {obj.stats.comments?.length} comments</span>
      <span>⬆️ {obj.stats.votes} upvotes</span>
    </div>
  </div>
</div>
))  
}
  </div>
)
}
{
  tabPanel=="Solved" &&(
 <div className="h-[300px] overflow-y-scroll scrollbar-hide">
  {
  userSolvedPrblms.map((obj)=>(
    <div key={obj._id} className={`card rounded-xl my-4 ${dark ? "bg-gray-900 shadow-lg" : "bg-gray-100 shadow-md"}`}>
          <div className="card-body space-y-3">

            <div className="flex items-center justify-between">
              <NavLink
                to={`/prblm/${obj._id}`}
                className={`text-xl font-semibold transition duration-200 ${dark ? "text-white hover:text-blue-800" : "text-black hover:text-blue-600"}`}
              >
                {obj.title}
              </NavLink>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <div className={`badge ${getDifficultyBadgeColor(obj.difficulty)} capitalize`}>
                {obj.difficulty}
              </div>
              <div className="badge badge-info capitalize">{obj.tags}</div>
            </div>
          </div>
        </div>
  )
  )
}
 </div> 
  )
}
{
  tabPanel=="List"&&(
 <div className="h-[300px] overflow-y-scroll scrollbar-hide">
  {
  (prblms.filter((obj)=>stars.includes(obj._id))).map((obj)=>(
    <div key={obj._id} className={`card rounded-xl my-4 ${dark ? "bg-gray-900 shadow-lg" : "bg-gray-100 shadow-md"}`}>
          <div className="card-body space-y-3">

            <div className="flex items-center justify-between">
              <NavLink
                to={`/prblm/${obj._id}`}
                className={`text-xl font-semibold transition duration-200 ${dark ? "text-white hover:text-blue-800" : "text-black hover:text-blue-600"}`}
              >
                {obj.title}
              </NavLink>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <div className={`badge ${getDifficultyBadgeColor(obj.difficulty)} capitalize`}>
                {obj.difficulty}
              </div>
              <div className="badge badge-info capitalize">{obj.tags}</div>
            </div>
          </div>
        </div>
  )
  )
}
 </div> 
  )
}
</div>

      </div>
    </div>
    </>
  );
}

export default Profile;