import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import "./Register.css"; // Import the updated CSS file

const passwordSchema = z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase character")
    .regex(/[a-z]/, "Password must contain at least one lowercase character")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one non-alphanumeric character");

const registerSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<string | null>(null);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const validation = registerSchema.safeParse({ email, password, confirmPassword });

        if (!validation.success) {
            setErrors(validation.error.errors.map((err) => err.message).join(", "));
            return;
        }

        setErrors(null);
        alert("Registration successful!"); // Placeholder for success feedback
    };

    return (
        <div
            className="h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/src/Register.png')" }}
        >
            <div className="register-container">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Register</h1>
                    <p className="text-sm text-pink-200">
                        Get started with <span className="text-pink-500 font-semibold">E-Library</span>
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
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
                            <Label htmlFor="password">Password</Label>
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
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="text-sm text-pink-300 mt-4">
                            <p>Password must contain:</p>
                            <ul className="list-disc list-inside">
                                <li>At least 6 characters</li>
                                <li>One uppercase character</li>
                                <li>One lowercase character</li>
                                <li>One digit</li>
                                <li>One special character</li>
                            </ul>
                        </div>
                        {errors && (
                            <div className="text-sm text-red-500">
                                <p>{errors}</p>
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
                        >
                            Register
                        </Button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline text-pink-400 hover:text-pink-500">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
