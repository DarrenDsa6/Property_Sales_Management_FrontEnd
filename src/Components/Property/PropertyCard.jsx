import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import PropertyActions from "./PropertyActions.jsx";
import { useTheme } from "next-themes";
 
export default function Admin() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const { theme } = useTheme();
 
  // Status mappings
  const statusMapping = {
    0: "Active",
    1: "Pending",
    2: "Sold",
    3: "Rented",
  };
 
  // Property type mappings
  const propertyTypeMapping = {
    0: "Sale",
    1: "Rent",
  };
 
  // Status color mappings
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
 
  // Handle deletion of a property
  const handleDelete = (propertyId) => {
    setProperties((prevProperties) =>
      prevProperties.filter((property) => property.propertyId !== propertyId)
    );
  };
 
  // Handle property edit - update the property details including propertyType
  const handleEdit = (propertyId, updatedProperty) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.propertyId === propertyId
          ? { ...property, ...updatedProperty } // Update the edited property
          : property
      )
    );
  };
 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
 
  return (
    <div className="container mx-auto pr-11 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
          }) => (
            <Card
              key={propertyId}
              className={`py-4 max-w-lg mx-auto shadow-lg rounded-lg hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 border-2
                ${theme === "dark" ? "border-gray-700" : "border-gray-300"}
                ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`} // Dynamic styles
              bordered
            >
              {/* Card Header */}
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-full ${statusColorMapping[statusMapping[status]]}`}
                  style={{ zIndex: 10 }}
                >
                  {statusMapping[status]} {/* Render the status based on mapping */}
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
 
              {/* Card Body */}
              <CardBody className="py-2">
                {/* Sale/Rent and Price row */}
                <div className="flex justify-between items-center">
                  {/* Left-aligned Sale/Rent text */}
                  <p className="text-lg font-bold">
                    {propertyTypeMapping[propertyType]} {/* Correctly display Sale/Rent */}
                  </p>
                  {/* Right-aligned Price */}
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
 
                {/* Property Actions */}
                <div className="mt-4">
                  <PropertyActions
                    propertyId={propertyId}
                    onEdit={handleEdit} // Pass handleEdit function to update the property
                    onDelete={handleDelete} // Pass handleDelete function to remove the property
                  />
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
    </div>
  );
}