import { EmailController } from "@/server/controllers/emailController";
import type { APIRoute, APIContext } from "astro";

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { type, data } = await request.json();
    const emailController = new EmailController();
    const response = await emailController.handleSendEmail(type, data);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
