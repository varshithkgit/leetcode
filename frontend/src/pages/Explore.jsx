import Header from "../componants/Header";
import { useSelector } from "react-redux";

const exploreModules = [
  { title: "Data Structures and Algorithms", description: "Arrays, Linked Lists, Trees Sorting, Searching, Dynamic Programming",
    arr:[{title:"DSA by Rohit Negi",label:"Detailed Explanation of",chapter:164,lnk:"https://assets.leetcode.com/explore/cards/leetcodes-interview-crash-course-data-structures-and-algorithms/img-1663091244.png",ref:"https://www.youtube.com/watch?v=y3OOaXrFy-Q&list=PLQEaRBV9gAFu4ovJ41PywklqI7IyXwr01" },
      {title:"DSA by Striver",label:"LeetCode's Interview Crash Course",chapter:316,lnk:"https://assets.leetcode.com/explore/cards/cheatsheets/img-1674082113.png",ref:"https://www.youtube.com/watch?v=0bHoB32fuj0&list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz"},
      {title:"DSA by Love Babber",label:"LeetCode's Interview Crash Course",chapter:140,lnk:"https://assets.leetcode.com/explore/cards/google/img",ref:"https://www.youtube.com/watch?v=WQoB2z67hvY&list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA"}]},
  { title: "DSA Sheet", description: "Top Interview Questions" , 
    arr:[{title:"Striver A2Z DSA Sheet",label:"The LeetCode Beginner's Guide",chapter:400,lnk:"https://assets.leetcode.com/explore/cards/introduction-to-the-beginners-guide/img-1652222288.png",ref:"https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"},
      {title:"Love Babber DSA Sheet",label:"The LeetCode Beginner's Guide",chapter:450,lnk:"https://assets.leetcode.com/explore/cards/dynamic-programming/img.png",ref:'https://www.youtube.com/watch?v=4iFALQ1ACdA'},
      {title:"Rohit Negi DSA Sheet",label:"The LeetCode Beginner's Guide",chapter:800,lnk:"https://assets.leetcode.com/explore/cards/top-151-interview-questions/img",ref:"https://www.youtube.com/watch?v=IjmXtj40k10"}]},
  { title: "Language Skills", description: "Learn Python, Javascript, C++" , 
    arr:[{title:"CWH Python Series",label:"Easy Collection",chapter:100,lnk:"https://assets.leetcode.com/explore/cards/sql-language/img-1657328656.png",ref:"https://www.youtube.com/watch?v=7wnove7K-ZQ&list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg"},
      {title:"Js By Apna College",label:"Easy Collection",chapter:16,lnk:"https://assets.leetcode.com/explore/cards/graph/img.png",ref:"https://www.youtube.com/watch?v=VlPiVmYuoqw"},
      {title:"C++ by College Wallah",label:"Easy Collection",chapter:1,lnk:"https://assets.leetcode.com/explore/cards/heap/img.png",ref:"https://www.youtube.com/watch?v=e7sAf4SbS_g"}]},
  { title: "Gen AI", description: "Vectoer Database, prompting and llm" , 
    arr:[{title:"GenAI By Rohit Negi",chapter:13,label:"Detailed Explanation of",lnk:"https://assets.leetcode.com/explore/cards/bit-manipulation-and-math/img-1648770297.png",ref:"https://www.youtube.com/watch?v=WOyZid8OkkI"}]},
  { title: "System Design", description: "Scalability, Architecture" , 
    arr:[{title:"System Design By Guruji",chapter:30,label:"Detailed Explanation of",lnk:"https://assets.leetcode.com/explore/cards/sorting/img-1658261025.png",ref:"https://www.youtube.com/watch?v=AK0hu0Zxua4&list=PLQEaRBV9gAFvzp6XhcNFpk1WdOcyVo9qT"}]},
];


function Explore() {
  const {dark}=useSelector(state=>state.slice);
  
  return (
<> 
  <Header />
  <div className={`min-h-screen px-6 py-10 space-y-16 transition-colors duration-500 ${dark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
    <h1 className={`text-4xl font-bold text-center mb-10 transition-colors duration-500 ${dark ? "text-white" : "text-black"}`}>
      Explore: Free Resources
    </h1>

    {exploreModules.map((module, idx) => (
      <section
        key={idx}
        className={`rounded-2xl shadow-lg p-8 space-y-6 transition-colors duration-500 ${dark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"}`}
      >
        <div className="space-y-2">
          <h2 className={`text-3xl font-semibold transition-colors duration-500 ${dark ? "text-[#EFEEEA]" : "text-[#273F4F]"}`}>
            {module.title}
          </h2>
          <p className="text-gray-400 text-lg">{module.description}</p>
        </div>

        <div className={`w-full h-fit rounded-xl flex items-center justify-start overflow-x-auto gap-8 p-6 border transition-colors duration-500 ${
                        dark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"}`}>
          {module.arr.map(({lnk,ref,title,label,chapter}, index) => (
            <a href={ref} target="_blank" key={"m"+index}>
            <div
            className={`w-[280px] min-w-[280px] h-[300px] rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${
                       dark ? "bg-gray-700" : "bg-[#F8EEDF]"}`}>
  {/* Image Section with Label and Title on top */}
  <div className="h-[70%] relative">
    <img className="h-full w-full object-cover" src={lnk} />

    {/* Overlay text container */}
    <div className="absolute top-3 left-3 z-10">
      <p className={`text-xl bg-transparent bg-opacity-40 px-2 py-0.5 rounded transition-colors duration-500 ${
                    dark ? "text-white" : "text-black"}`}
      >
        {label || "Course Label"}
      </p>
      <h2 className={`text-4xl font-bold bg-transparent bg-opacity-40 px-2 py-1 mt-1 rounded transition-colors duration-500 ${
                     dark ? "text-white" : "text-black"}`}
      >
        {title}
      </h2>
    </div>
  </div>

  {/* Play button */}
  <button className={`absolute bottom-[60px] right-3.5 w-15 h-15 rounded-full flex items-center justify-center shadow hover:scale-110 transition border-4 ${
  dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
}`}
>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-white"
      viewBox="0 0 16 16"
      fill={dark?"white":"black"}
    >
      <path d="M6.271 11.134V4.866L11.314 8l-5.043 3.134z" />
    </svg>
  </button>

  {/* Bottom Info Section */}
  <div className={`px-4 py-3 text-sm flex flex-col justify-center items-center h-[30%] transition-colors duration-300 ${dark ? "bg-gray-900 text-white" : "bg-[#F8F8F8] text-black"}`}>
    <div className={`w-[60%] h-[50%] mb-1 flex justify-between font-bold text-3xl transition-colors duration-300 ${dark ? "text-white" : "text-black"}`}
     >
      <p>{chapter || 0}</p>
      <p className="mr-2">{Math.floor(Math.random()*5) || 0}</p>
    </div>
    <div className={`w-[60%] h-[50%] flex justify-between text-sm transition-colors duration-300 ${dark ? "text-gray-300" : "text-gray-700"}`}>
      <p>Chapters</p>
      <p>Items</p>
    </div>
  </div>
</div>
</a>
          ))}
        </div>
      </section>
    ))}
  </div>
</>


  );
}

export default Explore;