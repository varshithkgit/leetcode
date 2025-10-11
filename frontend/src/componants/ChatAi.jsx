import { Send } from "lucide-react";
import { useState,useRef,useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { useForm } from "react-hook-form";
import { addChat  } from "../slice";
import { useSelector , useDispatch } from "react-redux";


function ChatAi({prblm}) {
    const [loading,setLoading]=useState(false);
    const {chat}=useSelector(state=> state.slice);
    // const [chat,setChat]=useState([]);
    const {register,handleSubmit,formState:{errors},reset}=useForm();
    const messagesEndRef = useRef(null);
    const {dark}=useSelector(state=>state.slice);
    const dispatch=useDispatch()

    useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [chat]);    

    const onSubmit= async ({message}) => {
        setLoading(true);
        // setChat(prev=>[...prev,{ role: "user", parts: [{ text: message }] }]);
       dispatch(addChat({ role: "user", parts: [{ text: message }] }));
        reset();
        try{
            const {data}= await  axiosClient.post('/ai/chat',{
                message,
                title:prblm.title,
                description:prblm.description,
                testCases: prblm.visibleTestCases
            });
            
            // setChat(prev=>[...prev,{ role: "model", parts: [{ text: data.message }] }]);
            dispatch(addChat({ role: "model", parts: [{ text: data }] }));
        }catch(e){
          console.log(e)
          //  setChat(prev => [...prev, { 
          //       role: 'model', 
          //       parts:[{text: "Error from AI Chatbot"}]
          //   }]);  
          dispatch(addChat({role: 'model',parts:[{text: "Error from AI Chatbot"}]}));      
        }
        finally{
            setLoading(false);
        }
    }
    
  return (
  <div className={`${dark ? "bg-gray-950 text-white" : "bg-white text-black"} flex flex-col h-screen max-h-[87vh] min-h-[500px]`}>
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {
        chat.map((obj,index)=>(
              <div key={index}>
              <div  
                className={`chat ${obj.role === "user" ? "chat-end" : "chat-start"}`}
              >
                <div className={`chat-bubble ${
  obj.role == "model"
    ? dark
      ? "bg-gray-800 text-gray-100"
      : "bg-gray-200 text-gray-900"
    : dark
    ? "bg-blue-700 text-white"
    : "bg-blue-200 text-blue-900"
}`}
>
                 {
                 obj.role === "model" ? (
                      obj?.parts[0]?.text?.split("~").map((sentence, idx) =>(
                      <div key={sentence+idx}>
                      <br></br>
                      <div>
                        {
                        sentence
                        }
                      </div>
                      </div>
                      ))
                   ) : (
                      <div className={`${dark ? "bg-blue-700 text-white" : "bg-blue-200 text-blue-900"}`}>{obj?.parts[0]?.text}</div>
                    )
               
                 }

                </div>
               </div>
             {
              index==chat.length-1 && loading &&(
            <div className="chat chat-start" key={"bool"+index}>
             <div className="chat chat-start">
              <div className="chat-bubble bg-base-300">
               <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              </div>
             </div>
            </div>
            </div> 
              )
             }
            
               <div ref={messagesEndRef}></div>
               </div>    
        ))
    }

  </div>

  <form className={`${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-300"} sticky bottom-0 p-4 border-t`} onSubmit={handleSubmit(onSubmit)}>
    <div className="flex items-center gap-2">
      <input
        placeholder="Ask me anything..."
        className={`${dark ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:ring-blue-600" : "bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-blue-400"} input input-bordered flex-1 focus:outline-none focus:ring-2`}
        {...register("message",{min:2})}
      />
      <button
        type="submit"
        className={`${dark ? "bg-blue-400" : "bg-blue-600"} w-12 h-10 p-2  rounded-sm ml-2 flex items-center justify-center`}
        disabled={loading}
      >
        <Send size={20} />
      </button>
    </div>
    {errors.numberInput && <p className="text-red-600 text-sm">Value must be at least 10</p>}
  </form>
</div>
  );
}

export default ChatAi;