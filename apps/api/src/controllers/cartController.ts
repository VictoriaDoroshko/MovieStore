import { Request, Response } from "express";
import { db } from "../firebaseConfig";
import { Cart, CartItem, Movie } from "../types";

const calculateTotal = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const { cartId, movieId } = req.body;

  try {
    const movieRef = db.collection("newMovies").doc(movieId);
    const movieDoc = await movieRef.get();

    if (!movieDoc.exists) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const movieData = movieDoc.data() as Movie;
    const cartRef = db.collection("carts").doc(cartId);
    const cartDoc = await cartRef.get();

    if (cartDoc.exists) {
      const cartData = cartDoc.data() as Cart;
      const existingItem = cartData.items.find((item) => item.id === movieId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartData.items.push({ ...movieData, quantity: 1 });
      }
      await cartRef.update({ items: cartData.items });
    } else {
      await cartRef.set({
        cartId,
        items: [{ ...movieData, quantity: 1 }],
      });
    }

    res.status(200).json({ message: "Item added to cart successfully!" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const { cartId } = req.params;

  try {
    const cartRef = db.collection("carts").doc(cartId);
    const doc = await cartRef.get();

    if (!doc.exists) {
      await cartRef.set({
        cartId,
        items: [],
      });
    }

    const cartData = ((await cartRef.get()).data() as Cart) || {
      cartId,
      items: [],
    };

    const totalAmount = calculateTotal(cartData.items);

    res.status(200).json({
      ...cartData,
      totalAmount,
    });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const removeFromCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { cartId, movieId } = req.params;

  try {
    const cartRef = db.collection("carts").doc(cartId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    const cartData = cartDoc.data() as Cart;

    const itemToRemove = cartData.items.find((item) => item.id === movieId);

    if (!itemToRemove) {
      res.status(404).json({ error: "Movie not found in cart" });
      return;
    }

    if (itemToRemove.quantity > 1) {
      itemToRemove.quantity -= 1;
    } else {
      const updatedItems = cartData.items.filter((item) => item.id !== movieId);
      await cartRef.update({ items: updatedItems });
      res.status(200).json({ message: "Item removed from cart successfully!" });
      return;
    }

    await cartRef.update({ items: cartData.items });
    res.status(200).json({ message: "Item quantity decreased successfully!" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const removeCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { cartId } = req.params;

  try {
    const cartRef = db.collection("carts").doc(cartId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    await cartRef.delete();

    res.status(200).json({ message: "Cart cleared successfully!" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};
