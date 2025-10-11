import React, { useEffect, useRef } from "react";
import BodyOfNote from "./BodyOfNote";
import axiosClient from "../utils/axiosClient";
import { setNotes } from "../slice";
import { useSelector, useDispatch } from "react-redux";  //nc ic lp

function Notes({ id }) {
  const { notes } = useSelector((state) => state.slice);
  const dispatch = useDispatch();
  const { dark } = useSelector((state) => state.slice);
  const noteRefs = useRef([]);

  useEffect(() => {
    const getNotes = async () => {
      try {
        const { data } = await axiosClient.get(`/prblm/getNotes/${id}`);
        dispatch(setNotes(data?.note || data));

        noteRefs.current = (data?.note || new Array()).map(
          (_, i) => noteRefs.current[i] || React.createRef()
        );
      } catch (e) {
        console.log(e);
        alert("Error: " + e);
      }
    };

    getNotes();
  }, [id, dispatch]);

  const handleScrollTo = (index) => {
    noteRefs.current[index]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  
  const handleAdd = async () => {
    const dup = [...notes, { title: "", body: "" }];

    try {
      const {data}=await axiosClient.post("/prblm/createNote", { prblmId: id, array: dup });
      noteRefs.current.push(React.createRef());
      dispatch(setNotes(data));
    } catch (e) {
      alert("Not able to save changes in database" + e);
      return;
    }
    
  };

  const handleRemove = async (index) => {
    const dup = [...notes];
    dup.splice(index, 1);
    
    try {
      await axiosClient.delete(`/prblm/removeNote/${id}?index=${index}`);
    } catch (e) {
      alert("Not able to remove note in database" + e);
      return;
    }

    noteRefs.current.splice(index, 1);
    dispatch(setNotes(dup));
  };

  return (
    <div className="flex h-[87vh] gap-6">
      {/* Left Panel */}
      <div
        className={`${
          dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        } w-1/3 h-[95%] p-4 rounded-lg border flex flex-col overflow-y-auto scrollbar-hide`}
      >
        <h2
          className={`${
            dark ? "text-white" : "text-black"
          } text-lg font-semibold mb-4 flex justify-between`}
        >
          Your Notes
          <button
            className={`${
              dark
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-200 hover:bg-green-300 text-green-900"
            } btn btn-sm py-0 px-3`}
            onClick={handleAdd}
          >
            Add
          </button>
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
          {notes?.map((obj, i) => (
            <div
              key={i}
              onClick={() => handleScrollTo(i)}
              className={`${
                dark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } rounded shadow-sm transition-all cursor-pointer p-3`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`${
                      dark ? "text-white" : "text-black"
                    } font-semibold truncate`}
                  >
                    Note {i + 1}
                  </h3>
                  <p
                    className={`${
                      dark ? "text-gray-300" : "text-gray-700"
                    } text-sm line-clamp-2 mt-1`}
                  >
                    {obj?.title}
                  </p>
                </div>

                <button
                  type="button"
                  className={`${
                    dark
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-200 hover:bg-red-300 text-red-900"
                  } btn btn-xs px-2 py-0`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(i);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div
        className={`${
          dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        } w-2/3 h-[95%] p-4 rounded-lg border flex flex-col overflow-y-auto space-y-10 scrollbar-hide`}
      >
        {notes?.map((obj, i) => (
          <div key={obj._id} ref={noteRefs.current[i]}>
            <BodyOfNote obj={obj} i={i} prblmId={id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
