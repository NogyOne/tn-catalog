import { prisma } from "../../db/dbConnection";
import type { Product, CreateProductDTO } from "../../types/product";
import Sharp from "sharp";
import { supabase } from "../../db/supabaseClient";

export class ProductService {
  getAllProducts = async ({
    current,
    take,
  }: {
    current: number;
    take: number;
  }) => {
    const skip = (current - 1) * take;

    try {
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            isDeleted: false,
          },
          skip: skip,
          take,
          include: {
            images: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.product.count({
          where: {
            isDeleted: false,
          },
        }),
      ]);

      const totalPages = Math.ceil(total / take);

      return {
        data: products,
        meta: {
          total,
          current,
          totalPages,
          hasNextPage: current < totalPages,
          hasPrevPage: current > 1,
        },
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  };

  getFeaturedProducts = async () => {
    try {
      const products = await prisma.product.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          images: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      return {
        data: products,
        meta: {
          total: 5,
        },
      };
    } catch (error) {
      throw new Error(`[ERROR SERVICE]: Failed to fetch products - ${error}`);
    }
  };

  getProductBySlug = async (slug: string): Promise<Product> => {
    try {
      const product = await prisma.product.findUnique({
        where: {
          slug,
        },
        include: {
          images: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

      return product as Product;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw new Error("Failed to fetch product");
    }
  };

  postProduct = async (
    data: CreateProductDTO,
    files: Buffer[],
    fileNames: string[]
  ): Promise<Product> => {
    let uploadedImagePaths: string[] = [];

    try {
      let slug = `${data.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}-${data.model
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}`;

      let discountPrice = 0;
      if (data.discount && data.discount > 0) {
        discountPrice = data.normalPrice * (1 - data.discount / 100);
      }

      const { imageUrls, imagePaths } = await this.uploadProductImages(
        files,
        fileNames
      );
      uploadedImagePaths = imagePaths;

      const createdProduct = await prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            ...data,
            discountPrice,
            slug,
          },
        });
        if (imageUrls.length) {
          const imageData = imageUrls.map((url, i) => ({
            url,
            alt: `${data.name}-image-${i + 1}`,
            productId: product.id,
            order: i + 1,
            path: uploadedImagePaths[i],
          }));

          await tx.image.createMany({
            data: imageData,
          });
        }
        return product;
      });

      const productComplete = await prisma.product.findUnique({
        where: { id: createdProduct.id },
        include: {
          images: true,
        },
      });

      return productComplete as Product;
    } catch (error) {
      console.error("Error creating product:", error);

      if (uploadedImagePaths.length > 0) {
        await supabase.storage
          .from("products-image-bucket")
          .remove(uploadedImagePaths);
      }

      throw new Error("Failed to create product: " + error);
    }
  };

  uploadProductImages = async (files: Buffer[], fileNames: string[]) => {
    const optimizedImages = await Promise.all(
      files.map((file) =>
        Sharp(file)
          // .resize(300, 300, { fit: "inside" })
          .webp({ quality: 80 })
          .toBuffer()
      )
    );

    const uniqueFilenames = fileNames.map((fileName) =>
      `${fileName}-${Date.now()}`.toLowerCase()
    );

    const uploads: string[] = [];
    const paths: string[] = [];

    for (let i = 0; i < optimizedImages.length; i++) {
      const { data: uploadData, error } = await supabase.storage
        .from("products-image-bucket")
        .upload(uniqueFilenames[i], optimizedImages[i]);

      if (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image");
      }

      paths.push(uploadData.path); //Sirve para borrarla despues en caso de que algo salga mal

      const { data: urlData } = supabase.storage
        .from("products-image-bucket")
        .getPublicUrl(uploadData.path);

      uploads.push(urlData.publicUrl);
    }

    return { imageUrls: uploads, imagePaths: paths };
  };

  deleteProductImage = async (imageId: string, imagePath: string) => {
    try {
      await prisma.$transaction(async (tx) => {
        // Delete the image from the database
        await tx.image.delete({
          where: { id: imageId },
        });

        // Remove the image from Supabase storage
        const { error } = await supabase.storage
          .from("products-image-bucket")
          .remove([imagePath]);

        if (error) {
          throw new Error(
            `Failed to delete image from storage: ${error.message}`
          );
        }

        return true;
      });
    } catch (error) {
      throw new Error(
        `[PRODUCT SERVICE FAILED]: DELETING IMAGE ${imageId} -ERROR: ${error}`
      );
    }
  };

  deleteProduct = async (productId: string) => {
    try {
      const productDeleted = await prisma.product.update({
        where: { id: productId },
        data: {
          isDeleted: true,
        },
      });

      return productDeleted;
    } catch (error) {
      throw new Error(
        `[PRODUCT SERVICE FAILED]: DELETING PRODUCT ${productId} -ERROR: ${error}`
      );
    }
  };

  updateProduct = async (slug: string, data: CreateProductDTO) => {
    try {
      console.log("Updating product with slug:", slug);
      let discountPrice = 0;
      if (data.discount && data.discount > 0) {
        discountPrice = data.normalPrice * (1 - data.discount / 100);
      }
      const productUpdated = await prisma.product.update({
        where: { slug },
        data: {
          ...data,
          discountPrice,
          slug: slug,
        },
      });

      return productUpdated as Product;
    } catch (error) {
      throw new Error(
        `[PRODUCT SERVICE FAILED]: UPDATING PRODUCT ${slug} -ERROR: ${error}`
      );
    }
  };
}
