import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Progress({submits}){
  const [submitsArray,setSubmitsArray]=useState(submits);
  const days30=[3,5,8,10];
  const {dark}=useSelector(state=>state.slice);

  useEffect(()=>{
  setSubmitsArray(prev=>prev.map((obj)=>new Date(obj.createdAt || obj).toISOString().split("T")[0]));
  },[]);

  const getDifficultyBgColors = (day) => {
    let num=0;
    for(let val of submitsArray){
      if(val==day) num++;
    }

    if(num==0)  return dark?"#374151":"#E5E7EB";  // 0 submissions
    if(num>0 && num<3) return ' #86EFAC'; // 1-2 submissions
    if (num>=3 && num<5) return ' #4ADE80'; // 3-4
    if(num>=5 && num<7) return '#22C55E'; // 5-6
    if(num>=7) return "#16A34A"; // 7+
  };

return(
<div className={`${dark ? "bg-gray-800 shadow" : "bg-white shadow-md"} rounded-box p-6`}>
  <h2 className={`${dark ? "text-white" : "text-black"} text-xl font-semibold`}>Submission History</h2>
  <p className={`${dark ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>
    {submits.length} submissions in the past one year
  </p>

  <svg className="w-full" viewBox="0 0 776.26 90">
    
      {
        Array.from({length:12}).map((_,i)=>(
          <g transform={`translate(${(i+0.1)*64}, 0)`} key={`month${i}`}>
            {
            Array.from({length:5}).map((_,j)=>(
              <g transform={`translate(${j*11.5}, 0)`} key={`month${i}-week${j}`}>
                {
                  Array.from({length:j==4?(days30.includes(i)?2:(i==1?0:3)):7}).map((_,k)=>{
                    const mm=i<9?`0${i+1}`:`${i+1}`;
                    const dd=7*j+k<9?`0${7*j+k+1}`:`${7*j+k+1}`;
                    const bg=getDifficultyBgColors(`2025-${mm}-${dd}`);
                    return(
                       <rect height="8.86" width="8.86" x="0" y={`${11.5*k}`} rx="2" fill={bg} key={`2025-${mm}-${dd}`}></rect>
                  )})
                }
              </g>
            ))
            }
          </g>
        ))
      }
    
  </svg>
  <div className="flex justify-around text-xs text-gray-500">
    <span>Jun</span>
    <span>Jul</span>
    <span>Aug</span>
    <span>Sep</span>
    <span>Oct</span>
    <span>Nov</span>
    <span>Dec</span>
    <span>Jan</span>
    <span>Feb</span>
    <span>Mar</span>
    <span>Apr</span>
    <span>May</span>
  </div>
</div>

    )
}

export default Progress;