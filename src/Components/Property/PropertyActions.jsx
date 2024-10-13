import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react"; // Importing useDisclosure for modal handling
 
export default function PropertyActions({ propertyId, onEdit, onDelete }) {
  const {
    isOpen: isEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
 
  const [editData, setEditData] = useState({
    propertyType: "",
    location: "",
    pincode: "",
    price: "",
    description: "",
    amenities: "",
    status: "", // Ensure status is part of the state
  });
 
  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(
        `https://localhost:5005/api/property/${propertyId}`
      );
      if (!response.ok) throw new Error("Failed to fetch property details");
      const data = await response.json();
      setEditData({
        propertyType: data.propertyType || "",
        location: data.location || "",
        pincode: data.pincode || "",
        price: data.price || "",
        description: data.description || "",
        amenities: data.amenities || "",
        status: data.status || "", // Ensure fetched status is used
      });
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };
 
  const handleEditClick = async () => {
    await fetchPropertyDetails();
    onEditOpenChange(true); // Open the edit modal
  };
 
  const handleDeleteClick = () => {
    onDeleteOpenChange(true); // Open the delete confirmation modal
  };
 
  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:5005/api/property/${propertyId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete the property");
      onDelete(propertyId);
      onDeleteOpenChange(false); // Close the delete modal
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };
 
  const handleSaveEdit = async () => {
    const formDataToSend = new FormData();
    for (const key in editData) {
      if (editData[key] !== "") {
        formDataToSend.append(
          key.charAt(0).toUpperCase() + key.slice(1),
          editData[key]
        );
      }
    }
 
    try {
      const response = await fetch(
        `https://localhost:5005/api/property/${propertyId}`,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit the property");
      }
 
      onEdit(propertyId, editData);
      onEditOpenChange(false); // Close the edit modal
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error editing property:", error);
      alert("An error occurred while saving the property. Please try again.");
    }
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
 
 
  return (
    <>
      <div className="flex justify-center">
        {/* Edit Button */}
        <Button color="primary" onPress={handleEditClick} className="mr-2">
          Edit
        </Button>
 
        {/* Delete Button */}
        <Button color="danger" onPress={handleDeleteClick} className="ml-2">
          Delete
        </Button>
      </div>
 
      {/* Modal for editing */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Property</ModalHeader>
              <ModalBody>
                <Input
                  name="location"
                  placeholder="Location"
                  value={editData.location || ""}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Input
                  name="pincode"
                  placeholder="Pincode"
                  value={editData.pincode || ""}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Input
                  name="price"
                  placeholder="Price"
                  value={editData.price || ""}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Input
                  name="description"
                  placeholder="Description"
                  value={editData.description || ""}
                  onChange={handleInputChange}
                  className="mb-2"
                />
 
              </ModalBody>
              <ModalFooter>
                <div className="flex">
                  <Button
                    color="danger"
                    variant="bordered"
                    onPress={onClose}
                    className="mr-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleSaveEdit}
                    className="ml-1"
                  >
                    Save
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
 
      {/* Modal for delete confirmation */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          <ModalHeader>Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete this property?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="bordered"
              onPress={() => onDeleteOpenChange(false)}
            >
              Cancel
            </Button>
            <Button color="danger" variant="solid" onPress={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}