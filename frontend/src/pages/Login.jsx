import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { NavLink,useNavigate } from "react-router";
import { useSelector , useDispatch} from "react-redux";
import { loginUser } from "../authSlice";
import { useEffect, useState } from "react";

const frontendSchema= z.object({
  emailID:z.string().email("Invalid email"),
  password: z.string().min(8,"There should be atleast 8 characters in password field")
});

function Login(){
 const {register,handleSubmit,formState:{errors}}= useForm({resolver:zodResolver(frontendSchema)});
 const {isAuthenticated,loading}=useSelector(state=> state.auth)
 const navigate=useNavigate();
 const dispatch=useDispatch();
 const {error}=useSelector(state=>state.auth);
 const [showPassword,setShowPassword]=useState(false);

 useEffect(()=>{
    if(isAuthenticated){
      navigate("/",{replace:true});
    }
 },[isAuthenticated,navigate]);

 const onSubmit=(userData)=>{
     dispatch(loginUser(userData));
  }

 return(
 <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 text-gray-100">
  <div className="card w-96 bg-gray-800 shadow-2xl">
    <div className="card-body">
      <h2 className="card-title justify-center text-3xl mb-6 text-white">Leetcode</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control mt-4">
          <label className="label mb-1">
            <span className="label-text text-gray-300">Email : -</span>
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            className={`input input-bordered bg-gray-700 placeholder-gray-400 text-white ${
              errors.emailID ? 'input-error border-red-500' : ''
            }`}
            {...register('emailID')}
          />
          {errors.emailID && (
            <span className="text-red-400 text-sm mt-1">{errors.emailID.message}</span>
          )}
        </div>

        <div className="form-control mt-4">
          <label className="label mb-1">
            <span className="label-text text-gray-300">Password : -</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input input-bordered bg-gray-700 placeholder-gray-400 text-white ${
                errors.password ? 'input-error border-red-500' : ''
              }`}
              {...register('password')}
            />

            <button
              type="button"
              className="absolute top-1/2 right-6 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 z-10"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
            {errors.password && (
              <span className="text-red-400 text-sm mt-1">{errors.password.message}</span>
            )}
          </div>
        </div>

        <div className="form-control mt-6 flex justify-center">
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </div>

        <div className="mt-4 flex justify-center text-sm text-gray-300">
          <span>Don't have an account?</span>
          <NavLink to="/SignUp" className="ml-2 underline text-primary">
            Sign Up
          </NavLink>
        </div>
        {
          error=="Error Invalid credentials" && (
            <div className="flex w-full justify-center">
              <span className="text-red-400 text-sm mt-1">{error}</span>
            </div>
            )
           }
      </form>
    </div>
  </div>
</div>

 )
}

export default Login