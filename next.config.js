/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true
    },
    env: {
        API_KEY: process.env.API_KEY,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
    }
};

module.exports = nextConfig;
