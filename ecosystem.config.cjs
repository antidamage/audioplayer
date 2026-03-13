module.exports = {
  apps: [
    {
      name: "audioplayer",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
