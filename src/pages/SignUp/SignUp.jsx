import { useState } from "react";
import { handleSignUp } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";

export default function SignUp({ setSigninOrSignup }) {
  const [signupFormValue, setSignupFormValue] = useState({
    signupUsername: "",
    signupEmail: "",
    signupPassword: "",
  });
  const [signupResultMsg, setSignupResultMsg] = useState("");
  const navigate = useNavigate();

  async function onSignupClick(e) {
    const { signupUsername, signupEmail, signupPassword } = signupFormValue;
    try {
      if (!signupFormValue.signupEmail) {
        setSignupResultMsg("信箱不得為空");
        return;
      } else if (!signupFormValue.signupUsername) {
        setSignupResultMsg("使用者名稱不得為空");
        return;
      } else if (!signupFormValue.signupPassword) {
        setSignupResultMsg("密碼不得為空");
        return;
      }
      const result = await handleSignUp(
        e,
        signupEmail,
        signupPassword,
        signupUsername
      );
      if (result) {
        navigate("/profile");
      } else {
        setSignupResultMsg("該信箱已註冊過");
      }

      const timer = setTimeout(() => {
        setSignupResultMsg("");
      }, 2000);
      return () => clearTimeout(timer);
    } catch (e) {
      console.log(e);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setSignupFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="w-1/2 bg-[rgba(0,0,0,0.1)] ring-1 ring-gray-400 flex flex-col p-5 rounded-lg max-w-sm backdrop-blur-md">
      <div>
        <button
          className="text-white text-2xl mb-1"
          onClick={() => setSigninOrSignup("signup")}
        >
          註冊 /
        </button>
        <button
          className="text-[#52616B] text-md"
          onClick={() => setSigninOrSignup("signin")}
        >
          登入
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
            type="email"
            className="grow"
            value={signupFormValue.signupEmail}
            placeholder="Email"
            name="signupEmail"
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
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Username"
            value={signupFormValue.signupUsername}
            name="signupUsername"
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
            type="password"
            className="grow"
            name="signupPassword"
            value={signupFormValue.signupPassword}
            onChange={(e) => handleInputChange(e)}
            placeholder="Password"
            required
          />
        </label>
      </form>
      {signupResultMsg !== "" ? (
        <p className="text-red-500">{signupResultMsg}</p>
      ) : (
        <div className="h-[24px]"></div>
      )}
      <button
        className="btn btn-sm mt-2 btn-active w-full"
        onClick={onSignupClick}
      >
        註冊
      </button>
    </div>
  );
}
