const sharedConfig = require('@infrastructure-monorepo/tailwind-config');
module.exports = {
  ...sharedConfig,
  // 覆盖内容配置以避免匹配node_modules
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ]
};