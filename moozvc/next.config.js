/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/.netlify/functions/:path*',
        destination: '/.netlify/functions/:path*'
      }
    ]
  }
}

module.exports = nextConfig
