
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs'; // Ensure bcryptjs is installed or use node crypto
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { authConfig } from './auth.config';

// We need to split config to use it in middleware (edge compatible)
// But Drizzle sqlite might not be edge compatible easily. 
// For this environment, we are not on Vercel Edge, so it's fine.

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const { username, password } = credentials as any;

                const user = await db.query.users.findFirst({
                    where: eq(users.username, username),
                });

                if (!user) return null;

                const passwordsMatch = await compare(password, user.password);
                if (passwordsMatch) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.username, // Using username as email for NextAuth standard field if needed, or just custom
                        role: user.role,
                    };
                }
                return null;
            },
        }),
    ],
});
