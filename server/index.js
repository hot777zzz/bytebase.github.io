const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, "../build")));

// GitHub OAuth配置
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// GitHub认证回调处理
app.post("/api/github/callback", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "缺少授权码" });
  }

  try {
    // 使用授权码交换访问令牌
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: "获取访问令牌失败" });
    }

    // 使用访问令牌获取用户信息
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    // 获取用户邮箱信息
    let userEmails = [];
    try {
      const emailResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `token ${access_token}`,
          },
        }
      );
      userEmails = emailResponse.data;
    } catch (error) {
      console.warn("获取用户邮箱失败", error.message);
    }

    // 提取主要邮箱
    let primaryEmail = null;
    if (userEmails.length > 0) {
      const primary = userEmails.find((email) => email.primary);
      primaryEmail = primary ? primary.email : userEmails[0].email;
    }

    // 构建用户信息响应
    const userData = {
      github_id: userResponse.data.id,
      github_username: userResponse.data.login,
      name: userResponse.data.name || userResponse.data.login,
      email: primaryEmail || userResponse.data.email,
      avatar_url: userResponse.data.avatar_url,
      auth_provider: "github",
    };

    return res.json({
      success: true,
      user: userData,
      access_token,
    });
  } catch (error) {
    console.error("GitHub OAuth处理失败:", error.message);

    // 返回详细错误信息，便于调试
    return res.status(500).json({
      error: "认证处理失败",
      details: error.message,
      response: error.response ? error.response.data : null,
    });
  }
});

// 处理前端路由
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
