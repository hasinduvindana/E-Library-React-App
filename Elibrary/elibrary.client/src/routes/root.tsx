import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/logo.png"; // Import your logo
import "./styles.css"; // Import the CSS file

export default function Root() {
    return (
        <div>
            <header className="flex justify-center items-center p-4">
                {/* Center-Aligned Logo */}
                <img src={logo} alt="E-Library Logo" className="logo-large" />
            </header>

            <main>
                {/* Hero Section */}
                <h1>E-Library Management System</h1>
                <p>
                    Streamline your library operations and provide a seamless reading experience for your users.
                </p>
                <Link to="/Register">
                    <Button>Explore Now</Button>
                </Link>

                {/* Features Section */}
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="feature-card">
                        <h3>📚 Digital Catalog</h3>
                        <p>
                            Access and manage your entire collection of books in a digital catalog. Enhance efficiency and reduce manual effort.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3>🔖 User-Friendly Management</h3>
                        <p>
                            Simplify your workflows with intuitive tools to add, update, or remove books and track lending activities with ease.
                        </p>
                    </div>
                </div>
            </main>

            {/* Decorative Shape */}
            <div className="decorative-shape"></div>
        </div>
    );
}
