import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * GitHub OAuth授权函数
 * @param {Object} data - 登录数据
 * @param {string} [data.login] - 提供用于登录和授权应用程序的特定账户【可选】
 * @param {string} data.state - 状态参数，用于安全校验
 */
export function githubOauthAuthorize(data) {
  const query = new URLSearchParams({
    ...data,
    client_id: "Ov23lijpqQICMvstcj85", // 使用实际的GitHub Client ID
    scope: "user:email,read:user", // 添加必要的scope，包括读取用户信息
    allow_signup: "true",
  });
  const url = `https://github.com/login/oauth/authorize?${query.toString()}`;
  window.location.href = url; // 直接跳转
}

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 模拟邮箱登录
    console.log("Login with:", email);

    // 创建一个模拟用户并存储到localStorage
    const user = {
      name: "邮箱用户",
      email: email,
      picture: null,
      auth_provider: "email",
    };
    localStorage.setItem("user", JSON.stringify(user));

    // 假设登录成功，跳转到仪表板
    navigate("/dashboard");
  };

  const handleGithubLogin = () => {
    // 使用githubOauthAuthorize函数实现GitHub登录
    githubOauthAuthorize({
      state: Math.random().toString(36).substring(2), // 生成随机state用于安全校验
    });
  };

  return (
    <div className="flex h-screen w-full">
      {/* 左侧面板 */}
      <div className="flex-1 bg-primary flex flex-col justify-center items-center relative overflow-hidden text-white">
        <div className="text-3xl font-bold leading-tight text-center mb-5 z-10 max-w-[80%]">
          Change, Query, Secure, Govern all Databases in a Single Place
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-3/5 z-0 opacity-90"
          style={{
            backgroundImage:
              "url('https://bytebase.com/static/images/login-illustration.svg')",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        ></div>
      </div>

      {/* 右侧面板 */}
      <div className="w-1/2 max-w-xl flex flex-col justify-center items-center px-10">
        <div className="mb-8 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">Bytebase</span>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          欢迎
        </h2>
        <p className="mb-8 text-center text-gray-600">
          登录 Bytebase 以继续使用 Bytebase Hub。
        </p>

        <div className="w-full max-w-md">
          {/* GitHub登录按钮 - 使用直接的OAuth流程 */}
          <button
            onClick={handleGithubLogin}
            className="w-full py-3 px-4 mb-3 flex items-center justify-center border border-gray-300 rounded text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#333">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            继续使用 GitHub
          </button>

          {/* 分隔线 */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">或</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* 邮箱表单 */}
          <form onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-600">
                电子邮件地址*
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 mb-6 bg-primary text-white font-semibold rounded hover:bg-primary-dark transition-colors"
            >
              继续
            </button>
          </form>

          {/* 注册链接 */}
          <div className="mt-6 text-center text-sm text-gray-600">
            没有账户?{" "}
            <a href="#register" className="text-primary hover:underline ml-1">
              注册
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
