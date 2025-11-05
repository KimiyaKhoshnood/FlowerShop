/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
  })
  
  module.exports = withPWA({
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "flowershop-bggx.onrender.com",
          port: "",
          pathname: "/media/product_images/**",
        },
      ],
    },
  });
