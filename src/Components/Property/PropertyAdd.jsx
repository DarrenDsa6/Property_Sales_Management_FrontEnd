import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import React, { useState } from "react";

export default function PropertyAdd({ isOpen, onClose }) {
  const [propertyType, setPropertyType] = useState(0); // 0: Sale, 1: Rent
  const [location, setLocation] = useState("");
  const [pincode, setPincode] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  const [status, setStatus] = useState(0); // 0: Active, 1: Pending, 2: Sold, 3: Rented
  const [aadhaarCard, setAadhaarCard] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("PropertyType", propertyType);
    formData.append("Location", location);
    formData.append("Pincode", pincode);
    formData.append("Price", price);
    formData.append("Description", description);
    formData.append("Amenities", amenities);
    formData.append("Status", status);
    formData.append("AddedBy",localStorage.getItem("userId"));

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("ImageFiles", imageFiles[i]);
    }

    try {
      const response = await fetch("https://localhost:5010/api/Property/add", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add property");
      }

      const result = await response.json();
      setMessage("Property added successfully! ID: " + result.propertyId);
      resetForm();
      onClose(); // Close the modal after successful addition
      window.location.reload(); // Refresh the page
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setPropertyType(0);
    setLocation("");
    setPincode("");
    setPrice("");
    setDescription("");
    setAmenities("");
    setStatus(0);
    setAadhaarCard("");
    setImageFiles([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      css={{
        zIndex: 2000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200vh",
        marginTop: "0px",
      }}
    >
      <ModalContent
        css={{
          maxWidth: "900px", // Increased width for better layout
          width: "90%",
          margin: "0 auto",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 9999,
          position: "relative",
          top: "50px",
        }}
      >
        <ModalHeader
          css={{ marginBottom: "5px", marginTop: "10px", textAlign: "center" }}
        >
          Add Property
        </ModalHeader>
        <ModalBody
          css={{
            marginBottom: "5px", // Reduced margin at the bottom
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5px",
            }}
          >
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {/* Row 1 */}
              <div
                style={{ display: "flex", gap: "15px", marginBottom: "10px" }}
              >
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      css={{
                        flex: "1 1 30%",
                        padding: "10px",
                        borderRadius: "8px",
                        height: "40px", // Set height to match other inputs
                      }}
                    >
                      {propertyType === 0 ? "Sale" : "Rent"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Select Property Type"
                    onAction={(key) => setPropertyType(Number(key))}
                  >
                    <DropdownItem key="0">Sale</DropdownItem>
                    <DropdownItem key="1">Rent</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <Input
                  label="Location"
                  placeholder="Enter the location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  variant="bordered"
                  required
                  css={{ flex: "1 1 30%" }} // Flex for 3-column layout
                />
                <Input
                  label="Price"
                  placeholder="Enter the price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  variant="bordered"
                  required
                  css={{ flex: "1 1 30%" }} // Flex for 3-column layout
                />
              </div>
              <div
                style={{ display: "flex", gap: "15px", marginBottom: "10px" }}
              >
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      css={{
                        flex: "1 1 30%",
                        padding: "10px",
                        borderRadius: "8px",
                        height: "40px", // Set height to match other inputs
                      }}
                    >
                      {status === 0
                        ? "Active"
                        : status === 1
                        ? "Pending"
                        : status === 2
                        ? "Sold"
                        : status === 3
                        ? "Rented"
                        : "Select Status"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Select Status"
                    onAction={(key) => setStatus(Number(key))}
                  >
                    <DropdownItem key="0">Active</DropdownItem>
                    <DropdownItem key="1">Pending</DropdownItem>
                    <DropdownItem key="2">Sold</DropdownItem>
                    <DropdownItem key="3">Rented</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <Input
                  label="Pincode"
                  placeholder="Enter the pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  variant="bordered"
                  required
                  css={{ flex: "1 1 30%" }} // Flex for 3-column layout
                />
               
              </div>

              {/* Row 2 */}
              <div
                style={{ display: "flex", gap: "15px", marginBottom: "10px" }}
              >
                <Textarea
                  label="Description"
                  placeholder="Enter the description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="bordered"
                  required
                  css={{ flex: "1 1 100%" }} // Full width for Description
                />
              </div>
              <div
                style={{ display: "flex", gap: "6px", marginBottom: "10px" }}
              >
                <Input
                  label="Amenities"
                  placeholder="Enter amenities"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  variant="bordered"
                  css={{ flex: "1 1 100%" }} // Flex for 3-column layout
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "10px",
                  }}
                >
                  <Input
                    label="Upload Images"
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    variant="bordered"
                    required
                    css={{ flex: "1 1 100%" }}
                  />
                </div>
              </div>
              {message && <p>{message}</p>}
            </form>
          </div>
        </ModalBody>
        <ModalFooter css={{ justifyContent: "flex-end" }}> {/* Align buttons to the right */}
          <Button
            auto
            color="danger"
            variant="bordered"
            onClick={onClose}
            css={{ marginRight: "10px", height: "40px" }} // Add margin for spacing
          >
            Close
          </Button>
          <Button auto color="primary" onClick={handleSubmit} css={{ height: "40px" }}>
            Add Property
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}