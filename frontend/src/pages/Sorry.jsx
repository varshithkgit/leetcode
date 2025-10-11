import { NavLink } from "react-router";

function Sorry() {
  return (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-xl p-10 text-center animate-jump-in">
        {/* Icon */}
        <div className="text-6xl mb-4 animate-bounce">😅</div>

        {/* Main Message */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-pink-500">
          Oops! Feature Not Available
        </h1>

        {/* Sub Text */}
        <p className="text-gray-300 mt-3">
          This section is still under construction. Please check back later!
        </p>

        {/* Back/Home Button */}
        <NavLink to={"/contest"} className="mt-6 btn btn-primary bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-all">
          Go Back
        </NavLink>
      </div>
    </div>
  );
}

export default Sorry;
