import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useSelector } from "react-redux";

const SubmissionHistory=({prblmId})=>{
    const [submission,setSubmission]=useState([]);
    const [loading,setLoading]=useState(false);
    const [error, setError] = useState(null);
    const [selectedSubmit,setSelectedSubmit]=useState(null);
    const {dark}=useSelector(state=>state.slice);

    useEffect(()=>{
        const fetchingSubmissions= async ()=>{
              setLoading(true);
              try{
                const {data}=await axiosClient.get(`/prblm/getAllSubmitsOfAPrblm/${prblmId}`);
                setSubmission(data);
                setError(null);
              }catch(e){
                setError("Error: In fetching data"+e);
              }finally{
                setLoading(false);
              }
        }

        fetchingSubmissions();
    },[prblmId]);

    const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'badge-success';
      case 'wrong': return 'badge-error';
      case 'error': return 'badge-warning';
      case 'pending': return 'badge-info';
      default: return 'badge-neutral';
    }
    };

    const formatMemory= (memo)=>{
          if(memo<1024) return `${memo} KB`
          else return `${(memo/1024).toFixed(2)} MB`
    }
    
    const formatDate=(date)=>{
        const dateArr= new Date(date);
        return dateArr.toLocaleString();
    }

    if(loading){
        return(
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>            
        )
    }

    
  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

 
  return (
<div className={`${dark ? "text-white" : "text-black"} container mx-auto p-4`}>
  <h2 className={`${dark ? "text-white" : "text-black"} text-3xl font-bold mb-6 text-center`}>Submission History</h2>

  {submission.length === 0 ? (
    <div className={`${dark ? "bg-gray-800 text-gray-200 border-gray-600" : "bg-blue-100 text-blue-900 border-blue-300"} alert alert-info shadow-lg border`}>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>No submissions found for this problem</span>
      </div>
    </div>
  ) : (
    <div className={`${dark ? "border-gray-700" : "border-gray-300"} overflow-x-auto rounded-lg shadow-lg border`}>
      <table className={`${dark ? "bg-gray-900 text-white" : "bg-white text-black"} w-full text-sm rounded-lg overflow-hidden`}>
        <thead>
          <tr className={`${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800"} text-left`}>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Language</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Runtime</th>
            <th className="px-4 py-3">Memory</th>
            <th className="px-4 py-3">Test Cases</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submission.map((obj, index) => (
            <tr
              key={obj._id}
              className={`${dark ? "border-gray-800 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-200"} border-t transition duration-200`}
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 font-mono">{obj.language}</td>
              <td className="px-4 py-3">
                <span className={`badge ${getStatusColor(obj.status)} text-xs`}>
                  {obj.status.charAt(0).toUpperCase() + obj.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 font-mono">{obj.runtime.toFixed(2)}s</td>
              <td className="px-4 py-3 font-mono">{formatMemory(obj.memory)}</td>
              <td className="px-4 py-3 font-mono">
                {obj.passedTestCases}/{obj.totalTestCases}
              </td>
              <td className="px-4 py-3 text-sm">{formatDate(obj.createdAt)}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => setSelectedSubmit(obj)}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  Code
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  <p className={`${dark ? "text-gray-400" : "text-gray-700"} mt-4 text-sm text-center`}>
    Showing {submission.length} submission{submission.length !== 1 && 's'}
  </p>

  {selectedSubmit && (
    <div className="modal modal-open">
      <div className={`${dark ? "bg-gray-900 text-gray-100 border-gray-700" : "bg-white text-black border-gray-300"} modal-box w-11/12 max-w-5xl border`}>
        <h3 className="text-xl font-bold mb-4">
          Submission Details: <span className="text-primary">{selectedSubmit.language}</span>
        </h3>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`badge ${getStatusColor(selectedSubmit.status)}`}>
              {selectedSubmit.status}
            </span>
            <span className="badge badge-outline">Runtime: {selectedSubmit.runtime.toFixed(2)}s</span>
            <span className="badge badge-outline">Memory: {formatMemory(selectedSubmit.memory)}</span>
            <span className="badge badge-outline">Passed: {selectedSubmit.passedTestCases}</span>
          </div>

          {selectedSubmit.errorMessage && (
            <div className={`${dark ? "bg-red-900 border-red-700 text-red-200" : "bg-red-100 border-red-300 text-red-800"} alert alert-error mt-2 border`}>
              <div>
                <span>{selectedSubmit.errorMessage}</span>
              </div>
            </div>
          )}
        </div>

        <pre className={`${dark ? "bg-black text-gray-100 border-gray-800" : "bg-white text-gray-900 border-gray-300"} p-4 rounded-lg overflow-x-auto text-sm shadow-inner border`}>
          <code>{selectedSubmit.code}</code>
        </pre>

        <div className="modal-action">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setSelectedSubmit(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default SubmissionHistory;