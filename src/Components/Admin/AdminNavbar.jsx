import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
} from "@nextui-org/react";
import { AcmeLogo } from "../CommonComponents/AcmeLogo";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
 
export default function AdminNavbar() {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
 
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };
 
    const handleLogout = () => {
        console.log("Logout clicked");
        navigate("/login"); // Redirect to login page after logout
    };
 
    return (
        <Navbar shouldHideOnScroll position="sticky">
            <NavbarBrand>
                <a href="/">
                    <AcmeLogo className="mr-2" />
                </a>
                <p className="font-bold text-inherit text-sm">
                    <a href="/">MERCURIAL</a>
                </p>
            </NavbarBrand>
            <NavbarContent className="flex gap-4" justify="end">
                <NavbarItem>
                    <Button
                        onClick={handleLogout}
                        className="rounded-full border-none relative p-6 transition-colors duration-300" // Increased padding for size
                        variant="ghost"
                        style={{ fontSize: '1.1rem' }} // Increased font size
                    >
                        Logout
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        onClick={toggleTheme}
                        className="rounded-full border-none relative p-4 transition-colors duration-300"
                        variant="ghost"
                    >
                        <img
                            src="moon.png"
                            alt="Light Mode"
                            className={`absolute transition-opacity duration-500 ${
                                theme === "dark" ? "opacity-0" : "opacity-100"
                            } w-7 h-7`}
                        />
                        <img
                            src="sun.png"
                            alt="Dark Mode"
                            className={`absolute transition-opacity duration-500 ${
                                theme === "dark" ? "opacity-100" : "opacity-0"
                            } w-8 h-8`}
                        />
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
 