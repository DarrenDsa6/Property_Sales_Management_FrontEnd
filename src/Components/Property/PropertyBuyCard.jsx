import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useTheme } from "next-themes"; // Import useTheme
 
export default function Admin() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false); // State to control Buy modal
  const [selectedPropertyId, setSelectedPropertyId] = useState(null); // To track selected property ID
  const [selectedProperty, setSelectedProperty] = useState(null); // To store the selected property details
 
  const { theme } = useTheme(); // Get the current theme
 
  const statusMapping = {
    0: "Active",
    1: "Pending",
    2: "Sold",
    3: "Rented",
  };
 
  const propertyTypeMapping = {
    0: "Sale",
    1: "Rent",
  };
 
  const statusColorMapping = {
    Active: "bg-green-500 text-white",
    Pending: "bg-yellow-500 text-black",
    Sold: "bg-red-500 text-white",
    Rented: "bg-blue-500 text-white",
  };
 
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const userId = localStorage.getItem("userId");
 
        if (!userId) {
          setError("User not logged in. Please log in.");
          return;
        }
        const response = await fetch(
          `https://localhost:5005/api/property/${userId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchProperties();
  }, []);
 
  const handleBuyClick = (propertyId) => {
    const property = properties.find((p) => p.propertyId === propertyId);
    setSelectedProperty(property); // Set the selected property details
    setSelectedPropertyId(propertyId); // Set the selected property ID
    setIsBuyModalOpen(true); // Open the modal
  };
 
  const handlePurchase = async () => {
    const userId = localStorage.getItem("userId");
 
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
 
    const transactionData = {
      propertyId: selectedPropertyId,
      buyerId: parseInt(userId),
      transactionDate: new Date(),
      amount: parseFloat(selectedProperty.price),
      status: 0,
    };
 
    console.log("Transaction Payload:", transactionData);
 
    try {
      // Send transaction details to the backend
      const response = await fetch(
        "https://localhost:5003/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        }
      );
 
      if (!response.ok) {
        throw new Error("Failed to process the transaction.");
      }
 
      // Call the backend to create a Razorpay order
      const orderResponse = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(selectedProperty.price), // Amount in INR
          currency: 'INR',
        }),
      });
 
      const order = await orderResponse.json();
 
      // Initialize Razorpay using the global Razorpay object
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,// Use your key ID here
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: 'Mercurial',
        description: 'Purchase Description',
        order_id: order.id, // Order ID created by Razorpay
        handler: function (response) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          // You can further handle payment confirmation and updating your database here
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Customer Address',
        },
        theme: {
          color: '#F37254',
        },
      };
 
      const razorpay = new window.Razorpay(options); // Use window.Razorpay
      razorpay.open();
 
      razorpay.on('payment.failed', function (response) {
        alert(`Payment failed! Reason: ${response.error.description}`);
      });
 
    } catch (error) {
      console.error("Error processing the transaction:", error);
      alert("Failed to complete the purchase. Please try again.");
    } finally {
      setIsBuyModalOpen(false); // Close the modal
    }
  };
 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
 
  return (
    <div
      className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
      style={{ paddingTop: "2px", paddingLeft: "44px", margin: "2px" }}
    >
      {properties.length > 0 ? (
        properties.map(
          ({
            propertyId,
            propertyType,
            location,
            pincode,
            price,
            description,
            propertyImages,
            status,
            amenities,
            brokerId,
          }) => (
            <Card
              key={propertyId}
              className={`py-4 max-w-lg mx-auto shadow-lg rounded-lg hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 border-2
                ${theme === "dark" ? "border-gray-700" : "border-gray-300"}
                ${
                  theme === "dark"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`} // Dynamic styles
              bordered
            >
              {/* Card Header */}
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-full ${statusColorMapping[statusMapping[status]]}`}
                  style={{ zIndex: 10 }}
                >
                  {statusMapping[status]}
                </div>
 
                {/* Image occupying half of the card */}
                <div className="relative w-full">
                  {propertyImages && propertyImages.length > 0 ? (
                    <Image
                      alt="Property"
                      className="object-cover w-full h-64 rounded-t-xl z-0"
                      src={`https://localhost:5005${propertyImages[0].filePath}`}
                    />
                  ) : (
                    <div>No Images Available</div>
                  )}
                </div>
              </CardHeader>
 
              <CardBody className="py-2">
                {/* Sale/Rent and Price row */}
                <div className="flex justify-between items-center">
                  {statusMapping[status] === "Active" ? (
                    <p className="text-lg font-bold">
                      {propertyTypeMapping[propertyType]}
                    </p>
                  ) : (
                    <div className="w-full" /> // Filler div for spacing
                  )}
                  <p className="text-base font-semibold">Rs.{price}</p>
                </div>
 
                {/* Location and Pincode row */}
                <div className="flex justify-between items-center mt-2">
                  <p className="mt-2 text-lg font-bold">{location}</p>
                  <small className="text-sm">Pincode: {pincode}</small>
                </div>
 
                {/* Description and Amenities */}
                <div className="text-left mt-2">
                  <p className="text-base">{description}</p>
                  <p className="mt-2 text-base">{amenities}</p>
                </div>
 
                {/* Buy Button */}
                <div className="mt-4 flex justify-center">
                  <Button
                    color="success"
                    type="submit"
                    onClick={() => handleBuyClick(propertyId)}
                    shadow
                    auto
                  >
                    Buy
                  </Button>
                </div>
              </CardBody>
            </Card>
          )
        )
      ) : (
        <div className="text-center text-gray-300 col-span-full">
          No properties available
        </div>
      )}
 
      {/* Modal for Purchase Confirmation */}
      <Modal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Confirm Purchase</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to proceed with the purchase?</p>
            <p>Selected Property: {selectedProperty?.description}</p>
            <p>Price: Rs.{selectedProperty?.price}</p>
          </ModalBody>
          <ModalFooter>
            <Button auto flat onClick={() => setIsBuyModalOpen(false)} color="danger" variant="bordered">
              Cancel
            </Button>
            <Button auto onClick={handlePurchase} color="primary">
              Confirm Purchase
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}