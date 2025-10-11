import Editor from '@monaco-editor/react';
import { useEffect , useState , useRef} from 'react';
import { useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import SubmissionHistory from '../componants/submissionHistory';
import ChatAi from '../componants/ChatAi';
import { useSelector ,useDispatch } from 'react-redux';
import { clearChat , cppChange ,javaChange,jsChange } from '../slice';
import Notes from '../componants/Notes';
import Editorial from '../componants/Editorial';

// Did not add white theme

const PrblmPage = () => {
    const {id}=useParams();
    const [prblm,setPrblm]=useState(null);
    const [leftPanel,setLeftPanel]=useState('Description');
    const [rightPanel,setRightPanel]=useState('Code');
    const [language,setLanguage]=useState("javascript");
    const [submitDetails,setSubmitDetails]=useState(null);
    const [runDetails,setRunDetails]=useState(null);
    //const [code,setCode]=useState("");
    const {cppCode,javaCode,jsCode,dark} =useSelector(state=>state.slice);
    const dispatch=useDispatch();
    const [loading, setLoading] = useState(false);
    const editorRef=useRef(null);

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

    useEffect(()=>{
    const getData= async () => {
      setLoading(true)
        try{
         const {data} = await axiosClient.get(`/prblm/getPrblmById/${id}`);
         setPrblm(data?.prblm);
         setLoading(false);
        }catch(e){
          setLoading(false);
        }
    }

    getData();
    },[id]);

    useEffect(()=>{
       dispatch(clearChat());
    },[]);

    // useEffect(()=>{
    //   if(prblm){
    //     const initialCode=prblm.startCode.find(obj=>obj.language==language)?.initialCode||"";
    //     setCode(initialCode);
    //   }
    // },[language,prblm])

    useEffect(()=>{
      if(prblm){
      for(let {language:l,initialCode} of prblm?.startCode){
        if(l=="c++"){
          dispatch(cppChange(initialCode));
        }else if(l=="java"){
          dispatch(javaChange(initialCode));
        }else{
          dispatch(jsChange(initialCode));
        }
      }
    }
    },[prblm]);
    
  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  };

  // const handleEditorChannge= (value)=>{
  //   setCode(value||'');
  // }

  const handleEditorChange= (value)=>{
    //setCode(value||'');
    if(language=="cpp"){
      dispatch(cppChange(value));
    }else if(language=="java"){
      dispatch(javaChange(value));
    }else{
      dispatch(jsChange(value));
    }
  }

  const handleRun= async () => {
    setLoading(true);
    setRunDetails(null);
    try{
      const code=(language=="java")?javaCode:(language=="javascript")?jsCode:cppCode;
      const {data}= await axiosClient.post(`/submit/runCode/${prblm._id}`,{code,language});
      let time=0;
      let space=-1;
      for(let obj of data){
        time+=parseFloat(obj.time);
        space=Math.max(space,obj.memory);
      }

      const allTrue= data?.every(obj=> obj.status_id==3);
      const newObj={testCases:data,time,space,allTrue};
    
      setLoading(false);
      setRunDetails({...newObj});
      setRightPanel("Testcase")
    }catch(e){
      alert("Error: "+e);
      setLoading(false);
    }
  }

  const handleSubmitting=async () => {
    setLoading(true);
    try{
      const code=(language=="java")?javaCode:(language=="javascript")?jsCode:cppCode;
      const {data}= await axiosClient.post(`/submit/${prblm._id}`,{code,language});
      setLoading(false)
      setSubmitDetails(data);
      setRightPanel("Result");
    }catch(e){
      alert("Error: "+e);
      setLoading(false);
    }
  }

  if(loading&&!prblm){
     return(
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
     );
  }
    
  return (
  <div className={`${dark ? "bg-gray-900 text-white" : "bg-white text-black"} h-screen flex`}>
  <div className={`${dark ? "border-gray-700" : "border-gray-300"} w-1/2 flex flex-col border-r`}>
    <div className={`${dark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"} tabs tabs-bordered px-4`}>
      <button className="tab tab-active" onClick={()=>setLeftPanel("Description")}>Description</button>
      <button className="tab tab-active" onClick={()=>setLeftPanel("Editorial")}>Editorial</button>
      <button className="tab tab-active" onClick={()=>setLeftPanel("Solutions")}>Solutions</button>
      <button className="tab tab-active" onClick={()=> setLeftPanel("Submissions")}>Submissions</button>
      <button className="tab tab-active" onClick={()=> setLeftPanel("ChatAI")}>ChatAI</button>
      <button className="tab tab-active" onClick={()=> setLeftPanel("Notes")}>Notes</button>
    </div>

    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
      {
      leftPanel=="Description"?(
      <div>
        <div className="flex items-center gap-4 mb-6">
          <h1 className={`${dark ? "text-white" : "text-black"} text-2xl font-bold`}>{prblm?.title}</h1>
          <div className={`badge badge-outline ${getDifficultyColor(prblm?.difficulty)}`}>{prblm?.difficulty}</div>
          <div className={`${dark ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-800"} badge badge-primary`}>{prblm?.tags}</div>
        </div>

        <div className="prose max-w-none prose-invert">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {prblm?.description}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Examples:</h3>
          <div className="space-y-4">
            {prblm?.visibleTestCases?.map((obj, index) => (
              <div key={index} className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} p-4 rounded-lg border`}>
                <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                <div className={`${dark ? "text-gray-300" : "text-gray-800"} space-y-2 text-sm font-mono`}>
                  <div><strong>Input:</strong>{obj?.input}</div>
                  <div><strong>Output:</strong>{obj?.output}</div>
                  <div><strong>Explanation:</strong>{obj?.explanation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      ):
      leftPanel=="Editorial"?(<Editorial prblm={prblm} secureUrl={prblm.secureUrl} thumbnailUrl={prblm.thumbnailUrl} duration={prblm.duration}></Editorial>):leftPanel=="Solutions"?(
  <div>
  <h2 className={`${dark ? "text-white" : "text-black"} text-xl font-bold mb-4`}>Solutions</h2>
  <div className="space-y-6">
    {
      prblm?.referenceSolution.map((solution, index) => (
        <div
          key={index}
         className={`${dark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"} border rounded-lg`}
        >
          <div className={`${dark ? "bg-gray-700" : "bg-gray-200"} px-4 py-2 rounded-t-lg`}>
            <h3 className="font-semibold">
              {prblm?.title} - {solution?.language}
            </h3>
          </div>
          <div className="p-4">
            <pre className={`${dark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} p-4 rounded text-sm overflow-x-auto`}>
              <code>{solution?.completeCode}</code>
            </pre>
          </div>
        </div>
      ))||
      <p className={`${dark ? "text-gray-400" : "text-gray-700"}`}>
        Solutions will be available after you solve the problem.
      </p>
    }
  </div>
</div>
      ):leftPanel=="Submissions"?(
      <div>
        <h2 className="text-xl font-bold mb-4">My Submissions</h2>
        <div className={`${dark ? "text-gray-400" : "text-gray-800"}`}>
             <SubmissionHistory prblmId={prblm._id}></SubmissionHistory>
        </div>
      </div>
                  
    ):leftPanel=="ChatAI"?(
      <ChatAi prblm={prblm}></ChatAi>
    ):(<Notes id={id}></Notes> )
      }
    </div>
  </div>

  <div className="w-1/2 flex flex-col bg-gray-900">
    
    <div className={`${dark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"} tabs tabs-bordered px-4`}>
      <button className="tab tab-active" onClick={()=> setRightPanel("Code")}>Code</button>
      <button className="tab tab-active" onClick={()=> setRightPanel("Testcase")}>Testcase</button>
      <button className="tab tab-active" onClick={()=> setRightPanel("Result")}>Result</button>
    </div>

    
    <div className="flex-1 flex flex-col">
    
    { 
    rightPanel=="Code"?(
      <>
      <div className={`${dark ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-white"} flex justify-between items-center p-4 border-b`}>
        <div className="flex gap-2">
          {['JavaScript', 'Java', 'C++'].map((lang) => (
            <button key={lang} className={`${dark ? "text-white hover:bg-gray-700" : "text-black hover:bg-gray-200"} btn btn-sm btn-ghost`} onClick={()=>{
                 if(lang=="C++") setLanguage("cpp");
                 else setLanguage(lang?.toLowerCase());
                 }}>
              {lang}
            </button>
          ))}
        </div>
      </div>
    
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguageForMonaco(language)}
          // value={code}
          value={(language=="java")?javaCode:(language=="javascript")?jsCode:cppCode}
          theme={dark ? "vs-dark" : "light"}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            mouseWheelZoom: true,
          }}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
        />
      </div>
      
      <div className={`${dark ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-white"} p-4 border-t flex justify-between`}>
        <div className="flex gap-2">
          {/* <button className="btn btn-sm btn-ghost text-white hover:bg-gray-700">Console</button> */}
        </div>
        <div className="flex gap-2">
          <button className={`btn btn-outline btn-sm ${dark ? "border-gray-500 text-white" : "border-gray-300 text-black"} ${loading ? "loading" : ""}`} onClick={handleRun} disabled={loading}>Run</button>
          <button className={`btn btn-primary btn-sm ${dark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-200 hover:bg-blue-300 text-blue-900"} ${loading ? "loading" : ""}`} 
          onClick={handleSubmitting}
          disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
      </>
    ):rightPanel=="Testcase"?(
              <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runDetails ? (
                <div className={`alert ${runDetails?.allTrue? 'alert-success' : 'alert-error'} mb-4`}>
                  <div>
                    {runDetails?.allTrue ? (
                      <div>
                        <h4 className="font-bold">✅ All test cases passed!</h4>
                        <p className="text-sm mt-2">Runtime: {runDetails.time+" sec"}</p>
                        <p className="text-sm">Memory: {runDetails.space+" KB"}</p>
                        
                        <div className="mt-4 space-y-2">
                          {runDetails?.testCases?.map((tc, i) => (
                            <div key={i} className={`${dark ? "bg-gray-800 text-white" : "bg-white text-black"} p-3 rounded text-xs`}>
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc?.stdin}</div>
                                <div><strong>Expected:</strong> {tc?.expected_output}</div>
                                <div><strong>Output:</strong> {tc?.stdout}</div>
                                <div className={`${dark ? "text-green-600" : "text-green-400"}`}>
                                  {'✓ Passed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">❌ Error</h4>
                        <div className="mt-4 space-y-2">
                          {runDetails?.testCases?.map((tc, i) => (
                            <div key={i} className={`${dark ? "bg-gray-800 text-white" : "bg-white text-black"} p-3 rounded text-xs`}>
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc?.stdin}</div>
                                <div><strong>Expected:</strong> {tc?.expected_output}</div>
                                <div><strong>Output:</strong> {tc?.stdout}</div>
                                <div className={tc?.status_id==3 ? 'text-green-600' : 'text-red-600'}>
                                  {tc?.status_id==3 ? '✓ Passed' : '✗ Failed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
            ):(
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
              {submitDetails ? (
                <div className={`alert ${submitDetails?.status=="accepted" ? 'alert-success' : 'alert-error'}`}>
                  <div>
                    {submitDetails?.status=="accepted" ? (
                      <div>
                        <h4 className="font-bold text-lg">🎉 Accepted</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitDetails?.passedTestCases}/{submitDetails?.totalTestCases}</p>
                          <p>Runtime: {submitDetails?.runtime + " sec"}</p>
                          <p>Memory: {submitDetails?.memory + "KB"} </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg">❌ {submitDetails?.error}</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitDetails?.passedTestCases}/{submitDetails?.totalTestCases}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`${dark ? "text-gray-500" : "text-gray-600"}`}>
                  Click "Submit" to submit your solution for evaluation.
                </div>
              )}
            </div>
          )
    }
    </div>
  </div>
</div>
  );
};

export default PrblmPage;