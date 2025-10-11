import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";

function PaymentGateWay(){
    const {user}=useSelector(state=>state.auth);
    const {dark}=useSelector(state=>state.slice);
    
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

return (
<div className={`${dark ? "bg-gray-800 shadow-lg" : "bg-white shadow-md"} rounded-box p-6 w-[50%] flex flex-col items-center justify-between gap-4 text-center`}>
  <h2 className={`text-2xl font-bold drop-shadow ${dark ? "text-white" : "text-black"}`}>Get Premium</h2>
  <p className={`text-sm ${dark ? "text-white/90" : "text-black/90"}`}>
    Unlock exclusive content, AI assistance, advanced stats & more.Just for Rs.99
  </p>

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
</div>
)
}

export default PaymentGateWay;