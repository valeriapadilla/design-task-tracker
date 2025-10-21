import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch(error) {
                        // Ignorar silenciosamente - las cookies se escribirán en API Routes
                        if (process.env.NODE_ENV === 'development') {
                            console.log('Cannot set cookies in Server Component:', error);
                        }
                    }
                },
            },
        }
    );
}

export const supabase = createClient();