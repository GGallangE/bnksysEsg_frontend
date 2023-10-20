// src/main/frontend/src/setProxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/api',{
      target: 'https://api.odcloud.kr',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/main',{
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};

