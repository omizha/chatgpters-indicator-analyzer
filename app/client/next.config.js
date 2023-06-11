/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: true,
  },
  async rewrites() {
    return [
      {
        destination: 'http://127.0.0.1:3000/:path*',
        source: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
