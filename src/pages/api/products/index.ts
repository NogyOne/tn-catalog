import type { APIContext, APIRoute } from "astro";
import { ProductsController } from "../../../server/controllers/productsController";
import { requireAuth } from "../../../middlewares/authMiddleware";

const productsController = new ProductsController();

export const GET: APIRoute = async (context: APIContext) => {
  try {
    const { url } = context;
    const searchParams = new URL(url).searchParams;

    const current = parseInt(searchParams.get("current") ?? "");
    const take = parseInt(searchParams.get("take") ?? "");

    const products = await productsController.handleGetProducts(current, take);
    return new Response(JSON.stringify(products), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to Get Products" }));
  }
};

export const POST: APIRoute = requireAuth(async (context, user) => {
  try {
    // Tu controlador mantiene su interfaz original, solo pasas el request
    const product = await productsController.handlePostProducts(
      context.request
    );

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create product",
        code: "PRODUCT_CREATION_ERROR",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});

export const PATCH: APIRoute = requireAuth(async (context) => {
  try {
    const { url } = context.request;
    const searchParams = String(new URL(url).searchParams.get("id"));
    const productDeleted = await productsController.handleDeleteProduct(
      searchParams || ""
    );

    return new Response(JSON.stringify(productDeleted), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
});
