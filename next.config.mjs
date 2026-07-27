/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Route handlers go through middleware, which buffers the request body
  // with a 10MB default limit. PDF catalog uploads can be large, so lift
  // that ceiling to match the upload route's MAX_SIZE (100MB).
  experimental: {
    proxyClientMaxBodySize: "100mb",
  },
}

export default nextConfig
