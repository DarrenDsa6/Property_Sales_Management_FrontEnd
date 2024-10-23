import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { useTheme } from "next-themes";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate from react-router-dom


export default function Navigationbar({ aboutRef }) {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Navbar shouldHideOnScroll position="sticky">
      <NavbarBrand>
        <a href="/">
          <AcmeLogo className="mr-2" />
        </a>
        <p className="font-bold text-inherit text-sm ">
          <a href="/">MERCURIAL</a>
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem isActive>
          <Link href="/" aria-current="page">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/signup">Sign Up</Link>
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
