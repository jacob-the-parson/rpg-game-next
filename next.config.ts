import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Disable strict mode in development
  
  // External packages that should not be bundled
  serverExternalPackages: [],
  
  // Configure proper error reporting
  onDemandEntries: {
    // period in ms where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
};

export default nextConfig;
