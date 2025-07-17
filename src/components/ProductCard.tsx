import React from "react";
import type { Product } from "../types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article
      aria-label={`Producto-${product.name}`}
      className="group relative overflow-hidden border-2 border-theme-gold bg-theme-gold-light transition-all hover:shadow-[5px_5px_0px_#dbc9a5]"
    >
      <a href={`/catalog/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Ver detalles de {product.name}</span>
      </a>

      <div className="aspect-square overflow-hidden bg-[#f9f7f2]">
        <img
          src={product.images.length > 0 ? product.images[0].url : ""}
          alt={`imagen de ${product.name}`}
          loading="eager"
          width={300}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 vintage-image"
        />
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-[#263959]/60 font-serif">
          {product.model}
        </p>
        <p className="mt-1 font-serif text-sm md:text-lg font-medium text-[#263959] italic">
          {product.name}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div
            className={`text-[#263959] font-serif flex gap-3 ${
              product.normalPrice === 0 ? "text-sm font-light" : ""
            }`}
          >
            {product.notes ? (
              <p className="text-base md:text-lg font-serif text-gray-500 italic">
                {product.notes}
              </p>
            ) : (
              <>
                <p
                  className={`text-base md:text-lg font-serif text-gray-500 italic ${
                    product.discount > 0 ? "line-through" : ""
                  }`}
                >
                  ${product.normalPrice}
                </p>
                {product.discount > 0 && (
                  <p className="font-serif text-red-500">
                    ${product.discountPrice}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="h-px w-12 bg-[#dbc9a5]"></div>
        </div>
      </div>
    </article>
  );
}
