import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers, SquareStack } from "lucide-react";

export default function StackQueue() {
  const [activeTab, setActiveTab] = useState("stack");
  const [stack,setStack]=useState(new Array());
  const [queue,setQueue]=useState(new Array());
  const [isVisible,setIsVisible]=useState(false);
  const [enter,setEnter]=useState("");

  const tabs = [
    { id: "stack", label: "Stack", icon: SquareStack, gradient: "from-[#a78bfa] to-[#f472b6]" },
    { id: "queue", label: "Queue", icon: Layers, gradient: "from-[#60a5fa] to-[#22d3ee]" },
  ];

  const handlePeek=()=>{
    setIsVisible(true);
    setTimeout(()=>setIsVisible(false),3000);
    
  }

  console.log(isVisible);
  return (
<div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center p-10">
  {/* Tabs */}
  <div className="flex space-x-6 mb-10">
    {tabs.map(({ id, label, icon: Icon, gradient }) => (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r ${gradient} shadow-md shadow-black/40 transition-all duration-300 hover:scale-105 ${
          activeTab === id ? "ring-2 ring-offset-2 ring-white" : ""
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-semibold text-lg">{label}</span>
      </button>
    ))}
  </div>

  {/* Main Content */}
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full h-[70vh] max-w-5xl bg-[#2c2c2c] rounded-2xl shadow-lg p-8 flex flex-col items-center"
  >
    <h2 className="text-2xl font-bold mb-6">
      {activeTab === "stack" ? "Stack Representation" : "Queue Representation"}
    </h2>

    {/* Representation area */}
    <div className="relative flex justify-between items-start h-full w-full border-2 border-dashed border-gray-600 rounded-lg p-6">
      {/* Left - Stack visualization */}
      <div className="flex flex-col justify-end items-center flex-1">
        <div className="relative flex flex-col-reverse items-center gap-4 h-full w-full max-w-xs">
          {/* <div className="absolute -top-5 text-white font-bold text-lg">Top</div> */}
          
          <AnimatePresence>
          {activeTab=="stack"?
          (
          <div className="mt-12 mx-auto top-[20px] h-60 w-50 border-2 border-t-0 flex flex-col-reverse rounded-b-2xl">
          {stack?.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.05 }}
              className="w-[90%] h-10 bg-gradient-to-t mx-auto my-1 from-pink-500 to-purple-500 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold text-xl"
            >
              {item}
            </motion.div>
          ))}
          </div>
          )
          :
          (
           <div className="mt-12 my-auto top-[20px] h-20 border-2  flex max-w-90 rounded-2xl">
            {queue?.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.05 }}
              className="w-20 h-[90%] bg-gradient-to-t m-2 my-1 from-pink-500 to-purple-500 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold text-xl"
            >
              {item}
            </motion.div>
          ))}
           </div>
          )
        }
          </AnimatePresence>
        </div>
      </div>

      {/* Right - Controls & Info */}
      {/* {activeTab === "stack" && ( */}
        <div className="flex flex-col space-y-4 w-1/3 pl-8">
          {/* Input bar */}
          <motion.input
            type="text"
            placeholder="Enter value"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.01 }}
            value={enter}
            onChange={(e)=>setEnter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* Reset button */}
          <motion.button 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ delay:  0.02 }} 
          className="px-5 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg font-semibold shadow-md hover:scale-105 transition-all"
          onClick={()=> activeTab=="stack"?setStack([]):setQueue([])}
          >
            Reset
          </motion.button>

          {/* Info */}
          <div className="mt-4 space-y-2 text-gray-300 text-sm font-medium">
            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay:  0.03 }}>
              {
              activeTab=="stack"?"Top of Stack ":"Front of Queue "}
              : {
               activeTab=="stack"
               ?(<motion.span className="text-white font-bold  ml-1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay:  0.03 }}>{stack.length==0?"__":stack[stack.length-1]}</motion.span>)
               :(<motion.span className="text-white font-bold  ml-1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay:  0.03 }}>{queue.length==0?"__":queue[0]}</motion.span>)
               }
            </motion.p>
            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay:  0.04 }}>Size: <motion.span className="text-white font-bold ml-1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay:  0.04 }}>{activeTab=="stack"?stack.length:queue.length}</motion.span></motion.p>
          </div>

          <div className="flex w-full justify-around mt-5">
          {activeTab === "stack"
            ? ["Peek", "Push", "Pop"].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-12 bg-gradient-to-t from-pink-500 to-purple-500 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold"
                  onClick={()=>{
                    if(item=="Push"){
                    setStack(prev=>{
                      const newPrev=[...prev,enter];
                      setEnter("");
                      return newPrev;
                    })
                  }
                  else if(item=="Pop")
                  {
                    setStack(prev=>{
                      const newPrev=[...prev].filter((val,i)=> i!=prev.length-1);
                      return newPrev;
                    })
                  }
                  else
                  {
                     handlePeek();
                  }
                }}
                >
                  {item}
                </motion.div>
              ))
            : ["Enqueue", "Dequeue", "Front"].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-20 h-12 bg-gradient-to-t from-blue-500 to-teal-400 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold"
                  onClick={()=>{
                    if(item=="Enqueue"){
                    setQueue(prev=>{
                      const newPrev=[...prev,enter];
                      setEnter("");
                      return newPrev;
                    })
                  }
                  else if(item=="Dequeue")
                  {
                    setQueue(prev=>{
                      const newPrev=[...prev].filter((val,i)=> i!=0);
                      return newPrev;
                    })
                  }
                  else
                  {
                     handlePeek();
                  }
                }}
                >
                  {item}
                </motion.div>
              ))}
              </div>

              <motion.div 
              className={"block"}
              initial={{ scale: 1 }}
              animate={{ scale: isVisible ? 1:0 }}
              transition={{ delay:  0.1 }} 
              >
               {activeTab=="stack"?stack.length==0?"No elements present in stack":`Top element is ${stack[stack.length-1]}`:queue.length==0?"No elements present in queue":`Front element is ${queue[0]}`}
              </motion.div>
        </div>
      
    </div>
  </motion.div>
</div>

  );
}
