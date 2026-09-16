/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'seqptsvnihezsfbnpkpz.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
        domains: ['localhost', '127.0.0.1'],
    },
};

export default nextConfig;
