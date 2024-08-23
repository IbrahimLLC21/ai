/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net"],
  },
  i18n, // This will use the i18n configuration from next-i18next.config.js
  // Webpack configuration removed
  // Other Next.js config options can be added here
};

module.exports = nextConfig;
