import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSlice"
import SliceReducer from "../slice"

const store= configureStore({
       reducer:{
         auth:authReducer,
         slice:SliceReducer
       }     
});

export default store;