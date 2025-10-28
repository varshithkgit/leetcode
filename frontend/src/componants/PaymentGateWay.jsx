import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { useEffect, useState } from "react";

function PaymentGateWay(){
    const {user}=useSelector(state=>state.auth);
    const {dark}=useSelector(state=>state.slice);
    const [show,setShow]=useState(false);
    
    const handlePayment=async () => {
        const {data}=await axiosClient.post("/pay/createOrder",{
            amount:199,
            receipt:`receipt_${user._id}`
        });
        
        const options={
            key:data.key,
            amount:data.amount,
            currency:data.currency,
            name:"LeetCode Premium",
            description:"Getting Access to better features",
            order_id:data.id,
            prefill:{
              name:user?.firstname,
              email:user?.emailID,
              contact:9999999999
            },
            theme:{
                color:"#FE7743"
            },
            handler:async function (response) {
                const {data}=await axiosClient.post("/pay/checkPayment",{...response,receipt_id:`receipt_${user._id}_${Date.now()}`});

                console.log(data);
                setShow(data.status=="success"?true:false);
                if(data.status=="success"){
                    Swal.fire({
                     title: "Payment! done Successfully",
                     icon: "success",
                    });
                }else{
                    Swal.fire({
                     title: "Payment  Failed",
                     icon: "error",
                    });
                }
            }
        };

        const razor=new window.Razorpay(options);
        razor.open();
    }

    useEffect(()=>{
    const premium=async()=>{
    try {
       const {data}=await axiosClient.get("/pay/premium");

       setShow(data.premium?data.premium:false);
    } catch (error) {
      alert("There was an error:- "+error);
    }

    }

  premium();
    },[]);

return (
<div className={`${dark ? "bg-gray-800 shadow-lg" : "bg-white shadow-md"} rounded-box p-6 w-[50%] flex flex-col items-center justify-between gap-4 text-center`}>
  <h2 className={`text-2xl font-bold drop-shadow ${dark ? "text-white" : "text-black"}`}>Get Premium</h2>
  <p className={`text-sm ${dark ? "text-white/90" : "text-black/90"}`}>
    Unlock exclusive content, AI assistance, advanced stats & more.Just for Rs.199
  </p>

{
  show?
  (
    <div className="text-white">Thanks for upgrading to plus+</div>
  )
  :
  (
     <button
    onClick={() => {handlePayment()}}
    className={`btn font-semibold transition-transform hover:scale-105 ${
    dark
    ? "text-white bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-yellow-100"
    : "text-black bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 hover:bg-yellow-300"
    }`}
  >
    Upgrade Now
  </button>
  )
}
</div>
)
}

export default PaymentGateWay;