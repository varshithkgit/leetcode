import { useEffect, useState } from "react";
import { useSelector , useDispatch} from "react-redux";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";
import Header from "../componants/Header";
import Star from "../componants/Star";
import { setStars ,setProfile} from "../slice";
import {motion} from "framer-motion";

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

const monthArr=[["Jan",31,{s:"col-start-4",e:"col-end-5"}],
                ["Feb",28,{s:"col-start-7",e:"col-end-8"}],
                ["Mar",31,{s:"col-start-7",e:"col-end-8"}],
                ["Apr",30,{s:"col-start-3",e:"col-end-4"}],
                ["May",31,{s:"col-start-5",e:"col-end-6"}],
                ["Jun",30,{s:"col-start-1",e:"col-end-2"}],
                ["Jul",31,{s:"col-start-3",e:"col-end-4"}],
                ["Aug",31,{s:"col-start-6",e:"col-end-7"}],
                ["Sep",30,{s:"col-start-2",e:"col-end-3"}],
                ["Oct",31,{s:"col-start-4",e:"col-end-5"}],
                ["Nov",30,{s:"col-start-7",e:"col-end-8"}],
                ["Dec",31,{s:"col-start-2",e:"col-end-3"}]
              ];

function Homepage() {
    const [prblms,setPrblms]=useState([]);
    const [userSolvedPrblms,setUserSolvedPrblms]=useState([]);
    const [filter,setFilter]=useState({
        status:"all",
        difficulty:"all",
        tags:"all"
    });
    const [page,setPage]=useState(1);

    const {user}=useSelector(state=> state.auth);
    const {dark}=useSelector(state=> state.slice);
    const [monthIndex,setMonthIndex]=useState(new Date().getMonth());
    const dispatch=useDispatch();
    
    // m-1
    const filteredPrblms= (filter.status=="all"?prblms:userSolvedPrblms).filter((problem)=>{
                            const difficulty=filter.difficulty=="all"||problem.difficulty==filter.difficulty;
                            const tags=filter.tags=="all"||problem.tags==filter.tags;
                            return difficulty && tags;
                            }).filter((_,i)=>(i>=(page-1)*4 && i<page*4));
                            
    // m-2
  // const filteredProblems = problems.filter(problem => {
  //   const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
  //   const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
  //   const statusMatch = filters.status === 'all' || 
  //                     solvedProblems.some(sp => sp._id === problem._id);
  //   return difficultyMatch && tagMatch && statusMatch;
  // });

    useEffect(()=>{
    const getAllProblem= async()=>{
      try{
         const {data}= await axiosClient.get("/prblm/getAllPrblm",);
         setPrblms(data);
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

    const getAllStar=async()=>{
      try{
        const {data}=await axiosClient.get(`/prblm/stars`); 
        dispatch(setStars(data));
      }catch(e){
        alert("Unable to fetch saved problems: "+e);
      }
     }

     const getProfile=async () => {
           try{
              const {data}=await axiosClient.get("/userauth/getProfile");
              dispatch(setProfile(data));
           }catch(e){
             alert(e);
           }
         }
     
    getProfile();
    getAllStar();
    getAllProblem();
    if(user) getAllUserSolvedPrblms();
    
     },[user]);

     

  return ( 
<div className={`min-h-screen transition-colors overflow-x-hidden duration-500 ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
  <Header />
  

  <div className="max-w-full  px-4 py-6">

<div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT - Trending Topics */}
    <div className="w-full lg:w-[300px] transition-colors duration-500">
      <div
        className={`rounded-2xl shadow-lg border p-5 space-y-4 transition-colors duration-500
        ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
      >
        <h3 className={`text-xl font-bold transition-colors duration-500 ${dark ? "text-white" : "text-black"}`}>
          Trending Topics
        </h3>

        {/* Search Input */}
        <div className="relative p-[1px]">
          {/* <input
            type="text"
            placeholder="Search for a topic..."
            className={`input input-bordered w-full transition-colors duration-500
            ${dark
              ? "bg-gray-900 text-white placeholder-gray-500 border-gray-600"
              : "bg-gray-100 text-black placeholder-gray-400 border-gray-300"}`}
          />
          <svg
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 transition-colors duration-500
            ${dark ? "text-gray-400" : "text-gray-600"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg> */}
        </div>

        {/* Tag List */}
        <div className="flex flex-wrap gap-3 max-h-[300px] overflow-y-auto pr-2">
          {[
            { name: "Array", count: 6 },
            { name: "Graph", count: 3 },
            { name: "DP", count: 3 },
            { name: "Recursion", count: 0 },
            { name: "Linked List", count: 3 },
            { name: "Tree", count: 0 },
            { name: "Stack", count: 0 },
            { name: "Heap", count: 0 },
            { name: "Greedy", count: 0 },
            { name: "Backtracking", count: 0 },
          ].map((topic, i) => (
            <div
              key={i}
              className={`px-3 py-1 rounded-full border flex items-center gap-2 text-sm transition-colors duration-500
              ${dark
                ? "bg-gray-900 text-white border-gray-600 hover:bg-gray-700"
                : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"}`}
            >
              <span className="font-semibold">{topic.name}</span>
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold">
                {topic.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* LEFT - Filters + Problem List */}
      <div className="flex-1">
        {/* Filters */}
        <div className="flex flex-nowrap gap-4 mb-8 justify-center lg:justify-start">
          <select className={`select select-bordered transition-colors duration-500 ${dark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select className={`select select-bordered transition-colors duration-500 ${dark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
            value={filter.difficulty}
            onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select className={`select select-bordered transition-colors duration-500 ${dark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
            value={filter.tags}
            onChange={(e) => setFilter({ ...filter, tags: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="Array">Array</option>
            <option value="Linkedlist">Linked List</option>
            <option value="Graph">Graph</option>
            <option value="DP">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-6 h-[80vh]">
          {filteredPrblms.map(({ _id, title, difficulty, tags }, index) => (
            <div className={`card shadow-lg rounded-xl transition-colors duration-500 ${dark ? "bg-gray-800" : "bg-white"}`} key={_id}>
              <div className="card-body space-y-3">
                <div className="flex items-center justify-between">
                  <NavLink
                    to={`/prblm/${_id}`}
                    className={`text-xl font-semibold transition duration-200 ${dark ? "hover:text-blue-400 text-white" : "hover:text-blue-700 text-black"}`}
                  >
                    {(page-1)*4+index+1}{". "}{title}
                  </NavLink>
                  {userSolvedPrblms.some((up) => up._id === _id) && (
                    <div className="badge badge-success gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                  <div className={`badge ${getDifficultyBadgeColor(difficulty)} capitalize`}>
                    {difficulty}
                  </div>
                  <div className="badge badge-info capitalize">{tags}</div>
                  <div className="p-2">
                    <Star prblmId={_id} key={index} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
     <div className="flex items-center justify-center space-x-2 mt-6">
  <button className="px-3 py-1 rounded-md border border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white transition" onClick={()=>{page==1?{}:setPage(prev=>prev-1)}}>
    Prev
  </button>
  <button className={`px-3 py-1 rounded-xl ${page!=1 ?"text-gray-400" :"bg-gray-700 text-white"} font-medium`} onClick={()=>{setPage(1)}}>
    1
  </button>
  <button className={`px-3 py-1 rounded-xl ${page!=2 ?"text-gray-400" :"bg-gray-700 text-white"} font-medium`} onClick={()=>{setPage(2)}}>
    2
  </button>
  <button className={`px-3 py-1 rounded-xl ${page!=3 ?"text-gray-400" :"bg-gray-700 text-white"} font-medium`} onClick={()=>{setPage(3)}}>
    3
  </button>
  <button className={`px-3 py-1 rounded-xl ${page!=4 ?"text-gray-400" :"bg-gray-700 text-white"} font-medium`} onClick={()=>{setPage(4)}}>
    4
  </button>
  <button className={`px-3 py-1 rounded-xl ${page!=5 ?"text-gray-400" :"bg-gray-700 text-white"} font-medium`} onClick={()=>{setPage(5)}}>
    5
  </button>
  <button className="px-3 py-1 rounded-md border border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white transition" onClick={()=>{page==5?{}:setPage(prev=>prev+1)}}>
    Next
  </button>
</div>

      </div>

      {/* RIGHT - Calendar */}
      <div className="w-full lg:w-[350px]">
        <div className={`${dark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-black"} rounded-2xl shadow-lg p-6 transition-all duration-500`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`${dark ? "text-white" : "text-black"} text-xl font-bold transition-colors duration-500`}>Progress Calendar</h3>
            <button onClick={()=>setMonthIndex(prev=>prev==0?11:prev-1)}>
            <svg className="h-7 w-7" viewBox="-19.04 0 75.803 75.803" xmlns="http://www.w3.org/2000/svg" >
               <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
               <g id="SVGRepo_iconCarrier"> <g id="Group_64" data-name="Group 64" transform="translate(-624.082 -383.588)"> 
                <path id="Path_56"  data-name="Path 56" d="M660.313,383.588a1.5,1.5,0,0,1,1.06,2.561l-33.556,33.56a2.528,2.528,0,0,0,0,3.564l33.556,33.558a1.5,1.5,0,0,1-2.121,2.121L625.7,425.394a5.527,5.527,0,0,1,0-7.807l33.556-33.559A1.5,1.5,0,0,1,660.313,383.588Z" fill={dark?"#9CA3AF":"#4B5563"}></path>
               </g>
              </g>
            </svg> 
            </button>           
            <span className={`${dark ? "text-gray-400" : "text-gray-600"} text-sm transition-colors duration-500`}>{monthArr[monthIndex][0]}</span>
            <button onClick={()=>setMonthIndex(prev=>prev==11?0:prev+1)}>
            <svg className="h-7 w-7" viewBox="-19.04 0 75.804 75.804" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> 
              <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill={dark?"#9CA3AF":"#4B5563"}></path>
             </g> </g></svg>
            </button>
          </div>

          {/* Calendar UI (mock style) */}
          <div className="grid grid-cols-7 gap-y-4 text-center text-gray-300 text-sm">
  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
    <div key={monthArr[monthIndex][0] + `${d}` + `${i}`} className="font-semibold">{d}</div>
  ))}

  {[...Array(monthArr[monthIndex][1])].map((_, i) => (
    <div
      key={monthArr[monthIndex][0] + `${i}`}
      className={`relative group ${i === 0 ? `${monthArr[monthIndex][2].s} ${monthArr[monthIndex][2].e}` : ""}`}
    >
      <NavLink to={((i < new Date().getDate() && monthArr.indexOf(monthArr[monthIndex])==new Date().getMonth())|| monthArr.indexOf(monthArr[monthIndex])<new Date().getMonth())? `/prblm/${prblms[Math.floor(Math.random() * prblms.length)]?._id}` : ""}>
        <span
          className={`w-8 h-8 inline-flex items-center justify-center rounded-full relative transition-colors duration-500 ${dark ? "text-white" : "text-black"}
            ${(i === new Date().getDate()-1 && monthArr.indexOf(monthArr[monthIndex])==new Date().getMonth()) ? "bg-green-500" : ""}
          `}
        >
          {i + 1}
        </span>

        {/* Custom Tooltip (only for past or today) */}
        {((i < new Date().getDate() && monthArr.indexOf(monthArr[monthIndex])==new Date().getMonth())|| monthArr.indexOf(monthArr[monthIndex])<new Date().getMonth())&& (
          <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all z-10 
           ${dark ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
          >
            {prblms[i % prblms.length]?.title || "Daily Challenge"}
          </div>
        )}

        {/* Bottom Dot */}
        {((i < new Date().getDate()-1 && monthArr.indexOf(monthArr[monthIndex])==new Date().getMonth())|| monthArr.indexOf(monthArr[monthIndex])<new Date().getMonth()) && (
          <span className="w-2 h-2 bg-red-500 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-1"></span>
        )}
      </NavLink>
    </div>
  ))}
</div>


          <div className="text-xs text-gray-400 text-center mt-4">
            Keep solving every day!
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



  );
}

export default Homepage;