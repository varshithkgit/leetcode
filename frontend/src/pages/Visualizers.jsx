import { motion } from "framer-motion";
import { Search, SortAsc, Layers } from "lucide-react";
import Header from "../componants/Header";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";

function Visualizers(){
    const categories = [
    {
      title: "Searching Algorithms",
      desc: "Visualize Linear & Binary Search step-by-step.",
      icon: <Search size={100} />,
      link: "/visualizers/SearchAlgo",
      gradient: "from-[#FF7E5F] to-[#FEB47B]",
    },
    {
      title: "Sorting Algorithms",
      desc: "See Selection, Insertion, and Bubble Sort in action.",
      icon: <SortAsc size={100} />,
      link: "/visualizers/sorting",
      gradient: "from-[#6A11CB] to-[#2575FC]",
    },
    {
      title: "Simple Data Structures",
      desc: "Understand Stack & Queue visually.",
      icon: <Layers size={100} />,
      link: "/visualizers/datastructures",
      gradient: "from-[#11998E] to-[#38EF7D]",
    }
  ];

  const {dark}=useSelector(state=>state.slice);

     return(
        <>
        <Header></Header>
    <div className={`min-h-screen ${dark?"bg-[#0f172a] text-white":"bg-gray-50 text-black"} px-6 py-10`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold">DSA Visualizer</h1>
        <p className="text-gray-400 mt-2">
          See algorithms come to life with animations & smooth transitions
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((cat, index) => (
        <NavLink key={index} to={cat.link}>
          <motion.div
            href={cat.link}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${cat.gradient} cursor-pointer transform transition duration-300`}
          >
            <div className="mb-4">{cat.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{cat.title}</h2>
            <p className="text-sm opacity-80">{cat.desc}</p>
          </motion.div>
        </NavLink>
        ))}
      </div>
    </div>
        </>
     )
}

export default Visualizers;