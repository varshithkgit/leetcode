import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const Editorial = ({prblm, secureUrl, thumbnailUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const {dark}=useSelector(state=>state.slice);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleControl = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, []);

  return (
    <>
    <div
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-xl group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={handleControl}
        className={`${dark ? "bg-black" : "bg-white"} w-full aspect-video cursor-pointer`}
      />

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-500 ease-in-out bg-gradient-to-t ${
  dark ? "from-black/70 to-transparent" : "from-white/70 to-transparent"
} ${isHovering || !isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center space-x-4">
          {/* Play/Pause Button */}
          <button
            onClick={handleControl}
            aria-label={isPlaying ? "Pause" : "Play"}
            className={`${dark ? "bg-[#FE7743] text-black" : "bg-[#FE7743] text-white"} p-2 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition-transform duration-200`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          {/* Time and Progress Bar */}
          <div className="flex items-center w-full space-x-2">
            <span className={`${dark ? "text-white" : "text-black"} text-xs w-10 text-right`}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Number(e.target.value);
                }
              }}
              className={`${dark ? "bg-gray-600" : "bg-gray-300"} w-full accent-[#FE7743] h-[3px] rounded-lg appearance-none transition-all`}
            />
            <span className={`${dark ? "text-white" : "text-black"} text-xs w-10 text-left`}>{(currentTime < duration) ? formatTime(duration - currentTime) : "0:00"}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Approaches Section */}
<div className={`${dark ? "text-white" : "text-black"} mt-10 max-w-2xl mx-auto space-y-8`}>

  <h2 className="text-2xl font-semibold">Approaches</h2>

{
  prblm?.Aprouch?.map(({concept,steps,complexities,name})=>(
<div key={name} className={`${dark ? "bg-[#1a1a1a]" : "bg-[#f5f5f5]"} space-y-5 p-6 rounded-2xl shadow-xl`}>
  <h3 className={`${dark ? "text-white" : "text-black"} text-2xl font-bold`}>{name}</h3>

  <div className={`${dark ? "text-gray-200" : "text-gray-800"} text-base leading-relaxed space-y-4`}>
    <div>
      <span className={`${dark ? "text-white" : "text-black"} font-semibold`}>Concept:</span><br />
      <ul className='list-disc ml-4'>
        {
          concept?.map((value,i)=><li key={"concept"+i}>{value}</li>)
        }
      </ul>
    </div>

    <div>
      <span className={`${dark ? "text-white" : "text-black"} font-semibold`}>Steps:</span><br />
      {/* 1. Loop <code className="text-orange-300">i</code> from <code>0</code> to <code>n - 1</code>.<br />
      2. Inside, loop <code className="text-orange-300">j</code> from <code>i + 1</code> to <code>n - 1</code>.<br />
      3. If <code className="text-green-300">nums[i] + nums[j] == target</code>, return <code>[i, j]</code>. */}
      <ol className='list-decimal ml-4'>
        {
          steps?.map((value,i)=>{
          return(
          <li  key={`step${i}`}>
            {value?.split(" ")?.map((word,i)=>{
              // console.log(word);
              if(word?.includes(`\`o`)){
                word=word.replace("`o","").replace("`","");
                word= <code key={"codeo"+i} className={`${dark ? "text-orange-300" : "text-orange-600"} mx-2`}>{word}</code> 
              }else if(word?.includes(`\`g`)){
                word=word.replace("`g","").replace("`","");
                word= <code key={"codeg"+i} className={`${dark ? "text-green-300" : "text-green-600"} mx-2`}>{word}</code> 
              }else if(word?.includes(`\``)){
                word=word.replace("`","");
                word=word.replace("`","");
                word= <code key={"code"+i} className='mx-2'>{word}</code> 
              }else{
                return " "+word;
              }

              return word;
            })}
          </li>
          )
        })
        }
      </ol>
    </div>

    <div>
      <span className={`${dark ? "text-white" : "text-black"} font-semibold`}>Time Complexity:</span>{' '}
      <code className={`${dark ? "text-pink-400" : "text-pink-600"} ml-2`}>{complexities[0]}</code><br />
      <span className={`${dark ? "text-white" : "text-black"} font-semibold`}>Space Complexity:</span>{' '}
      <code className={`${dark ? "text-pink-400" : "text-pink-600"} ml-2`}>{complexities[1]}</code>
    </div>
  </div>
</div>
))
}
</div>

</>
  );
};

export default Editorial;
