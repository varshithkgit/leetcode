import { NavLink } from "react-router";
import Header from "../componants/Header";
import { useSelector } from "react-redux";

function Contest() {
  const {dark}=useSelector(state=>state.slice);

  return (
    <>
    <Header></Header>
    <div className={`min-h-screen py-10 transition-colors duration-300 ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="flex flex-col items-center justify-center text-center mb-12 px-4">
        <h1 className={`text-3xl font-bold transition-colors duration-300 ${dark ? "text-white" : "text-[#273F4F]"}`}>LeetCode <span className={`transition-colors duration-300 ${dark ? "text-[#FE7743]" : "text-[#8E1616]"}`}>Contest</span></h1>
        <p className={`mt-2 transition-colors duration-300 ${dark ? "text-gray-400" : "text-gray-600"}`}>Contest every week. Compete and see your ranking!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-4xl mx-auto">
        <NavLink to="/sorry">
        <div className={`card transition-all duration-300 rounded-2xl overflow-hidden ${dark ? "bg-gray-800 shadow-lg hover:shadow-xl" : " bg-[#EFEEEA] shadow-md hover:shadow-lg"}`}>
          <figure className="relative">
            <img src="https://assets.leetcode.com/contest-config/contest/wc_card_img.png" alt="Weekly Contest" className="w-full h-50 object-cover" />
            <div className={`absolute bottom-2 left-2 text-sm transition-colors duration-300 ${dark ? "text-white" : "text-black"}`}>
              <span className={`px-2 py-1 rounded transition-all duration-300 ${dark ? "bg-black bg-opacity-50 text-white" : "bg-[#F8EEDF] text-black"}`}>
                ⏱ Starts in 12d 3h 19m 32s
              </span>
            </div>
          </figure>
          <div className="card-body">
            <h2 className={`font-semibold text-lg transition-colors duration-300 ${dark ? "text-gray-400" : "text-gray-600"}`}>Weekly Contest 454</h2>
            <p className={`text-sm transition-colors duration-300 ${dark ? "text-gray-400" : "text-gray-600"}`}>Sunday 8:00 AM GMT+5:30</p>
          </div>
        </div>
        </NavLink>

       <NavLink to="/sorry">
        <div className={`card transition-all duration-300 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl ${
                        dark ? "bg-gray-800" : "bg-[#EFEEEA]"}`}
        >
          <figure className="relative">
            <img src="https://assets.leetcode.com/contest-config/contest/bc_card_img.png" alt="Biweekly Contest" className="w-full h-50 object-cover " />
            <div className={`absolute bottom-2 left-2 text-sm transition-colors duration-300 ${
                  dark ? "text-white" : "text-black"}`}
            >
              <span className={`px-2 py-1 rounded transition-all duration-300 ${dark ? "bg-black bg-opacity-50 text-white" : "bg-[#F8EEDF] shadow-md hover:shadow-lg text-black"}`}>
                ⏱ Starts in 12d 3h 19m 32s
              </span>
            </div>
          </figure>
          <div className="card-body">
            <h2 className={`font-semibold text-lg transition-colors duration-300 ${dark ? "text-gray-400" : "text-gray-700"}`}>Biweekly Contest 159</h2>
            <p className="text-sm text-gray-500">Saturday 8:00 PM GMT+5:30</p>
          </div>
        </div>
        </NavLink>
      </div>
    </div>
  </>
  );
}

export default Contest;