import { useState , useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown01, Shuffle, ListOrdered } from "lucide-react";

const randomArray=[
   [84, 48, 96, 72, 60, 68, 56, 64, 52, 88, 76, 40],
   [88, 40, 68, 60, 84, 52, 96, 64, 76, 72, 48, 56],
   [60, 88, 52, 76, 72, 48, 84, 56, 40, 96, 68, 64],
   [72, 84, 48, 64, 52, 68, 76, 60, 88, 96, 40, 56],
   [56, 88, 72, 48, 96, 68, 84, 60, 40, 52, 76, 64]
];

export default function SortingPage() {
  const [activeTab, setActiveTab] = useState("selection");
  const [heights, setHeights] = useState([40, 72, 56, 96, 60, 84, 48, 68, 52, 88, 64, 76]);
  const [on,setOn]=useState(false);
  const [i, setI] = useState(null);
  const [j, setJ] = useState(null);
  const [index, setIndex] = useState(-1);
  const [size,setSize]=useState(`w-15`);
  const [speed,setSpeed]=useState(1);

  const tabs = [
    { id: "selection", label: "Selection Sort", icon: ArrowDown01, gradient: "from-[#a78bfa] to-[#f472b6]" },
    { id: "bubble", label: "Bubble Sort", icon: Shuffle, gradient: "from-[#a78bfa] to-[#f472b6]" },
    { id: "insertion", label: "Insertion Sort", icon: ListOrdered, gradient: "from-[#a78bfa] to-[#f472b6]" },
  ];

    useEffect(() => {
    if(activeTab=="selection")
    {
    
      if (i < heights.length && i != null) {
        if (j < heights.length && j!=null) {
          if (heights[j] < heights[index]){ setTimeout(() => setIndex(j), speed*1000)};
          setTimeout(() => setJ((prev) => prev + 1), speed*1000);
        } else {
          setTimeout(() => setHeights((arr) => {
            const newArr = [...arr];
            [newArr[i], newArr[index]] = [newArr[index], newArr[i]];
            return newArr;
          }), speed*1000);
          const newI = i + 1;
          setTimeout(() => setJ(newI + 1), speed*1000);
          setTimeout(() =>setI((prev) => prev + 1), speed*1000);
          setTimeout(() => setIndex(newI), speed*1000);
        }
      } 
      else{
        setJ(null);
        setI(null);
        setIndex(null);
        setOn(false);
      } 
    
   }
   else if(activeTab=="bubble")
   {
     
      if (i >=0 && i != null) {
        if (j <=i && j != null) {
          if (heights[j] > heights[j+1]){ 
            setTimeout(() => setHeights((arr) => {
            const newArr = [...arr];
            [newArr[j], newArr[j+1]] = [newArr[j+1], newArr[j]];
            return newArr;
            }), speed*1000);
          };
          setTimeout(() => setJ((prev) => prev + 1), speed*1000);
        } else {
          setTimeout(() => setJ(0), speed*1000);
          setTimeout(() =>setI((prev) => prev - 1), speed*1000);
        }
      } 
      else{
        setJ(null);
        setI(null);
        setOn(false);
      } 
    
   }
   else
   {
    if (i < heights.length && i != null) {
        if (j >=0 && j != null) {
          if (heights[j] < heights[j-1]){ 
            setTimeout(() => setHeights((arr) => {
            const newArr = [...arr];
            [newArr[j-1], newArr[j]] = [newArr[j], newArr[j-1]];
            return newArr;
            }), speed*500);
          };
          setTimeout(() => setJ((prev) => prev - 1), speed*500);
        } else {
          setTimeout(() => setJ(i+1), speed*500);
          setTimeout(() =>setI((prev) => prev + 1), speed*500);
        }
      } 
      else{
        setJ(null);
        setI(null);
        setOn(false);
      } 
   }
  }, [i, j]);

  console.log(speed);
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold">Sorting Algorithms</h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="h-1 bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#34d399] w-40 mx-auto mt-2 origin-left rounded-full"
        />
        <p className="text-gray-400 mt-3">Visualize Selection, Bubble, and Insertion sorts with slick animations.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 md:gap-6 mb-8">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <motion.button
              key={t.id}
              onClick={() => {(!on)?setActiveTab(t.id):alert("You cannot switch tabs will the array is getting sorted")}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full font-medium transition-colors duration-200 shadow-md border border-white/10 ${
                active ? `bg-gradient-to-r ${t.gradient} text-black` : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Icon className={active ? "text-black" : "text-gray-300"} size={18} />
              <span className="text-sm md:text-base">{t.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Visualizer Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="max-w-5xl mx-auto bg-gray-800/60 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10"
        >
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-xs">
            <LegendChip label="Comparing" className="ring-2 ring-yellow-400 bg-yellow-500/20" />
            <LegendChip label="Selected / Key" className="ring-2 ring-pink-400 bg-pink-500/20" />
            <LegendChip label="Swap" className="ring-2 ring-sky-400 bg-sky-500/20" />
            <LegendChip label="Sorted" className="ring-2 ring-emerald-400 bg-emerald-500/20" />
          </div>

          {/* Bars Area */}
          <BarsStage activeTab={activeTab} heights={heights}size={size} index={index} j={j} i={i}/>

          {/* Controls */}
          <ControlsRow activeTab={activeTab} setI={setI} setJ={setJ} setIndex={setIndex} size={size} setSize={setSize} setHeights={setHeights} setSpeed={setSpeed} speed={speed} on={on} setOn={setOn}/>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---------- Subcomponents ----------

function LegendChip({ label, className = "" }) {
  return (
    <div className={`px-3 py-1 rounded-full text-white/90 ${className}`}>{label}</div>
  );
}

function BarsStage({ activeTab,heights,index,size,j,i}) {
   
  return (
    <div className="mb-6">
      <div className="relative h-64 w-full max-w-4xl mx-auto flex items-end justify-between gap-2 px-3 md:px-6">
        {heights.map((h, idx) => (
          <motion.div
            key={idx}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            className={activeTab=="selection"?`${
                   (idx<i && i!=null)
                   ? `${size} rounded-t-lg bg-gradient-to-t from-[#34d399] to-[#86efac] shadow-lg ring-emerald-300 ring-2`
                   : (idx==i && i!=null)?`${size} rounded-t-lg bg-gradient-to-t from-[#60a5fa] to-[#22d3ee] shadow-lg ring-sky-300 ring-2`
                   :((idx === index || idx === j)&& j!=null)
                   ?"w-6 mx-1 rounded-md bg-yellow-400 scale-110 transition-all duration-300 shadow-lg shadow-yellow-500/50"
                   :`${size} rounded-t-lg bg-gradient-to-t from-[#a78bfa] to-[#f472b6] shadow-lg ring-pink-300 ring-2`
               }`:
               activeTab=="bubble"
               ?`${
                   (idx>i && i!=null)
                   ? `${size} rounded-t-lg bg-gradient-to-t from-[#34d399] to-[#86efac] shadow-lg ring-emerald-300 ring-2`
                   :((idx === j+1 || idx === j)&& j!=null)
                   ?"w-6 mx-1 rounded-md bg-yellow-400 scale-110 transition-all duration-300 shadow-lg shadow-yellow-500/50"
                   :`${size} rounded-t-lg bg-gradient-to-t from-[#a78bfa] to-[#f472b6] shadow-lg ring-pink-300 ring-2`
                  }`
               :`${
                   (idx<i && i!=null)
                   ? `${size} rounded-t-lg bg-gradient-to-t from-[#34d399] to-[#86efac] shadow-lg ring-emerald-300 ring-2`
                   :((idx === j-1 || idx === j)&& j!=null)
                   ?"w-6 mx-1 rounded-md bg-yellow-400 scale-110 transition-all duration-300 shadow-lg shadow-yellow-500/50"
                   :`${size} rounded-t-lg bg-gradient-to-t from-[#a78bfa] to-[#f472b6] shadow-lg ring-pink-300 ring-2`
               }`
              }
             style={{ height: `${h * 2}px`}}
          >
            {/* Optional bar label */}
            <div className="text-[10px] md:text-xs text-white/80 text-center translate-y-[-18px] select-none">{h}</div>
          </motion.div>
        ))}
        {/* Subtle floor line */}
        <div className="absolute inset-x-3 md:inset-x-6 bottom-0 h-[2px] bg-white/10" />
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.2 }}
        className="h-1 mt-5 bg-gradient-to-r from-white/10 via-white/30 to-white/10 rounded-full"
      />
    </div>
  );
}

function ControlsRow({activeTab,setI,setJ,setIndex,setSize,setSpeed,on,setOn,setHeights}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-2">
      {/* Array Size (UI only) */}
      <LabeledGroup label="Size">
        <input type="range" min="5" max="15"  className="accent-white/80"  defaultValue={15} onChange={(e)=>setSize(`w-${e.target.value}`)} />
      </LabeledGroup>

      {/* Speed */}
      <LabeledGroup label="Speed">
        <input type="range" min="1" max="5"  className="accent-white/80" defaultValue={3} onChange={(e)=>setSpeed(6-parseInt(e.target.value))}/>
      </LabeledGroup>

      {/* Buttons (no logic wired) */}
      <Btn 
      gradient="from-green-400 to-green-600"
      disabled={on}
       onClick={() => {
            if(activeTab=="selection")
            {
             setI(0);
             setJ(1);
             setIndex(0);
             setOn(true);
            }else if(activeTab=="bubble")
            {
             setOn(true);
             setI(10);
             setJ(0);
            }
            else
            {
             setOn(true);
             setI(1);
             setJ(1);
            }
           }}
      >Start</Btn>
      <Btn gradient="from-rose-400 to-rose-600" onClick={() => {setIndex(-1);setI(()=>null);setJ(()=>null);setOn(false);setHeights(()=>[40, 72, 56, 96, 60, 84, 48, 68, 52, 88, 64, 76])}}>Reset</Btn>
      <Btn gradient="from-amber-400 to-orange-500" onClick={()=>setHeights(()=>{
        const number =Math.floor(Math.random()*5);
        return randomArray[number];
      })}
      disabled={on}
      >Shuffle</Btn>
    </div>
  );
}

function LabeledGroup({ label, children }) {
  return (
    <div className="flex items-center gap-2 bg-gray-900/60 border border-white/10 px-3 py-2 rounded-xl">
      <span className="text-xs text-gray-300">{label}:</span>
      {children}
    </div>
  );
}

function Btn({ children, gradient ,onClick,disabled}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      className={`px-5 py-2 rounded-full font-medium shadow-md bg-gradient-to-r ${gradient} text-black hover:opacity-90`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
