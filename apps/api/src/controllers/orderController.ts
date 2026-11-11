import { Request, Response } from "express";
import { firestore } from "firebase-admin";
import { db } from "../firebaseConfig";
import Timestamp = firestore.Timestamp;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  cartId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Timestamp;
}

const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      cartId,
      items,
      totalAmount,
    }: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
      cartId: string;
      items: OrderItem[];
      totalAmount: number;
    } = req.body;

    const invalidItems = items.filter(
      (item: OrderItem) =>
        !item.id ||
        !item.name ||
        !item.price ||
        item.price <= 0 ||
        !item.quantity ||
        item.quantity <= 0,
    );
    if (invalidItems.length > 0) {
      res
        .status(400)
        .json({ message: "Incorrect data about goods.", invalidItems });
      return;
    }

    const newOrder: Order = {
      firstName,
      lastName,
      phoneNumber,
      email,
      cartId,
      items,
      totalAmount,
      createdAt: Timestamp.fromDate(new Date()),
    };

    const ordersRef = db.collection("orders");
    const orderDoc = await ordersRef.add(newOrder);

    res.status(201).json({
      message: "Order created successfully!",
      orderId: orderDoc.id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server`s error. Try it later." });
  }
};

export default createOrder;
