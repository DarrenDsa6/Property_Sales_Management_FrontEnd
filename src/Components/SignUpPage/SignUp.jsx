import React, { useState } from "react";
import { useTheme } from "next-themes"; // Import the theme hook
import axios from "axios"; // Ensure axios is imported for API calls
import { useNavigate } from "react-router-dom"; // For navigation
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
  DropdownItem
} from "@nextui-org/react"; // Importing necessary NextUI components

export default function SignUp() {
  const { theme } = useTheme(); // Get the current theme
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // New state for username
  const [adhar, setAdhar] = useState(""); // New state for Adhar Card
  const [pincode, setPincode] = useState(""); // New state for Pincode
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState(""); // New state for Contact Number
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [customerType, setCustomerType] = useState("select");
  const [errors, setErrors] = useState({
    name: "",
    username: "", // New error state for username
    adhar: "", // New error state for Adhar
    pincode: "", // New error state for Pincode
    address: "",
    contactNumber: "", // New error state for Contact Number
    password: "",
    confirmPassword: "",
    customerType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic form validation logic
  const validateForm = () => {
    let valid = true;
    let formErrors = { ...errors };

    // Name validation
    if (!name) {
      formErrors.name = "Name is required";
      valid = false;
    } else {
      formErrors.name = "";
    }

    // Username validation
    if (!username) {
      formErrors.username = "Username is required";
      valid = false;
    } else {
      formErrors.username = "";
    }

    // Adhar validation
    if (!adhar) {
      formErrors.adhar = "Adhar card is required";
      valid = false;
    } else if (!/^\d{12}$/.test(adhar)) {
      formErrors.adhar = "Adhar card must be 12 digits";
      valid = false;
    } else {
      formErrors.adhar = "";
    }

    // Pincode validation
    if (!pincode) {
      formErrors.pincode = "Pincode is required";
      valid = false;
    } else if (!/^\d{6}$/.test(pincode)) {
      formErrors.pincode = "Pincode must be 6 digits";
      valid = false;
    } else {
      formErrors.pincode = "";
    }

    // Address validation
    if (!address) {
      formErrors.address = "Address is required";
      valid = false;
    } else {
      formErrors.address = "";
    }

    // Contact number validation
    if (!contactNumber) {
      formErrors.contactNumber = "Contact number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(contactNumber)) {
      formErrors.contactNumber = "Contact number must be 10 digits";
      valid = false;
    } else {
      formErrors.contactNumber = "";
    }

    // Password validation
    if (!password) {
      formErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long";
      valid = false;
    } else {
      formErrors.password = "";
    }

    // Confirm password validation
    if (confirmPassword !== password) {
      formErrors.confirmPassword = "Passwords do not match";
      valid = false;
    } else {
      formErrors.confirmPassword = "";
    }

    // Customer Type validation
    if (customerType === "select") {
      formErrors.customerType = "Customer type is required";
      valid = false;
    } else {
      formErrors.customerType = "";
    }

    setErrors(formErrors);
    return valid;
  };

  // Handle form submission and send to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const apiEndpoint =
        customerType === "Broker" ? "https://localhost:5001/api/brokers" : "https://localhost:5002/api/users";

      const payload = {
        Name: name,
        UserName: username,
        AadhaarCard: adhar,
        Pincode: pincode,
        Address: address,
        ContactNumber: contactNumber,
        Password: password,
      };

      try {
        const response = await axios.post(apiEndpoint, payload);
        console.log("Registration successful:", response.data);
        // Navigate to another page on success, e.g., a dashboard or login page
        navigate("/login");
      } catch (error) {
        console.error("Error during registration:", error);
      } finally {
        setIsSubmitting(false);
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
            ? "url('/assets/hero-background-dark.jpg')" // Dark mode background
            : "url('/assets/hero-background-light.jpg')", // Light mode background
      }}
    >
      <Card
        className={`w-full max-w-5xl shadow-lg rounded-lg hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 border-2 ${
          theme === "dark" ? "bg-black text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"
        }`}
      >
        <CardHeader className="flex flex-col items-center">
          <AcmeLogo className="mb-2" />
          <h2 className="text-2xl font-bold">Create your account</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 40%', minWidth: '200px' }}>
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                status={errors.name ? "error" : "default"}
              />
              {errors.name && <div className="text-red-600">{errors.name}</div>}
            </div>

            <div style={{ flex: '1 1 40%', minWidth: '200px' }}>
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                status={errors.username ? "error" : "default"}
              />
              {errors.username && <div className="text-red-600">{errors.username}</div>}
            </div>

            <div style={{ flex: '1 1 40%', minWidth: '200px' }}>
              <Input
                label="Aadhaar Card"
                value={adhar}
                onChange={(e) => setAdhar(e.target.value)}
                status={errors.adhar ? "error" : "default"}
              />
              {errors.adhar && <div className="text-red-600">{errors.adhar}</div>}
            </div>

            <div style={{ flex: '1 1 40%', minWidth: '200px' }}>
              <Input
                label="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                status={errors.pincode ? "error" : "default"}
              />
              {errors.pincode && <div className="text-red-600">{errors.pincode}</div>}
            </div>

            <div style={{ flex: '1 1 40%', minWidth: '200px' }}>
              <Input
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                status={errors.address ? "error" : "default"}
              />
              {errors.address && <div className="text-red-600">{errors.address}</div>}
            </div>

            <div style={{ flex: '1 1 40%', minWidth: '200px' }}>
              <Input
                label="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                status={errors.contactNumber ? "error" : "default"}
              />
              {errors.contactNumber && <div className="text-red-600">{errors.contactNumber}</div>}
            </div>

            <div style={{ flex: '1 1 40%', minWidth: '200px' }}>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                status={errors.password ? "error" : "default"}
              />
              {errors.password && <div className="text-red-600">{errors.password}</div>}
            </div>

            <div style={{ flex: '1 1 40%', minWidth: '200px' }}>
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                status={errors.confirmPassword ? "error" : "default"}
              />
              {errors.confirmPassword && <div className="text-red-600">{errors.confirmPassword}</div>}
            </div>

            {/* Centered Dropdown for user type selection */}
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', flex: '1 1 40%', minWidth: '200px' }}>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="w-1/2">
                    {customerType === "select" ? "Select User" : customerType} {/* Placeholder text */}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={setCustomerType} // Update customer type state
                  aria-label="Customer Type"
                >
                  <DropdownItem key="Customer">Customer</DropdownItem>
                  <DropdownItem key="Broker">Broker</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              {errors.customerType && <div className="text-red-600">{errors.customerType}</div>}
            </div>

            {/* Centered Sign Up Button */}
            <div style={{ display: 'flex', justifyContent: 'center', flex: '1 1 100%', minWidth: '200px' }}>
              <Button type="submit" className="w-1/2 mb-2" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

