/** @type {import('next').NextConfig} */
const nextConfig = {
    //reactStrictMode: false,
    //output: 'export',
    eslint: {
        // 忽略构建时的 ESLint 检查
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['pub-0d9c38b43b124ec5812062e96217fa17.r2.dev'],
    },
    //rewrites
};

export default nextConfig;
