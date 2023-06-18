const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? 'https://the-game.kevinmccartney.dev' : undefined,
};

module.exports = nextConfig;
