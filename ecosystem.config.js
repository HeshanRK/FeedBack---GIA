module.exports = {
  apps: [
    {
      name: "feedback-4002",
      script: "./backend/server.js",
      cwd: "D:/Apps/FeedBack",
      env: {
        NODE_ENV: "production",
        PORT: 4002
      }
    }
  ]
};
