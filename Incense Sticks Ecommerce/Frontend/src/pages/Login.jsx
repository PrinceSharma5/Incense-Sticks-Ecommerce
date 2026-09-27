import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("userToken")) {
      navigate("/");
    }
  }, [navigate]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;

    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      name === "email" ||
      name === "password" ||
      name === "confirm_password"
    ) {
      setShowOtpField(false);

      setSignupData((prev) => ({
        ...prev,
        [name]: value,
        otp: "",
      }));
    }
  };

  const resetSignupForm = () => {
    setSignupData({
      email: "",
      password: "",
      confirm_password: "",
      otp: "",
    });

    setShowOtpField(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "signup") {
      resetSignupForm();
    }

    if (tab === "login") {
      setLoginData({
        email: "",
        password: "",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all login fields");
      return;
    }

    const toastId = toast.loading("Logging in...");

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/login-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const json = await response.json();

      if (!json.success) {
        toast.error(json.message || "Login failed", {
          id: toastId,
        });
        return;
      }

      sessionStorage.setItem("userToken", json.token);

      toast.success("Login successful", {
        id: toastId,
      });

      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!signupData.email) {
      toast.error("Please enter email address");
      return;
    }

    if (!signupData.password) {
      toast.error("Please enter password");
      return;
    }

    if (!signupData.confirm_password) {
      toast.error("Please enter confirm password");
      return;
    }

    if (signupData.password !== signupData.confirm_password) {
      toast.error("Password and confirm password do not match");
      return;
    }

    const toastId = toast.loading("Sending OTP...");

    try {
      setOtpLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/generate-otp-by-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signupData.email,
          }),
        }
      );

      const json = await response.json();

      console.log(json);

      if (!json.success) {
        toast.error(json.message || "OTP send failed", {
          id: toastId,
        });
        return;
      }

      toast.success("OTP sent successfully", {
        id: toastId,
      });

      setShowOtpField(true);
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !signupData.email ||
      !signupData.password ||
      !signupData.confirm_password
    ) {
      toast.error("Please enter email, password and confirm password");
      return;
    }

    if (signupData.password !== signupData.confirm_password) {
      toast.error("Password and confirm password do not match");
      return;
    }

    if (!showOtpField) {
      toast.error("Please send OTP first");
      return;
    }

    if (!signupData.otp) {
      toast.error("Please enter OTP");
      return;
    }

    const toastId = toast.loading("Creating account...");

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/create-new-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        }
      );

      const json = await response.json();

      console.log(json);

      if (!json.success) {
        toast.error(json.message || "Signup failed", {
          id: toastId,
        });
        return;
      }

      toast.success("Signup successful", {
        id: toastId,
      });

      resetSignupForm();
      setActiveTab("login");
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            background: "#111827",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "600",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fff",
            },
          },
        }}
      />


      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-4 py-10">
        <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-2xl shadow-orange-200/50 lg:grid-cols-2">
            {/* Left Side */}
            <div className="hidden bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 p-10 text-white lg:block">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur">
                    Welcome
                  </span>

                  <h1 className="mt-8 text-4xl font-black leading-tight">
                    Create your account and start shopping today.
                  </h1>

                  <p className="mt-5 max-w-md text-sm leading-7 text-orange-50">
                    Login or signup using your email, password, confirm
                    password, and OTP verification.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
                  <p className="text-sm font-semibold">
                    Secure user authentication UI for your ecommerce project.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="mx-auto max-w-md">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-black text-gray-900">
                    {activeTab === "login"
                      ? "Login Account"
                      : "Create Account"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {activeTab === "login"
                      ? "Enter your email and password to login."
                      : "Enter details, then verify with OTP."}
                  </p>
                </div>

                {/* Tabs */}
                <div className="mb-8 grid grid-cols-2 rounded-2xl bg-orange-50 p-1">
                  <button
                    type="button"
                    onClick={() => handleTabChange("login")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                      activeTab === "login"
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                        : "text-orange-700 hover:bg-orange-100"
                    }`}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange("signup")}
                    className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                      activeTab === "signup"
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                        : "text-orange-700 hover:bg-orange-100"
                    }`}
                  >
                    Signup
                  </button>
                </div>

                {/* Login Form */}
                {activeTab === "login" && (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="Enter email address"
                        className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-medium text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Password
                      </label>

                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Enter password"
                        className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-medium text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-orange-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-600/25 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {loading ? "Please wait..." : "Login"}
                    </button>
                  </form>
                )}

                {/* Signup Form */}
                {activeTab === "signup" && (
                  <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        placeholder="Enter email address"
                        className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-medium text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Password
                      </label>

                      <input
                        type="password"
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        placeholder="Create password"
                        className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-medium text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        name="confirm_password"
                        value={signupData.confirm_password}
                        onChange={handleSignupChange}
                        placeholder="Confirm password"
                        className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-medium text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                      />

                      {signupData.confirm_password &&
                        signupData.password !==
                          signupData.confirm_password && (
                          <p className="mt-2 text-xs font-semibold text-red-500">
                            Password and confirm password do not match.
                          </p>
                        )}
                    </div>

                    {!showOtpField && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm font-black text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {otpLoading ? "Sending OTP..." : "Send OTP"}
                      </button>
                    )}

                    {showOtpField && (
                      <>
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-bold text-gray-700">
                              OTP
                            </label>

                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={otpLoading}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 disabled:opacity-60"
                            >
                              {otpLoading ? "Sending..." : "Resend OTP"}
                            </button>
                          </div>

                          <input
                            type="text"
                            name="otp"
                            value={signupData.otp}
                            onChange={handleSignupChange}
                            placeholder="Enter 6 digit OTP"
                            maxLength={6}
                            className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-medium text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-2xl bg-orange-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-600/25 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                          {loading ? "Please wait..." : "Create Account"}
                        </button>
                      </>
                    )}
                  </form>
                )}

                <p className="mt-8 text-center text-sm text-gray-500">
                  {activeTab === "login"
                    ? "Do not have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() =>
                      handleTabChange(
                        activeTab === "login" ? "signup" : "login"
                      )
                    }
                    className="font-bold text-orange-600 hover:text-orange-700"
                  >
                    {activeTab === "login" ? "Signup" : "Login"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
};

export default Login;