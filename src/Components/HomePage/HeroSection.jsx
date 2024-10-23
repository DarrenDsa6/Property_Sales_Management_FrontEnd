import { useTheme } from "next-themes"; // Import the hook to get the current theme
import { Button } from "@nextui-org/react";
import MapComponent from "./MapComponent";

export default function HeroSection() {
  const { theme } = useTheme(); // Get the current theme

  return (
    <section
      className={`relative text-white min-h-screen flex flex-col items-center justify-center ${
        theme === "dark" ? "bg-black " : "bg-white"
      }`} // Conditional background based on theme
      style={{
        backgroundImage: theme === "dark"
          ? "url('/assets/hero-background-dark.jpg')"  // Dark mode background
          : "url('/assets/hero-background-light.jpg')"  // Light mode background
      }}
    >
      {/* Content container for centered content */}
      <div className="flex flex-col items-center justify-center text-center px-4 space-y-8">
        {/* Text Block */}
        <div className={`flex flex-col items-center justify-center text-center space-y-4 ${theme === "dark" ? "text-white" : "text-black"} `}>
          <h1 className="text-5xl font-bold">
            Welcome to Mercurial
          </h1>
          <p className="text-md max-w-xl whitespace-pre-wrap">
            
            Discover the best real estate properties with ACME. 
            Whether you're looking to buy or sell, we are here to help you every step of the way.
            
            Join Us!

          </p>
        </div>

        {/* Map Section */}
        <div className="w-full max-w-4xl h-80 bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 duration-700">
          <MapComponent />
        </div>

        {/* Button */}
        <div className="pb-5">
        <Button
          className="rounded-lg px-6 py-3 bg-primary transition-colors duration-300 hover:scale-105 mb-8  border-none relative"
          size="lg"
          color="primary"
          variant="solid"
        >
        <a href="/login">Get Started</a>
        </Button>
        </div>
      </div>
    </section>
  );
}
