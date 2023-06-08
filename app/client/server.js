const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = process.env.PORT || 8080;
const app = next({ dev: true });
const handle = app.getRequestHandler();

const apiDomain = 'http://127.0.0.1:3000';
app
  .prepare()
  .then(() => {
    const server = express();

    server.use(
      '/api/csv',
      createProxyMiddleware({
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        on: {
          proxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('origin', apiDomain);
          },
        },
        target: `${apiDomain}/csv`,
      }),
    );

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready http://localhost:${port}`);
    });
  })
  .catch(console.error);
