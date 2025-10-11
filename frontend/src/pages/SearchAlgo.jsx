import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const array=[10, 23, 45, 7, 89, 12, 56, 78];
const arraySort=[7,10,12,23,45,56,78,89];
function SearchAlgo(){
  const [activeTab, setActiveTab] = useState("linear");
  const [speed,setSpeed]=useState(1000);
  const [pointer,setPointer]=useState(-1);
  const [mid,setMid]=useState(null);
  const [start,setStart]=useState(0);
  const [end,setEnd]=useState(7);
  const [target,setTarget]=useState(null);
  const tabs = [
    { id: "linear", label: "Linear Search" },
    { id: "binary", label: "Binary Search" },
  ];

    useEffect(()=>{
       if(pointer!=-1){
        if(pointer<=6)
        {
          if(array[pointer]==target) setTimeout(()=>setPointer(-1),2000);
          else setTimeout(()=>setPointer(prev=>prev+1),speed);

        }
        else setTimeout(()=>setPointer(-1),2000);
       }
    },[pointer]);

    useEffect(()=>{
      if(start<=end)
      {
        if(arraySort[mid]>target) 
        {
          const newEnd=mid-1;
          setTimeout(()=>setEnd(newEnd),2000);
          setTimeout(()=>setMid(Math.floor((start+newEnd)/2)),5000);
        }
       else if(arraySort[mid]<target) 
        {
           const newStart=mid+1;
           setTimeout(()=>setStart(newStart),2000);
           setTimeout(()=>setMid(Math.floor((newStart+end)/2)),5000);
        }
      } 
    },[mid]);

    
    return( 
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold">Searching Algorithms</h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] w-32 mx-auto mt-2 origin-left"
        ></motion.div>
        <p className="text-gray-400 mt-3">
          Visualize how Linear Search and Binary Search work step-by-step.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-10">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-black shadow-lg"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Visualizer Section */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-xl"
      >
        {/* Placeholder Array */}
        <div className="flex justify-center gap-4 mb-8">
          {
          activeTab=="linear"?
          array.map((num, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`w-14 h-14 flex items-center justify-center rounded-lg bg-gradient-to-br shadow-lg 
                ${idx==pointer?
                    (
                        num!=target?"from-yellow-400 to-yellow-600 text-black font-bold ring-4 ring-yellow-300 transition-all duration-300"
                        :"from-green-400 to-green-600 text-black font-bold ring-4 ring-green-300 transition-all duration-300 animate-pulse"
                    )
                        :"from-[#6A11CB] to-[#2575FC] text-white font-semibold"
                }`}
            >
              {num}
            </motion.div>
          ))
          :
          arraySort.map((num, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`w-14 h-14 flex items-center justify-center rounded-lg bg-gradient-to-br shadow-lg 
               ${(idx==start||idx==end)?
                (
                 (num==target && idx==mid)? "from-green-400 to-green-600 text-black font-bold ring-4 ring-green-300 transition-all duration-300 animate-pulse"
                 :"from-yellow-400 to-yellow-600 text-black font-bold ring-4 ring-yellow-300 transition-all duration-300"
                 )
                :
                (idx==mid)?
                 (
                 (num!=target)?"from-red-400 to-red-600 text-black font-bold ring-4 ring-red-300 transition-all duration-300"
                 :"from-green-400 to-green-600 text-black font-bold ring-4 ring-green-300 transition-all duration-300 animate-pulse"
                 )
                :"from-[#6A11CB] to-[#2575FC] text-white font-semibold"
               }`}
            >
              {num}
            </motion.div>
          ))
          }
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {/* Target Input */}
          <motion.input
            type="number"
            placeholder="Target"
            value={target==null?"":target}
            onChange={(e)=>setTarget(e.target.value)}
            whileFocus={{ scale: 1.05 }}
            className="w-32 px-3 py-2 rounded-lg bg-gray-700 text-white 
                       focus:outline-none focus:ring-2 focus:ring-[#FF7E5F] 
                       transition-all duration-200"
          />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={()=>{activeTab=="linear"?setPointer(0):setMid(Math.floor((start+end)/2))}}
            className="px-5 py-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full font-medium shadow-md hover:opacity-90"
          >
            Start
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="px-5 py-2 bg-gradient-to-r from-red-400 to-red-600 rounded-full font-medium shadow-md hover:opacity-90"
            onClick={()=> {if(activeTab=="linear"){setTarget(null); setPointer(-1);setSpeed(1000);}else{setEnd(7);setStart(0);setMid(null);setTarget(null)}}}
          >
            Reset
          </motion.button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Speed:</span>
            <input
              type="range"
              min="1"
              max="5"
              defaultValue={speed-1000}
              onChange={(e)=>{setSpeed((6-parseInt(e.target.value))*1000)}}
              className="accent-[#FF7E5F]"
            />
          </div>
        </div>
      </motion.div>
    </div>

    )
}

export default SearchAlgo;