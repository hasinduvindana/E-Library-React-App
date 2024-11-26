import { Toaster } from "@/components/ui/toaster"; // Ensure this file exists
import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css"; // Make sure index.css is in the correct path
import AuthLayout from "./routes/AuthLayout";
import Books from "./routes/Books";
import Login from "./routes/Login";
import NotFound from "./routes/NotFound";
import Register from "./routes/Register";
import Root from "./routes/root";

// Define the routes using createBrowserRouter
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />, // Root layout
    },
    {
        element: <AuthLayout />, // Nested layout for auth routes
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ],
    },
    {
        path: "/books",
        element: <Books />, // Books route
    },
    {
        path: "*",
        element: <NotFound />, // Catch-all route
    },
]);

// Initialize React Query client
const queryClient = new QueryClient();

// Create the root and render the app
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster /> {/* Notification system */}
        </QueryClientProvider>
    </StrictMode>
);
