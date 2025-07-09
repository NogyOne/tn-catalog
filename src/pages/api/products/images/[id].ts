import type { APIRoute } from "astro";
import { ProductsController } from "@server/controllers/productsController";

const productsController = new ProductsController();

export const DELETE: APIRoute = async ({ params, url }) => {
  try {
    const imageId = params.id;
    const imagePath = url.searchParams.get("path");
    if (!imageId || !imagePath) {
      return new Response(JSON.stringify({ error: "Faltan parámetros" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const product = await productsController.handleDeleteProductImage(
      imageId,
      imagePath
    );

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }
};
