import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 处理GitHub OAuth回调和用户信息获取
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // 从URL中获取code参数
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (code) {
          console.log("收到GitHub认证码:", code);
          console.log("State:", state);

          // 注意：在实际应用中，应该将code发送到后端进行处理
          // 后端需要使用client_secret交换access_token，并进行用户信息获取
          // 以下代码仅用于演示，实际项目中不应在前端直接处理token交换

          // 模拟从GitHub获取用户信息
          // 步骤1: 假设我们已经通过后端获取到了access_token
          const mockAccessToken =
            "mock_access_token_" + Math.random().toString(36).substr(2, 9);
          console.log("模拟获取到的访问令牌:", mockAccessToken);

          // 步骤2: 使用access_token获取用户信息
          // 在实际应用中，这应该在后端完成，以下为前端模拟实现
          try {
            // 实际项目中，以下请求应该由后端完成
            // const userResponse = await axios.get('https://api.github.com/user', {
            //   headers: {
            //     Authorization: `token ${accessToken}`
            //   }
            // });

            // 模拟从GitHub API获取的数据
            const mockUserData = {
              login: "github_user",
              id: 12345678,
              avatar_url:
                "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
              name: "GitHub用户",
              email: "github@example.com",
            };

            // 保存用户信息
            setUser({
              name: mockUserData.name || mockUserData.login,
              email: mockUserData.email || `${mockUserData.login}@github.com`,
              picture: mockUserData.avatar_url,
              auth_provider: "github",
              github_username: mockUserData.login,
              github_id: mockUserData.id,
            });

            // 实际项目中的完整流程示例（在后端实现）：
            /*
            1. 前端获取code，发送到后端
            2. 后端使用code+client_secret获取access_token:
               POST https://github.com/login/oauth/access_token
            3. 后端使用access_token获取用户信息:
               GET https://api.github.com/user
            4. 返回用户信息给前端
            */
          } catch (apiError) {
            console.error("获取GitHub用户信息失败:", apiError);
            throw new Error("获取GitHub用户信息失败");
          }
        } else {
          // 如果没有code参数，检查localStorage中是否已有用户信息
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            // 未登录状态，重定向回登录页
            navigate("/");
            return;
          }
        }
      } catch (err) {
        console.error("获取用户信息失败:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location, navigate]);

  // 当用户信息变化时，保存到localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const handleLogout = () => {
    // 清除用户信息
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">加载中...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        错误: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center px-5 py-4 bg-white shadow-sm h-16">
        <div className="flex items-center font-bold text-xl">
          <span className="text-primary">Bytebase</span>
        </div>
        <div className="flex items-center">
          {user && user.picture && (
            <img
              src={user.picture}
              alt="用户头像"
              className="w-9 h-9 rounded-full mr-3 border border-gray-200"
            />
          )}
          <span className="mr-4 font-medium">{user ? user.name : "用户"}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-colors"
          >
            退出登录
          </button>
        </div>
      </header>

      <div className="flex">
        {/* 侧边导航 */}
        <div className="w-60 bg-white h-[calc(100vh-4rem)] border-r border-gray-200 fixed top-16 left-0">
          <nav className="py-5">
            <a
              href="#dashboard"
              className="flex items-center px-5 py-2.5 text-primary bg-primary-light border-l-4 border-primary"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
              仪表板
            </a>

            <a
              href="#databases"
              className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              数据库
            </a>

            <a
              href="#projects"
              className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              项目
            </a>

            <a
              href="#members"
              className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              成员
            </a>

            <a
              href="#settings"
              className="flex items-center px-5 py-2.5 text-gray-600 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              </svg>
              设置
            </a>
          </nav>
        </div>

        {/* 主内容区域 */}
        <div className="ml-60 p-6 w-[calc(100%-15rem)]">
          <div className="bg-primary-light p-5 rounded-lg mb-6 border-l-4 border-primary">
            <h1 className="text-2xl font-bold mb-2">欢迎使用 Bytebase</h1>
            <p className="text-gray-700">
              Bytebase
              是一个专注于数据库开发协作的平台，帮助团队更高效地管理数据库变更。
            </p>
          </div>

          {user && (
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4">用户信息</h2>

              <div className="mb-3">
                <label className="inline-block w-24 font-medium text-gray-600">
                  用户名:
                </label>
                <span className="text-gray-800">{user.name}</span>
              </div>

              {user.github_username && (
                <div className="mb-3">
                  <label className="inline-block w-24 font-medium text-gray-600">
                    GitHub用户名:
                  </label>
                  <span className="text-gray-800">{user.github_username}</span>
                </div>
              )}

              <div className="mb-3">
                <label className="inline-block w-24 font-medium text-gray-600">
                  邮箱:
                </label>
                <span className="text-gray-800">{user.email}</span>
              </div>

              <div className="mb-3">
                <label className="inline-block w-24 font-medium text-gray-600">
                  认证方式:
                </label>
                <span className="text-gray-800">
                  {user.auth_provider === "github" ? "GitHub" : "邮箱"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
