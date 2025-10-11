import {createSlice} from "@reduxjs/toolkit";


const Slice=createSlice({
    name:"slice",
    initialState:{chat:[],cppCode:"",javaCode:"",jsCode:"",notes:[],stars:[],profile:{},dark:true},
    reducers:{
     setNotes:(state,action)=>{
        state.notes=(action.payload=="There is no note for this problem")?[{title: '', body: ''}]:action.payload;
     },
     setStars:(state,action)=>{
        state.stars=action.payload;
     },
     addChat:(state,action)=>{
         state.chat.push(action.payload);
     },
     clearChat:(state)=>{
         state.chat=[];
     },
     setProfile:(state,action)=>{
          state.profile=action.payload;
     },
     cppChange:(state,action)=>{
        state.cppCode=action.payload;
     },
     javaChange:(state,action)=>{
        state.javaCode=action.payload;
     },
     jsChange:(state,action)=>{
        state.jsCode=action.payload;
     },
     setDark:(state)=>{
      state.dark=!state.dark;
     }
    }
});

export default Slice.reducer;
export const {addChat,clearChat,cppChange,javaChange,jsChange,setNotes,setStars,setProfile,setDark}=Slice.actions;