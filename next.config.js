/** @type {import('next').NextConfig} */
const nextConfig = {
  
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_for_development'
  }
}

module.exports = nextConfig
