const isProduction = process.env.VERCEL_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "img-src 'self' data: blob:",
          "media-src 'self'",
          "font-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
          "connect-src 'self'"
        ].join("; ")
      }
    ];

    if (isProduction) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload"
      });
    }

    return [{ source: "/(.*)", headers: securityHeaders }];
  }
};

export default nextConfig;
