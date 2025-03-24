import type { APIRoute } from 'astro';

export const get: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      port: process.env.PORT || '3000',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
