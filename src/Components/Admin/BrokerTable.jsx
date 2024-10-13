import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

// Custom styled components for table
const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#424242',
  backgroundColor: '#f5f5f5',
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9',
  },
  '&:hover': {
    backgroundColor: '#e0f7fa',
    cursor: 'pointer',
  },
});

const BrokerTable = () => {
  const [brokers, setBrokers] = useState([]);
  const [error, setError] = useState(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [selectedBrokerId, setSelectedBrokerId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    userName: '',
    password: '',
    contactNumber: '',
    address: '',
    pincode: '',
    aadhaarCard: '',
  });

  // Fetch brokers on component load
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await fetch('https://localhost:5001/api/brokers');
        if (!response.ok) throw new Error(`Error fetching brokers: ${response.statusText}`);
        const data = await response.json();
        setBrokers(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBrokers();
  }, []);

  // Fetch broker details for editing
  const fetchBrokerDetails = async (brokerId) => {
    try {
      const response = await fetch(`https://localhost:5001/api/brokers/${brokerId}`);
      if (!response.ok) throw new Error("Failed to fetch broker details");
      const data = await response.json();
      setEditData({
        name: data.name || '',
        userName: data.userName || '',
        password: data.password || '',
        contactNumber: data.contactNumber || '',
        address: data.address || '',
        pincode: data.pincode || '',
        aadhaarCard: data.aadhaarCard || '',
      });
    } catch (error) {
      console.error("Error fetching broker details:", error);
    }
  };

  // Handle edit click and open the modal
  const handleEditClick = async (brokerId) => {
    setSelectedBrokerId(brokerId);
    await fetchBrokerDetails(brokerId);
    onOpenChange(true); // Open the modal
  };

  // Save the edited broker
  const handleSaveEdit = async () => {
    const formDataToSend = new FormData();
    for (const key in editData) {
      if (editData[key] !== "") {
        formDataToSend.append(key.charAt(0).toUpperCase() + key.slice(1), editData[key]);
      }
    }

    try {
      const response = await fetch(`https://localhost:5001/api/brokers/${selectedBrokerId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to edit the property");
      }

      setBrokers((prevBrokers) =>
        prevBrokers.map((broker) =>
          broker.brokerId === selectedBrokerId ? { ...broker, ...editData } : broker
        )
      );
      onOpenChange(false); // Close the modal
      window.location.reload(); // Optional refresh
    } catch (error) {
      console.error("Error editing broker:", error);
      alert("An error occurred while saving the broker. Please try again.");
    }
  };

  // Delete broker
  const handleDeleteClick = async (brokerId) => {
    try {
      const response = await fetch(`https://localhost:5001/api/brokers/${brokerId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete the broker");
      setBrokers(brokers.filter((broker) => broker.brokerId !== brokerId));
      alert('Broker deleted successfully.');
    } catch (error) {
      console.error("Error deleting broker:", error);
    }
  };

  // Handle input changes in the edit form
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
              <StyledTableCell align="center">Broker ID</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Username</StyledTableCell>
              <StyledTableCell align="center">Contact Number</StyledTableCell>
              <StyledTableCell align="center">Address</StyledTableCell>
              <StyledTableCell align="center">Pincode</StyledTableCell>
              <StyledTableCell align="center">Aadhaar Card</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {brokers.length > 0 ? (
              brokers.map((broker) => (
                <StyledTableRow key={broker.brokerId}>
                  <TableCell align="center">{broker.brokerId}</TableCell>
                  <TableCell align="center">{broker.name}</TableCell>
                  <TableCell align="center">{broker.userName}</TableCell>
                  <TableCell align="center">{broker.contactNumber}</TableCell>
                  <TableCell align="center">{broker.address}</TableCell>
                  <TableCell align="center">{broker.pincode}</TableCell>
                  <TableCell align="center">{broker.aadhaarCard}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="primary" onClick={() => handleEditClick(broker.brokerId)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(broker.brokerId)} style={{ marginLeft: '5px' }}>
                      Delete
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={8} align="center">
                  No brokers available
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Broker Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Broker</ModalHeader>
              <ModalBody>
              <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editData.name || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="userName"
                  placeholder="UserName"
                  value={editData.userName || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <textarea
                type="text"
                  name="contactNumber"
                  placeholder="ContactNumber"
                  value={editData.contactNumber || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <textarea
                  type="text"
                  name="address" // Added amenities input here
                  placeholder="Address"
                  value={editData.address || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <textarea
                  type="text"
                  name="pincode" // Added amenities input here
                  placeholder="Pincode"
                  value={editData.pincode || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <textarea
                  name="aadharCard" // Added amenities input here
                  placeholder="AadharCard"
                  value={editData.aadhaarCard || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                {/* More inputs as needed */}
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

export default BrokerTable;
