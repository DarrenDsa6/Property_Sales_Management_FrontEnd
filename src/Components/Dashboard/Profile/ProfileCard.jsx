import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { useTheme } from 'next-themes'; // Ensure you have this import
 
const ProfileSection = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const { theme } = useTheme(); // Get current theme (dark or light)
 
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not logged in. Please log in.');
        return;
      }
 
      try {
        const response = await fetch(`https://localhost:5002/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      }
    };
 
    fetchUserData();
  }, []);
 
  if (error) return <div className="text-red-500">{error}</div>;
 
  if (!userData) return <div>Loading...</div>;
 
  return (
    <div className="p-14">
        <Card className={`py-4 max-w-4xl mx-auto shadow-lg rounded-lg hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 border-2 ${theme === "dark" ? "border-gray-300" : "border-gray-700"}`}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <p className="text-sm text-gray-500">User Details</p>
      </CardHeader>
 
      <CardBody className="overflow-visible py-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium">User ID</label>
            <input
              type="text"
              value={userData.userId || ''}
              readOnly
              className="mt-1 p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={userData.name || ''}
              readOnly
              className="mt-1 p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Username</label>
            <input
              type="text"
              value={userData.userName || ''}
              readOnly
              className="mt-1 p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Contact Number</label>
            <input
              type="text"
              value={userData.contactNumber || ''}
              readOnly
              className="mt-1 p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Address</label>
            <input
              type="text"
              value={userData.address || ''}
              readOnly
              className="mt-1 p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Pincode</label>
            <input
              type="text"
              value={userData.pincode || ''}
              readOnly
              className="mt-1 p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Aadhaar Card</label>
            <input
              type="text"
              value={userData.aadhaarCard || ''}
              readOnly
              className="mt-1 p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </CardBody>
    </Card>
    </div>
  );
};
 
export default ProfileSection;