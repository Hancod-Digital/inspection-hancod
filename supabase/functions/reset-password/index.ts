// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
// import { serve } from "https://deno.land/std@0.136.0/http/server.ts";

// const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
// const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// const adminClient = createClient(supabaseUrl, serviceRoleKey, {
//   auth: { autoRefreshToken: false, persistSession: false },
// });

// serve(async (req) => {
//   const origin = req.headers.get("origin");
//   const corsHeaders = {
//     ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
//     "Access-Control-Allow-Headers":
//       "authorization, x-client-info, apikey, content-type",
//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//     "Vary": "Origin",
//   };

//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   if (req.method !== "POST") {
//     return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
//   }

//   try {
//     const authorization = req.headers.get("Authorization");
//     const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
//     if (!accessToken) {
//       return jsonResponse(
//         { error: "Authentication required" },
//         401,
//         corsHeaders,
//       );
//     }

//     // Only let an authenticated user update their own password.
//     const { data: { user }, error: userError } = await adminClient.auth.getUser(
//       accessToken,
//     );
//     if (userError || !user) {
//       return jsonResponse(
//         { error: "Invalid authentication" },
//         401,
//         corsHeaders,
//       );
//     }

//     const body = await req.json();
//     const id = typeof body?.id === "string" ? body.id : "";
//     const newPassword = typeof body?.newPassword === "string"
//       ? body.newPassword
//       : "";
//     if (!id || !newPassword) {
//       return jsonResponse({ error: "Invalid data" }, 400, corsHeaders);
//     }
//     if (id !== user.id) {
//       return jsonResponse(
//         { error: "You can only update your own password" },
//         403,
//         corsHeaders,
//       );
//     }

//     const { data, error } = await adminClient.auth.admin.updateUserById(id, {
//       password: newPassword,
//     });

//     if (error) {
//       return jsonResponse({ error: error.message }, 400, corsHeaders);
//     }
//     return jsonResponse({ user: data.user }, 200, corsHeaders);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Invalid request";
//     return jsonResponse({ error: message }, 400, corsHeaders);
//   }
// });

// function jsonResponse(
//   body: unknown,
//   status: number,
//   headers: Record<string, string>,
// ) {
//   return new Response(JSON.stringify(body), {
//     status,
//     headers: { ...headers, "Content-Type": "application/json" },
//   });
// }
