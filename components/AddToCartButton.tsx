"use client";
import { useState } from "react";

type CartProduct = { id: string; name: string; code: string; price: number };
export function AddToCartButton({ product }: { product: CartProduct }) {
  const [added, setAdded] = useState(false);
  function add() {
    const cart = JSON.parse(localStorage.getItem("plantcare-cart") ?? "[]") as Array<CartProduct & { quantity: number }>;
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += 1; else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("plantcare-cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("plantcare-cart")); setAdded(true); setTimeout(() => setAdded(false), 1200);
  }
  return <button onClick={add} className="rounded-full bg-emerald-900 px-4 py-2 text-xs font-bold text-white">{added ? "Added ✓" : "Add to cart"}</button>;
}
