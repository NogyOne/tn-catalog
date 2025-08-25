import { useState, useEffect } from "react";
import type { Product } from "../types/product";
import ProductCard from "@components/ProductCard";
import Loader from "@components/Loader";

export default function ProductsCatalog() {
  const baseURL = import.meta.env.PUBLIC_API_URL;
  const current = 1;
  const take = 10;
  const [data, setData] = useState<Product[]>([]);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${baseURL}/api/products?current=${current}&take=${take}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const text = await response.text();
        if (!text.trim()) {
          throw new Error("El servidor devolvió una respuesta vacía");
        }

        const result = JSON.parse(text);
        setData(result.data ?? []);
        setMeta(result.meta ?? {});
      } catch (error) {
        console.error("Error loading products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [current]);

  return (
    <section className="py-36 md:py-40 h-auto">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="text-center md:text-left animate-fade-in-right">
            <h1 className="font-serif text-3xl font-light text-theme-blue italic">
              Nuestro Catálogo
            </h1>
            <div className="mt-2 h-[2px] w-24 bg-theme-gold mx-auto md:mx-0"></div>
          </div>
          {/* <div className="relative max-w-xs mx-auto md:mx-0">
        <input
          type="search"
          placeholder="Buscar relojes..."
          className="pl-10 border-2 border-theme-gold focus-visible:ring-theme-blue bg-[#f9f7f2]"
        />
      </div>  */}
        </div>
        {!loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-5 w-full h-full animate-fade-in-up">
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
        ) : (
          <Loader />
        )}
      </div>
    </section>
  );
}
