import { Request, Response } from "express";
import { db } from "../firebaseConfig";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("categories").get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(categories);
  } catch (error) {
    console.error(
      "We encountered an issue while trying to retrieve the categories data:",
      error,
    );
    res.status(500).json({ error: "Server error" });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const categoryRef = await db.collection("categories").doc(id);
    const doc = await categoryRef.get();

    const moviesRef = db
      .collection("newMovies")
      .where("categoryId", "array-contains", id);
    const moviesSnapshot = await moviesRef.get();

    const movies = moviesSnapshot.docs.map((movieDoc) => ({
      id: movieDoc.id,
      ...movieDoc.data(),
    }));

    const category = { id: doc.id, ...doc.data(), movies };
    res.status(200).json(category);
  } catch (error) {
    console.error(
      "We encountered an issue while trying to retrieve the category:",
      error,
    );
    res.status(500).json({ error: "Server error" });
  }
};

export const getMoviesByCategorySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { slug } = req.params;

  try {
    const categorySnapshot = await db
      .collection("categories")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (categorySnapshot.empty) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const categoryDoc = categorySnapshot.docs[0];
    const categoryId = categoryDoc.id;

    const moviesRef = db
      .collection("newMovies")
      .where("categoryId", "array-contains", categoryId);
    const moviesSnapshot = await moviesRef.get();

    const movies = moviesSnapshot.docs.map((movieDoc) => ({
      id: movieDoc.id,
      ...movieDoc.data(),
    }));

    const response = {
      category: {
        id: categoryId,
        name: categoryDoc.data().name,
        slug: categoryDoc.data().slug,
      },
      movies,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(
      "We encountered an issue while trying to retrieve the movies by category slug:",
      error,
    );
    res.status(500).json({ error: "Server error" });
  }
};
