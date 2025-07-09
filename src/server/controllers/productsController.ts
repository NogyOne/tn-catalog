import type { CreateProductDTO, Product } from "../../types/product";
import { ProductService } from "../services/productService";

const productService = new ProductService();

export class ProductsController {
  handleGetProducts = async (current: number, take: number) => {
    try {
      if (!current || !take) throw new Error("Pagination is Required.");
      const products = await productService.getAllProducts({ current, take });
      return products;
    } catch (error) {
      throw error;
    }
  };

  handleGetFeaturedProducts = async () => {
    try {
      const products = await productService.getFeaturedProducts();
      return products;
    } catch (error) {
      throw new Error("[ERROR CONTROLLER]: " + error);
    }
  };

  handleGetProductBySlug = async (slug: string) => {
    try {
      if (!slug) throw new Error("Slug is needed for load this page.");
      const product = await productService.getProductBySlug(slug);
      return product;
    } catch (error) {
      throw new Error("Error fetching product:");
    }
  };

  handlePostProducts = async (req: Request) => {
    const formData = await req.formData();
    const imageFiles: Buffer[] = [];
    const fileNames: string[] = [];

    const createProductDTO: CreateProductDTO = {
      name: formData.get("name") as string,
      model: formData.get("model") as string,
      description: formData.get("description") as string,
      notes: formData.get("notes") as string,
      normalPrice: parseFloat(formData.get("normalPrice") as string),
      discount: parseFloat(formData.get("discount") as string),
      caseMaterial: formData.get("caseMaterial") as string,
      braceletMaterial: formData.get("braceletMaterial") as string,
      strapMaterial: formData.get("strapMaterial") as string,
      caseSize: parseFloat(formData.get("caseSize") as string),
      waterResistance: formData.get("waterResistance") as string,
      movement: formData.get("movement") as string,
      cristal: formData.get("cristal") as string,
      stock: parseInt(formData.get("stock") as string, 10),
    };

    const files = formData.getAll("images") as File[];

    if (files.length) {
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        imageFiles.push(buffer);
        fileNames.push(file.name);
      }
    }

    return await productService.postProduct(
      createProductDTO,
      imageFiles,
      fileNames
    );
  };

  handleDeleteProduct = async (productId: string) => {
    if (!productId) throw new Error("[PRODUCT CONTROLLER ERROR]: ID NEEDED");
    try {
      const productDeleted = await productService.deleteProduct(productId);
      return productDeleted;
    } catch (error) {
      throw new Error(`[PRODUCT CONTROLLER ERROR]: ${error}`);
    }
  };

  handleDeleteProductImage = async (imageId: string, imagePath: string) => {
    if (!imageId || !imagePath) {
      throw new Error("[PRODUCT CONTROLLER ERROR]: ID and Path are needed");
    }
    try {
      const imageDeleted = await productService.deleteProductImage(
        imageId,
        imagePath
      );
      return imageDeleted;
    } catch (error) {
      throw new Error(`[PRODUCT CONTROLLER ERROR]: ${error}`);
    }
  };

  handleUpdateProduct = async (req: Request, slug: string) => {
    const formData = await req.formData();
    const imageFiles: Buffer[] = [];
    const fileNames: string[] = [];

    const product = {
      name: formData.get("name") as string,
      model: formData.get("model") as string,
      description: formData.get("description") as string,
      notes: formData.get("notes") as string,
      normalPrice: parseFloat(formData.get("normalPrice") as string),
      discount: parseFloat(formData.get("discount") as string),
      caseMaterial: formData.get("caseMaterial") as string,
      braceletMaterial: formData.get("braceletMaterial") as string,
      strapMaterial: formData.get("strapMaterial") as string,
      caseSize: parseFloat(formData.get("caseSize") as string),
      waterResistance: formData.get("waterResistance") as string,
      movement: formData.get("movement") as string,
      cristal: formData.get("cristal") as string,
      stock: parseInt(formData.get("stock") as string, 10),
    };

    const files = formData.getAll("images") as File[];

    if (files.length) {
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        imageFiles.push(buffer);
        fileNames.push(file.name);
      }
    }

    return await productService.updateProduct(slug, product);
  };
}
