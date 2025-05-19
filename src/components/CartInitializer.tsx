"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCartItems } from "@/redux/features/cart/cartSlice";

const CartInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        dispatch(setCartItems(JSON.parse(storedCartItems)));
      }
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default CartInitializer;
