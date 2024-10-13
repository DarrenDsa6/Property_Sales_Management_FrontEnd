import React, { useState } from "react";
import { useTheme } from "next-themes"; // Import the theme hook
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { AcmeLogo } from "../CommonComponents/AcmeLogo"; // Ensure this import is correct
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react"; // Importing necessary NextUI components

export default function Login() {
  const { theme } = useTheme(); // Get the current theme
  const navigate = useNavigate(); // Initialize navigation

  // State variables
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // Initially no user type selected
  const [errors, setErrors] = useState({ userName: "", password: "", global: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to validate form inputs
  const validateForm = () => {
    let valid = true;
    let userNameError = "";
    let passwordError = "";

    if (!userName) {
      userNameError = "Username is required";
      valid = false;
    }

    if (!password) {
      passwordError = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      passwordError = "Password must be at least 6 characters long";
      valid = false;
    }

    setErrors({ userName: userNameError, password: passwordError });
    return valid;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors((prevErrors) => ({ ...prevErrors, global: "" })); // Reset global error

      try {
        // Determine endpoint based on user type
        const endpoint =
          userType === "Customer"
            ? "https://localhost:5002/api/users/login"
            : "https://localhost:5001/api/brokers/login";

           

        // Make API call to login
        const response = await axios.post(endpoint, { UserName: userName, Password: password });
        // Store user ID in local storage
        localStorage.setItem('userId', response.data.userId);

        console.log("Login successful", response.data);
        navigate("/dashboard"); // Navigate to dashboard on successful login
      } catch (error) {
        console.error(
          "Login failed:",
          error.response ? error.response.data.Message : error.message
        );
        setErrors((prevErrors) => ({
          ...prevErrors,
          global: "Invalid username or password", // Set global error message
        }));
      } finally {
        setIsSubmitting(false); // Reset submitting state
      }
    }
  };

  return (
    <div
      className={`max-h-screen flex justify-center items-center ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
      style={{
        backgroundImage:
          theme === "dark"
            ? "url('/assets/hero-background-dark.jpg')" // Background image for dark theme
            : "url('/assets/hero-background-light.jpg')", // Background image for light theme
      }}
    >
      <Card
        className={`w-full max-w-sm shadow-lg rounded-lg hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 border-2 ${theme === "dark" ? "bg-black text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}`}
      >
        <CardHeader className="flex flex-col items-center">
          <AcmeLogo className="mb-4" /> {/* Acme logo component */}
          <h2 className="text-2xl font-bold">Login to your account</h2>
        </CardHeader>
        <CardBody>
          {errors.global && <div className="text-red-600">{errors.global}</div>} {/* Global error message */}

          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} // Update username state
              status={errors.userName ? "error" : "default"} // Set input status based on errors
              className="mb-4"
            />
            {errors.userName && <div className="text-red-600">{errors.userName}</div>} {/* Username error message */}

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              status={errors.password ? "error" : "default"} // Set input status based on errors
              className="mb-4"
            />
            {errors.password && <div className="text-red-600">{errors.password}</div>} {/* Password error message */}

            {/* NextUI Dropdown for user type selection */}
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="w-full">
                  {userType || "Select User"} {/* Placeholder text for dropdown */}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User Type"
                onAction={(key) => setUserType(key)} // Set userType based on selected item
              >
                <DropdownItem key="Customer">Customer</DropdownItem>
                <DropdownItem key="Broker">Broker</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button type="submit" disabled={isSubmitting} className="w-full mt-4 mb-2">
              {isSubmitting ? "Signing in..." : "Sign in"} {/* Conditional button text */}
            </Button>
          </form>

          {/* Uncomment the below code to enable forgot password functionality */}
          {/* <div className="text-center mt-4">
            <a href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div> */}
        </CardBody>
      </Card>
    </div>
  );
}










