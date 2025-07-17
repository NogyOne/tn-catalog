import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard.tsx";
import Loader from "@components/Loader.tsx";
import ActionButton from "@components/ActionButton.tsx";

export default function FeaturedProducts() {
  const baseURL = import.meta.env.BASE_URL && "http://localhost:4321";
  const [data, setData] = useState<Product[]>([]);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${baseURL}/api/products/latest`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        if (!text.trim()) {
          throw new Error("El servidor devolvió una respuesta vacía");
        }

        const result = JSON.parse(text);
        setData(result.data ?? []);
        setMeta(result.meta ?? {});
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError(error.message || "Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="pt-20 pb-20 bg-theme-gold-light">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="text-center md:text-left animate-fade-in-right animate-delay-300">
            <h2 className="font-serif text-3xl font-light text-theme-blue italic ">
              Nuestro Catálogo
            </h2>
            <div className="mt-2 h-[2px] w-24 bg-theme-gold mx-auto md:mx-0"></div>
          </div>
        </div>

        {!loading ? (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-5 w-full">
              {data?.length > 0 ? (
                data.map((product: Product, index) => (
                  <ProductCard product={product} key={index} />
                ))
              ) : (
                <p className="text-center text-lg font-light h-full">
                  No hay productos disponibles.
                </p>
              )}
            </div>
            <ActionButton
              action={() => (window.location.href = "/catalog")}
              label="Ver Mas"
              nestedStyles="px-4 py-2 mt-15"
            />

            {/* <button
        className="bg-theme-gold text-theme-blue border-2 border-theme-blue shadow-[2px_2px_0px_#2A3858] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all px-4 py-2 rounded-2xl cursor-pointer w-auto font-medium mt-15 mx-auto"
        type="button"
        onClick="window.location.href='/catalog'"
      >
        Ver Más
      </button> */}
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </section>
  );
}
