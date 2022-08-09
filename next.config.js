const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['vaf.s3.amazonaws.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/vaf/2022',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
