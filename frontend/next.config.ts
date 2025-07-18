// next.config.js
const path = require("path");

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
    };
    return config;
  },
};
