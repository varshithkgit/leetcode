import { NavLink } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setDark } from "../slice";

function Header() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { profile, dark } = useSelector(state => state.slice);

  return (
    <nav
      className={`navbar px-6 py-3 transition-colors duration-500 ease-in-out ${
        dark ? "bg-gray-800 shadow-lg" : "bg-white shadow-md"
      }`}
    >
      <div className="flex-1">
        <NavLink
          to="/"
          className={`btn btn-ghost normal-case text-2xl font-bold transition-colors duration-500 ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          LeetCode
        </NavLink>
        {["/explore", "/", "/contest", "/discuss","/visualizers"].map((path, i) => (
          <NavLink
            key={i}
            to={path}
            className={`btn btn-ghost normal-case text-md transition-colors duration-500 ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            {path === "/" ? "Problems" :(path!="/discuss"? path.slice(1).charAt(0).toUpperCase() + path.slice(2):(path=="/visualizers"?"Visualizers":"Discussions"))}
          </NavLink>
        ))}
      </div>

      <div
        className={`mr-2 h-8 w-8 p-1 rounded-sm cursor-pointer ${dark?"border-white border-[1.5px]":"border-[1.5px]"}`}
        onClick={() => dispatch(setDark())}
      >
        {dark ? (
          <svg
            fill="#ffffff"
            width="256px"
            height="256px"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            {/* sun icon */}
            <g>
              <defs>
                <style>{`.cls-1 { fill: none; }`}</style>
              </defs>
              <title>sunny</title>
              <path d="M16,12a4,4,0,1,1-4,4,4.0045,4.0045,0,0,1,4-4m0-2a6,6,0,1,0,6,6,6,6,0,0,0-6-6Z" />
              <rect x="6.85" y="5.37" width="2" height="4.96" transform="rotate(-45 7.85 7.85)" />
              <rect x="2" y="15" width="5" height="2" />
              <rect x="5.37" y="23.15" width="4.96" height="2" transform="rotate(-45 7.85 24.15)" />
              <rect x="15" y="25" width="2" height="5" />
              <rect x="23.15" y="21.67" width="2" height="4.96" transform="rotate(-45 24.15 23.67)" />
              <rect x="25" y="15" width="5" height="2" />
              <rect x="21.67" y="6.85" width="4.96" height="2" transform="rotate(-45 23.67 7.85)" />
              <rect x="15" y="2" width="2" height="5" />
              <rect className="cls-1" width="32" height="32" />
            </g>
          </svg>
        ) : (
          <svg
            fill="#000000"
            height="200px"
            width="200px"
            version="1.1"
            viewBox="0 0 472.618 472.618"
            xmlns="http://www.w3.org/2000/svg"
            className="h-[90%] w-[90%]"
          >
            {/* moon icon */}
            <g>
              <path d="M380.525,337.291c-135.427,0-245.302-109.773-245.302-245.302c0-32.502,6.338-63.575,17.991-91.988
              C63.372,36.286,0,124.39,0,227.315c0,135.427,109.875,245.302,245.302,245.302c102.923,0,191.029-63.472,227.316-153.315
              C444.201,330.954,413.129,337.291,380.525,337.291z" />
            </g>
          </svg>
        )}
      </div>

      <div className="flex-none">
        <NavLink
          to="/profile"
          className={`btn btn-ghost font-medium transition-colors duration-500 ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          <img
            src={
              profile?.secureUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/500px-Unknown_person.jpg"
            }
            className="h-7 w-7 object-cover rounded-full mt-1"
          />
          {user?.firstname}
        </NavLink>
      </div>
    </nav>
  );
}

export default Header;
