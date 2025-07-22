import React, { useState, useEffect } from "react";
import type { Product } from "../types/product";
import EditIcon from "@/components/icons/react/EditIcon";
import TrashIcon from "@/components/icons/react/TrashIcon";
import RedirectIcon from "@/components/icons/react/RedirectIcon";
import Loader from "@components/Loader.tsx";
import ActionButton from "@components/ActionButton";

export default function ProductsTable() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    current: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.PUBLIC_API_URL;

  const handleNextPage = () => {
    setCurrent(current + 1);
    setLoading(true);
  };

  const handlePrevPage = () => {
    setCurrent(current - 1);
    setLoading(true);
  };

  const handleDeleteProduct = async (id: string) => {
    const response = await fetch(`${baseURL}/api/products?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert(`PRODUCT ${id} HAS BEEN DELETED`);
      fetchProducts();
    }
  };

  const fetchProducts = async () => {
    const take = 5;
    const response = await fetch(
      `${baseURL}/api/products?current=${current}&take=${take}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { data, meta } = await response.json();
    setData(data);
    setMeta(meta);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [current]);

  return (
    <section className="w-full mx-auto px-30 pt-5 h-full">
      <div className="flex items-center justify-between mb-10 px-6 md:flex-row flex-col">
        <h1 className="font-serif text-3xl font-light italic uppercase">
          Products
        </h1>
        <ActionButton
          action={() => (window.location.href = "/admin/products/new")}
          label={"Add Product"}
          nestedStyles="px-4 py-2"
        />
      </div>
      <div className="my-auto h-auto shadow-md ">
        <table className="w-full mx-auto text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="[&>tr>th]:px-6 [&>tr>th]:py-3 text-xs bg-theme-blue uppercase text-theme-gold font-serif font-light">
            <tr>
              <th scope="col"> Image </th>
              <th scope="col"> Product name </th>
              <th scope="col">Notes</th>
              <th scope="col"> Model </th>
              <th scope="col"> Stock </th>
              <th scope="col"> Price </th>
              <th scope="col"> Discount </th>
              <th scope="col"> Final Price </th>
              <th scope="col"> Actions </th>
            </tr>
          </thead>
          <tbody>
            {!loading ? (
              data.map((product: Product) => (
                <tr
                  className="group [&>td]:px-6 [&>td]:py-2 odd:bg-white even:bg-gray-50 border-b border-gray-200 hover:bg-theme-gold-light"
                  key={product.id}
                >
                  <td className="size-30">
                    <img
                      className="w-full h-24 object-cover rounded-lg"
                      src={product?.images[0].url}
                      alt={`imagen-de-${product.name}`}
                    />
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-2 font-medium whitespace-nowrap group-hover:text-theme-blue "
                  >
                    <a
                      className="flex items-center gap-2"
                      href={`/catalog/${product.slug}`}
                    >
                      {product.name} <RedirectIcon />
                    </a>
                  </td>
                  <td>{product.notes ? product.notes : "---"}</td>
                  <td> {product.model} </td>
                  <td> {product.stock} </td>
                  <td> ${product.normalPrice} </td>
                  <td> {product.discount}% </td>
                  <td>
                    $
                    {product.discountPrice > 0
                      ? product.discountPrice
                      : product.normalPrice}{" "}
                  </td>
                  <td className="space-x-3 ">
                    <ActionButton
                      label={<EditIcon />}
                      action={() =>
                        (window.location.href = `/admin/products/${product.slug}`)
                      }
                    />
                    <ActionButton
                      label={<TrashIcon />}
                      action={() => handleDeleteProduct(product.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <Loader nestedStyles="fixed bg-white/50 z-50" />
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-10 flex gap-4 w-full items-end justify-end">
        <ActionButton
          label={"Prev"}
          action={handlePrevPage}
          disable={!meta.hasPrevPage}
        />
        <ActionButton
          label={"Next"}
          action={handleNextPage}
          disable={!meta.hasNextPage}
        />
      </div>
    </section>
  );
}
