const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['eciapply.s3.amazonaws.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/fellowship/2023',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
