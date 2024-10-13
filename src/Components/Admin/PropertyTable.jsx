import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
 
// Custom styles for the table cells
const StyledTableCell = styled(TableCell)( {
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#424242',
  backgroundColor: '#f5f5f5',
});
 
// Custom styles for table rows
const StyledTableRow = styled(TableRow)( {
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9',
  },
  '&:hover': {
    backgroundColor: '#e0f7fa',
    cursor: 'pointer',
  },
});
 
// Function to map property status
const mapPropertyStatus = (status) => {
  switch (status) {
    case 0:
      return 'Sale';
    case 1:
      return 'Rent';
    default:
      return 'Unknown';
  }
};
 
const PropertyTable = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [editData, setEditData] = useState({
    location: '',
    pincode: '',
    price: '',
    description: '',
    amenities: '', // Amenities will be included here
    status: '', // Status remains here
  });
 
  // Fetch properties on initial load
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://localhost:5005/api/property/all');
        if (!response.ok) {
          throw new Error(`Error fetching properties: ${response.statusText}`);
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProperties();
  }, []);
 
  // Fetch property details for editing
  const fetchPropertyDetails = async (propertyId) => {
    try {
      const response = await fetch(`https://localhost:5005/api/property/${propertyId}`);
      if (!response.ok) throw new Error("Failed to fetch property details");
      const data = await response.json();
      setEditData({
        location: data.location || '',
        pincode: data.pincode || '',
        price: data.price || '',
        description: data.description || '',
        amenities: data.amenities || '', // Set the amenities from the fetched data
        status: data.status || '',
      });
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };
 
  // Open the edit modal
  const handleEditClick = async (propertyId) => {
    setSelectedPropertyId(propertyId);
    await fetchPropertyDetails(propertyId);
    onOpenChange(true); // Open the modal
  };
 
  // Save the edited property
  const handleSaveEdit = async () => {
    const formDataToSend = new FormData();
    for (const key in editData) {
      if (editData[key] !== "") {
        formDataToSend.append(key.charAt(0).toUpperCase() + key.slice(1), editData[key]);
      }
    }
 
    try {
      const response = await fetch(`https://localhost:5005/api/property/${selectedPropertyId}`, {
        method: "PATCH",
        body: formDataToSend,
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit the property");
      }
 
      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.propertyId === selectedPropertyId ? { ...property, ...editData } : property
        )
      );
      onOpenChange(false); // Close the modal
    const updatedResponse = await fetch('https://localhost:5005/api/property/all');
    const updatedData = await updatedResponse.json();
    setProperties(updatedData);  // Refresh the page (optional)
    } catch (error) {
      console.error("Error editing property:", error);
      alert("An error occurred while saving the property. Please try again.");
    }
  };
 
  // Delete a property
  const handleDeleteClick = async (propertyId) => {
    try {
      const response = await fetch(`https://localhost:5005/api/property/${propertyId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete the property");
      setProperties(properties.filter((property) => property.propertyId !== propertyId));
      alert('Property deleted successfully.');
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };
 
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
 
  if (error) {
    return <div>Error: {error}</div>;
  }
 
  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="center">Property ID</StyledTableCell>
              <StyledTableCell align="center">Location</StyledTableCell>
              <StyledTableCell align="center">Pincode</StyledTableCell>
              <StyledTableCell align="center">Price</StyledTableCell>
              <StyledTableCell align="center">Description</StyledTableCell>
              <StyledTableCell align="center">Amenities</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {properties.length > 0 ? (
              properties.map((property) => (
                <StyledTableRow key={property.propertyId}>
                  <TableCell align="center">{property.propertyId}</TableCell>
                  <TableCell align="center">{property.location}</TableCell>
                  <TableCell align="center">{property.pincode}</TableCell>
                  <TableCell align="center">${property.price.toLocaleString()}</TableCell>
                  <TableCell align="center">{property.description}</TableCell>
                  <TableCell align="center">{property.amenities}</TableCell>
                  <TableCell align="center">{mapPropertyStatus(property.status)}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="primary" size="small" onClick={() => handleEditClick(property.propertyId)} style={{ marginRight: '5px' }}>
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" size="small" onClick={() => handleDeleteClick(property.propertyId)}>
                      Delete
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={9} align="center">
                  No properties available
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
 
      {/* Modal for editing */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Property</ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={editData.location || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={editData.pincode || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="price"
                  placeholder="Price"
                  value={editData.price || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={editData.description || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <textarea
                  name="amenities" // Added amenities input here
                  placeholder="Amenities"
                  value={editData.amenities || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                {/* Select for status */}
                <select
                  name="status"
                  value={editData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select Status</option>
                  <option value={0}>Sale</option>
                  <option value={1}>Rent</option>
                </select>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleSaveEdit} color="primary">Save</Button>
                <Button onClick={() => onClose()}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
 
export default PropertyTable;