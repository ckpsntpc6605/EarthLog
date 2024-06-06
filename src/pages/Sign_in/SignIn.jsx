import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSignUp, handleLogin } from "../../utils/firebase";
import useAuthListener from "../../utils/hooks/useAuthListener";
import SignUp from "../SignUp/SignUp";

export default function SignIn() {
  const currentUserToken = localStorage.getItem("currentUser");
  const [signinOrSignup, setSigninOrSignup] = useState("signin");
  const [signinValue, setSigninValue] = useState({
    email: "",
    password: "",
  });
  const [isLoginSuccess, setIsLoginSuccess] = useState(null);
  const currentUser = useAuthListener();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser.token === currentUserToken) {
      navigate("/");
    }
  }, [currentUser, currentUserToken]);

  async function onSigninClick(e) {
    const { email, password } = signinValue;
    try {
      const userToken = await handleLogin(e, email, password);
      if (userToken === false) {
        setIsLoginSuccess(false);
        return;
      }

      setIsLoginSuccess(true);
      localStorage.setItem("currentUser", JSON.stringify(userToken));

      navigate("/");

      const timer = setTimeout(() => {
        setIsLoginSuccess(null);
      }, 3000);

      return () => clearTimeout(timer);
    } catch (e) {
      console.error("Sign in failed with error:", e.message);
      setIsLoginSuccess(false);
    }
  }

  async function handleSigninWithTestAccount(e) {
    try {
      const user = await handleLogin(e, "phil2@gmail.com", "000000");
      if (user === false) {
        setIsLoginSuccess(false);
        return;
      }

      setIsLoginSuccess(true);
      localStorage.setItem("currentUser", JSON.stringify(user));

      navigate("/");

      const timer = setTimeout(() => {
        setIsLoginSuccess(null);
      }, 3000);

      return () => clearTimeout(timer);
    } catch (e) {
      console.error("Sign in failed with error:", e.message);
      setIsLoginSuccess(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setSigninValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <main className="h-full w-full p-3 flex flex-col justify-center items-center bg-[linear-gradient(rgba(40,40,40,0.6),rgba(40,40,40,0.6)),url('/images/starry_sky.png')] bg-cover bg-center relative">
      {isLoginSuccess !== null && (
        <div className="toast toast-top z-50 toast-center animate__animated animate__fadeOutLeft animate__delay-2s">
          {isLoginSuccess ? (
            <div className="alert bg-green-100 border-green-100 text-green-600 font-semibold shadow-lg">
              <span>登入成功</span>
            </div>
          ) : (
            <div className="alert bg-red-200 border-red-200 text-red-600 font-semibold shadow-lg">
              <span>登入失敗...</span>
            </div>
          )}
        </div>
      )}

      <img
        src="/images/logo.png"
        id="logo"
        alt="logo"
        className="absolute top-[10%] w-[400px] h-[200px]"
      />
      {signinOrSignup === "signin" ? (
        <div className="w-1/2 bg-[rgba(0,0,0,0.1)] ring-1 ring-gray-400 flex flex-col rounded-xl p-5 backdrop-blur-md">
          <div>
            <button
              className="text-white text-2xl mb-1"
              onClick={() => setSigninOrSignup("signin")}
            >
              登入 /
            </button>
            <button
              className="text-[#52616B] text-md mb-1"
              onClick={() => setSigninOrSignup("signup")}
            >
              註冊
            </button>
          </div>

          <div className="divider divider-neutral my-1"></div>
          <form className="space-y-2">
            <label className="input input-sm input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                id="email"
                type="email"
                className="grow"
                value={signinValue.email}
                placeholder="Email"
                name="email"
                onChange={(e) => handleInputChange(e)}
                required
              />
            </label>
            <label className="input input-sm input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="grow"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={signinValue.password}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </label>

            {isLoginSuccess !== false ? (
              <div className="h-[24px]"></div>
            ) : (
              <p className="text-red-500">帳號或密碼錯誤</p>
            )}

            <button
              className="btn btn-sm mt-2 btn-active w-full"
              onClick={onSigninClick}
            >
              登入
            </button>
          </form>
        </div>
      ) : (
        <SignUp setSigninOrSignup={setSigninOrSignup} />
      )}
      <button
        className="text-text_secondary mt-2 hover:text-white"
        onClick={(e) => handleSigninWithTestAccount(e)}
      >
        以測試帳號登入
      </button>
      <a href="/landing" className="absolute bottom-20 text-xl text-[#bfc7d1]">
        關於EarthLog
      </a>
    </main>
  );
}
