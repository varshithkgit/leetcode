import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

export const registerUser=createAsyncThunk(
    "auth/register",
    async (userData,{rejectWithValue}) => {
        try{
            const {data}= await axiosClient.post("userAuth/register",userData);
            return data.user;
        }
        catch(e){
            return rejectWithValue({
        message: e.message,
        code: e.code,
        isAxiosError: e.isAxiosError,
      });
        }
    }
);

export const checkAuth=createAsyncThunk(
    "auth/check",
    async (_,{rejectWithValue}) => {
        try{
            const {data}= await axiosClient.get("userAuth/check");
            return data.user;
        }catch(e){
            return rejectWithValue({
        message: e.message,
        code: e.code,
        isAxiosError: e.isAxiosError,
      });
        }
    }
);

export const loginUser=createAsyncThunk(
    "auth/login",
    async (loginData,{rejectWithValue})=>{
    try{
        const {data:{user}}= await axiosClient.post("userAuth/login",loginData);
        return user;
    }catch(e){
        return rejectWithValue({
        message: e?.response?.data,
        code: e.code,
        isAxiosError: e.isAxiosError,
      });
    }
}
);

export const logoutUser=createAsyncThunk(
    "auth/logout",
    async (_,{rejectWithValue}) => {
        try{
            await axiosClient.post("userAuth/logout");
            return null;
        }catch(e){
            return rejectWithValue({
        message: e.message,
        code: e.code,
        isAxiosError: e.isAxiosError,
      });
        }
    }
);

const auth=createSlice({
    name:"auth",
    initialState:{
        user:null,
        error:null,
        isAuthenticated:false,
        loading:false
    },
    reducers:{},
    extraReducers: (builder)=>{
      builder
      //Register user
      .addCase(registerUser.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(registerUser.fulfilled,(state,action)=>{
        state.loading=false;
        state.user=action.payload;
        state.isAuthenticated=!!action.payload;
      })
      .addCase(registerUser.rejected,(state,action)=>{
        state.error=action.payload.message||"Something went wrong please try again later";
        state.loading=false;
        state.user=null;
        state.isAuthenticated=false;
      })
    //   check  user
     .addCase(checkAuth.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(checkAuth.fulfilled,(state,action)=>{
        state.loading=false;
        state.user=action.payload;
        state.isAuthenticated=!!action.payload;
      })
      .addCase(checkAuth.rejected,(state,action)=>{
        state.error=action.payload.message||"Something went wrong please try again later";
        state.loading=false;
        state.user=null;
        state.isAuthenticated=false;
      })
    //   login user
      .addCase(loginUser.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(loginUser.fulfilled,(state,action)=>{
        state.loading=false;
        state.user=action.payload;
        state.isAuthenticated=!!action.payload;
      })
      .addCase(loginUser.rejected,(state,action)=>{
        state.error=action.payload.message||"Something went wrong please try again later";
        state.loading=false;
        state.user=null;
        state.isAuthenticated=false;
      })
    //   logout user
      .addCase(logoutUser.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(logoutUser.fulfilled,(state,action)=>{
        state.loading=false;
        state.user=action.payload;
        state.isAuthenticated=!!action.payload;
      })
      .addCase(logoutUser.rejected,(state,action)=>{
        state.error=action.payload.message||"Something went wrong please try again later";
        state.loading=false;
        state.user=null;
        state.isAuthenticated=false;
      })
    }
});

export default auth.reducer;