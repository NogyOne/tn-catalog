import type { APIRoute } from "astro";
import { ProductsController } from "../../../server/controllers/productsController";
import { empty } from "@prisma/client/runtime/library";

const productsController = new ProductsController();

export const GET: APIRoute = async ({ request, params }) => {
  try {
    const slug = params.slug ?? "";
    const product = await productsController.handleGetProductBySlug(slug);

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const slug = params.slug ?? "";
    const product = await productsController.handleUpdateProduct(request, slug);

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};
