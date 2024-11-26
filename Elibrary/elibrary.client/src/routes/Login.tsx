import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Import the updated CSS file

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: (user: { email: string; password: string }) => {
            return loginUser(user);
        },
        onSuccess: () => {
            toast({
                title: "Login Successful",
                description: "You have successfully logged in.",
            });
            navigate("/books");
        },
        onError: (error) => {
            console.error("Error during login:", error);
            toast({
                title: "Error",
                description:
                    "Login failed. Please check your credentials and try again.",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };

    return (

        <div className="register-container">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Login</h1>
                <p className="text-sm text-pink-300 mb-4">
                    Welcome back to <span className="text-pink-500">E-Library</span>
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-white">
                                Password
                            </Label>
                            <Link
                                to="/forgot-password"
                                className="ml-auto text-sm underline text-pink-500"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full mt-4 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                </div>
            </form>
            <div className="mt-6 text-center text-sm text-black">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline text-pink-500">
                    Register
                </Link>
            </div>
        </div>

    );
};

export default Login;
