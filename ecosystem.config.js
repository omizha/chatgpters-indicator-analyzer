module.exports = {
  apps: [
    {
      env: {
        PORT: 8080,
      },
      name: 'client',
      script: 'yarn workspace client start',
      time: true,
    },
    {
      name: 'server',
      script: 'yarn workspace server start:prod',
      time: true,
    },
  ],
};
