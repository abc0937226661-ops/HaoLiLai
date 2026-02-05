
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/admin/login',
    },
    providers: [], // Providers added in auth.ts
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminPage = nextUrl.pathname.startsWith('/admin');

            // Allow access to login page
            if (nextUrl.pathname.startsWith('/admin/login')) {
                if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', nextUrl));
                return true;
            }

            if (isAdminPage) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
