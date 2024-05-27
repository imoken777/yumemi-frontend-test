/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath:
    process.env.GITHUB_REPOSITORY !== undefined
      ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}`
      : '',
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  env: {
    RESAS_API_KEY: process.env.RESAS_API_KEY,
  },
};
