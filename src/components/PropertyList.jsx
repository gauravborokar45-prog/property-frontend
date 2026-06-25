import React from "react";
import PropertyCard from "../components/PropertyCard"; // Adjust the import path as needed

const PropertyList = () => {
  const properties = [
    {
      id: 1,
      name: "Ocean View Apartment",
      type: "FLAT",
      rent: 25000,
      deposit: 15000,
      locationUrl: "https://maps.app.goo.gl/fuxMzRkgP4zveD8n8",
      twoWheelerParking: true,
      fourWheelerParking: true,
      noOfVacancies: 1,
      bhk: 2,
      address: {
        id: 3,
        landmark: null,
        street: "FC Road",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        area: "Aundumbar Colony B",
        pincode: null,
      },
      gender: "ANY",
      furnishing: null,
      createdAt: "2025-06-15T12:39:00.343413",
      images: [
        {
          id: 1,
          imgUrl:
            "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
          createdAt: "2025-06-15T12:39:00.343413",
        },
        {
          id: 2,
          imgUrl:
            "https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg",
          createdAt: "2025-06-15T12:39:00.343413",
        },
        {
          id: 3,
          imgUrl:
            "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
          createdAt: "2025-06-15T12:39:00.344412",
        },
      ],
      owner: {
        id: 1,
        name: "Aditya Tangade",
        email: "aditya@example.com",
        phone: "9822624745",
        otp: null,
        otpGeneratedAt: null,
      },
    },
    {
      id: 2,
      name: "Elite Heights",
      type: "FLAT",
      rent: 22000,
      deposit: 20000,
      locationUrl: "https://maps.app.goo.gl/fuxMzRkgP4zveD8n8",
      twoWheelerParking: true,
      fourWheelerParking: true,
      noOfVacancies: 2,
      bhk: 1,
      address: {
        id: 1,
        landmark: null,
        street: "123 MG Road",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        area: "Indiranagar",
        pincode: null,
      },
      gender: "FAMILY",
      furnishing: "FURNISHED",
      createdAt: "2025-06-21T09:23:30.548734",
      images: [
        {
          id: 4,
          imgUrl:
            "https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg",
          createdAt: "2025-06-21T09:23:30.548734",
        },
        {
          id: 5,
          imgUrl:
            "https://images.pexels.com/photos/963486/pexels-photo-963486.jpeg",
          createdAt: "2025-06-21T09:23:30.548734",
        },
      ],
      owner: {
        id: 1,
        name: "Aditya Tangade",
        email: "aditya@example.com",
        phone: "9822624745",
        otp: null,
        otpGeneratedAt: null,
      },
    },
    // Add more properties here if needed
  ];

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyList;
