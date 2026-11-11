import { Request, Response } from "express";
import { db } from "../firebaseConfig";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("newMovies").get();
    const movies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(movies);
  } catch (error) {
    console.error(
      "We encountered an issue while trying to retrieve the movies data:",
      error,
    );
    res.status(500).json({ error: "Server error" });
  }
};

export const getMovieById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const movieRef = db.collection("newMovies").doc(id);
    const doc = await movieRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const movie = { id: doc.id, ...doc.data() };
    res.status(200).json(movie);
  } catch (error) {
    console.error(
      "We encountered an issue while trying to retrieve the movie:",
      error,
    );
    res.status(500).json({ error: "Server Error" });
  }
};

export const getMovieBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { slug } = req.params;
  try {
    const snapshot = await db
      .collection("newMovies")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snapshot.empty) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const movie = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };
    res.status(200).json(movie);
  } catch (error) {
    console.error(
      "We encountered an issue while trying to retrieve the movie:",
      error,
    );
    res.status(500).json({ error: "Server Error" });
  }
};
