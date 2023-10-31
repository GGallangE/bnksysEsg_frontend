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
    createProxyMiddleware('/spring',{
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/1611000',{
      target: 'https://apis.data.go.kr',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/fapi',{
      target: 'https://bizno.net/api',
      changeOrigin: true,
    })
  );
};

