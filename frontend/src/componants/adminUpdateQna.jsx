import {NavLink} from "react-router";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function AdminUpdateQna(){
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/prblm/getAllPrblm');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
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
<div className="min-h-screen bg-gray-950 text-white py-10 px-4">

  <div className="max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-extrabold tracking-tight">🗑️ Update Problems</h1>
    </div>

    <div className="bg-gray-900 border border-gray-800 shadow-xl rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-800 text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 w-1/12">#</th>
              <th className="px-6 py-4 w-4/12">Title</th>
              <th className="px-6 py-4 w-2/12">Difficulty</th>
              <th className="px-6 py-4 w-3/12">Tags</th>
              <th className="px-6 py-4 w-2/12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr
                key={problem._id}
                className="border-t border-gray-800 hover:bg-gray-800 transition-all duration-200"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-white">
                  {problem.title}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      problem.difficulty === 'easy'
                        ? 'bg-green-600 text-white'
                        : problem.difficulty === 'medium'
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs border border-gray-500 rounded-full">
                    {problem.tags}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <NavLink
                    to={`/admin/update/prblm/${problem._id}`}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition duration-200"
                  >
                    Update
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

  );
}

export default AdminUpdateQna;