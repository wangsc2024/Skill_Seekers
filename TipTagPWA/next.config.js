/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages
  output: 'export',

  // Required for static export
  images: {
    unoptimized: true,
  },

  // Disable trailing slashes for cleaner URLs
  trailingSlash: false,

  // React strict mode for better debugging
  reactStrictMode: true,

  // Skip type checking during build (faster builds, run separately)
  typescript: {
    ignoreBuildErrors: false,
  },

  // Skip ESLint during build (run separately)
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
