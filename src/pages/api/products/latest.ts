import type { APIRoute } from "astro";
import { ProductsController } from "@server/controllers/productsController";

const productsController = new ProductsController();

export const GET: APIRoute = async () => {
  try {
    const products = await productsController.handleGetFeaturedProducts();
    return new Response(JSON.stringify(products), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};
