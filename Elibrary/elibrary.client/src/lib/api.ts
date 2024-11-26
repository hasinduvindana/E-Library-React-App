import { Book } from "@/types/index";
import { useNavigate } from "react-router-dom";

const base_url = import.meta.env.VITE_SERVER_URL;

const handleUnauthorized = (response: Response, navigate: ReturnType<typeof useNavigate>) => {
  if (response.status === 401) {
    navigate("/login");
    throw new Error("Unauthorized");
  }
};

export const registerUser = async (user: {
  email: string;
  password: string;
}): Promise<void> => {
  const response = await fetch(`${base_url}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to register user");
  }
};

export const loginUser = async (user: {
  email: string;
  password: string;
}): Promise<void> => {
  const response = await fetch(`${base_url}/login?useCookies=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to login user");
  }
};


export const logoutUser = async (): Promise<void> => {
  const response = await fetch(`${base_url}/api/account/signout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to logout user");
  }
};

export const fetchBooks = async (navigate: ReturnType<typeof useNavigate>): Promise<Book[]> => {
  const response = await fetch(`${base_url}/api/books`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  handleUnauthorized(response, navigate);
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return response.json();
};

export const addBook = async (book: {
  title: string;
  author: string;
  description: string;
}): Promise<Book> => {
  const response = await fetch(`${base_url}/api/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error("Failed to add book");
  }
  return response.json();
};

export const updateBook = async (
  id: number | string,
  book: { title: string; author: string; description: string }
): Promise<Book | void> => {
  const response = await fetch(`${base_url}/api/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(book),
  });
  if (response.status === 204) {
    return; // No content to return
  }
  if (!response.ok) {
    throw new Error("Failed to update book");
  }
  return response.json();
};

export const deleteBook = async (id: number | string): Promise<void> => {
  const response = await fetch(`${base_url}/api/books/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 204) {
    return; // No content to return
  }
  if (!response.ok) {
    throw new Error("Failed to delete book");
  }
};
