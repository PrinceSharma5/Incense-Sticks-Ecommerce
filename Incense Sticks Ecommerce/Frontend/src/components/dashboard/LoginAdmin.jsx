import { useActionState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

export default function LoginAdmin() {
const navigate=useNavigate()



useEffect(()=>{
if(sessionStorage.getItem("adminToken")){
  navigate("/dashboard")
}
},[])
const handleSubmit=async(olddata,formData)=>{

const email=formData.get("email")
const password=formData.get("password")

    console.log(email);
    console.log(password);
    
    const response=await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/admin-login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },body:JSON.stringify({
            email:email,
            password:password
        })
    })

    const json=await response.json()

if(json.success){
  toast.success(json.message)
  sessionStorage.setItem("adminToken", json.token)

  setTimeout(()=>{
navigate("/dashboard")

  },2000)
}
else{
  toast.error(json.message)
  return {
    email:email,
    password:password,
    error:json.message
  }
}
    

    return {
        email:"",
        password:"",
        error:""
    }
}

    const [state,formAction,isPending]=useActionState(handleSubmit, {
        email:"",
        password:"",
        error:""
    })
  return (

    <>
    <Toaster/>
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="relative px-8 py-10">
          {/* Background glow */}
          <div className="absolute -top-20 right-0 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />

          <div className="relative">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                <span className="text-2xl font-bold text-white">A</span>
              </div>

              <h1 className="text-3xl font-bold text-white">
                Admin Login
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Enter your email and password to access dashboard
              </p>
            </div>

            <form action={formAction} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  defaultValue={state.email}
                  placeholder="admin@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/15 focus:ring-4 focus:ring-blue-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  defaultValue={state.password}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/15 focus:ring-4 focus:ring-blue-500/20"
                />
              </div>

     

              {/* Button */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.98]"
              >
                Login to Dashboard
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-400">
              Secure admin access only
            </p>
          </div>
        </div>
      </div>
    </div>
    </>

  );
}