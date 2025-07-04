// "use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Slider,
  Typography,
  Pagination,
} from "@mui/material";
import HouseCard from "@/components/HouseCard/page";

interface Props {
  propertyTypes: { id: number; name: string }[];
  landTypes: { id: number; name: string }[];
  buildingTypes: { id: number; name: string }[];
}

interface House {
  id: number;
  title: string;
  image: string;
  price: number;
  location: string;
  type: string;
  remainingimages:number;
}


const allHouses: House[] = [
  {
    id: 1,
    title: "Modern Duplex",
    image:   "https://res.cloudinary.com/doghtjqip/image/upload/v1751628590/AgentsDoc/a-timeless-concrete-built-smart-duplexpayment-plan-qVsWXNbcXGF7A4yLDK1p_tfb0e9.jpg",
    price: 500000,
    location: "Lekki, Lagos",
    type: "Duplex",
    remainingimages: 3,
  },
  {
    id: 2,
    title: "Luxury Apartment",
    image:
      "https://res.cloudinary.com/doghtjqip/image/upload/v1751613080/AgentsDoc/dariann-court-YsedfGnWjRaHABx86uqD_utmvlx.jpg",
    price: 350000,
    location: "Ikoyi, Lagos",
    type: "Apartment",
    remainingimages: 5,
  },
  {
    id: 3,
    title: "Cozy Bungalow",
    image:
      "https://res.cloudinary.com/doghtjqip/image/upload/v1751613152/AgentsDoc/0684a5088b214f-luxury-5-bedroom-fully-detached-duplex-with-bq-in-osapa-detached-duplexes-for-sale-osapa-lekki-lagos_ewoocb.jpg",
    price: 200000,
    location: "Magodo, Lagos",
    type: "Bungalow",
    remainingimages: 2,
  },
  {
    id: 4,
    title: "Penthouse Suite",
    image:
      "https://res.cloudinary.com/doghtjqip/image/upload/v1751613152/AgentsDoc/q7QaW-tastefully-finished-3-bedroom-penthouse-apartment-PgLr4C65qg4OegpDZMVc_eojvwf.jpg",
    price: 800000,
    location: "Victoria Island, Lagos",
    type: "Apartment",
    remainingimages: 4,
  },
   {
    id: 5,
    title: "Modern Duplex",
    image: "https://res.cloudinary.com/doghtjqip/image/upload/v1751628590/AgentsDoc/q7QaW-tastefully-finished-3-bedroom-penthouse-apartment-PgLr4C65qg4OegpDZMVc_fzcvm4.jpg",
    price: 500000,
    location: "Lekki, Lagos",
    type: "Duplex",
    remainingimages: 3,
  },
  {
    id: 6,
    title: "Luxury Apartment",
    image:
      "https://res.cloudinary.com/doghtjqip/image/upload/v1751628591/AgentsDoc/beautiful-luxury-4-bedroom-semi-detached-duplex-with-bq-ncU7jBxJy3hyKxmq9jQi_pdizvo.jpg",
    price: 430000,
    location: "Ojota, Lagos",
    type: "Apartment",
    remainingimages: 5,
  },
  {
    id: 7,
    title: "Cozy Bungalow",
    image:
      "https://res.cloudinary.com/doghtjqip/image/upload/v1751628591/AgentsDoc/5bed-detached-bq-2hYbdPkUwfeJMtwxiCdO_qvfb60.jpg",
    price: 900000,
    location: "Berger, Lagos",
    type: "Bungalow",
    remainingimages: 2,
  },
  {
    id: 8,
    title: "Penthouse Suite",
    image:
      "https://res.cloudinary.com/doghtjqip/image/upload/v1751628590/AgentsDoc/dariann-court-YsedfGnWjRaHABx86uqD_qj3wb9.jpg",
    price: 600000,
    location: "Abraham Adesanya, Lagos",
    type: "Apartment",
    remainingimages: 4,
  },
  {
    id: 9,
    title: "Penthouse Suite",
    image:
      "https://res.cloudinary.com/doghtjqip/image/upload/v1751628590/AgentsDoc/a-timeless-concrete-built-smart-duplexpayment-plan-qVsWXNbcXGF7A4yLDK1p_tfb0e9.jpg",
    price: 1800000,
    location: "Ajah, Lagos",
    type: "Apartment",
    remainingimages: 4,
  },
];

export default function LandAndHousePage({
  propertyTypes,
  landTypes,
  buildingTypes,
}: Props) {
  const prices = allHouses.map((house) => house.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const [priceRange, setPriceRange] = useState<number[]>([minPrice, maxPrice]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<number | null>(0);
  const [selectedSubTypes, setSelectedSubTypes] = useState<number[]>([0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleSubTypeToggle = (id: number) => {
    if (id === 0) {
      setSelectedSubTypes([0]);
    } else {
      setSelectedSubTypes((prev) => {
        const newSelected = prev.includes(id)
          ? prev.filter((i) => i !== id)
          : [...prev.filter((i) => i !== 0), id];
        return newSelected.length === 0 ? [0] : newSelected;
      });
    }
  };

  const subTypes =
    selectedPropertyType !== null && selectedPropertyType !== 0
      ? propertyTypes.find((pt) => pt.id === selectedPropertyType)?.name === "Land"
        ? landTypes
        : buildingTypes
      : [];

  const filteredHouses = allHouses.filter((house) => {
    const withinPrice = house.price >= priceRange[0] && house.price <= priceRange[1];
    const matchesType =
      selectedPropertyType === 0 ||
      subTypes.length === 0 ||
      subTypes.some(
        (sub) =>
          (selectedSubTypes.includes(sub.id) || selectedSubTypes.includes(0)) &&
          house.type.toLowerCase() === sub.name.toLowerCase()
      );
    return withinPrice && matchesType;
  });

  const totalPages = Math.ceil(filteredHouses.length / itemsPerPage);
  const displayedHouses = filteredHouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          p: 2,
          bgcolor: "#fff",
          borderRight: "1px solid #ddd",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filter Listings
        </Typography>

        <Typography gutterBottom>
          Price Range (₦{minPrice} - ₦{maxPrice})
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={minPrice}
          max={maxPrice}
          step={50000}
        />

        <Divider sx={{ my: 2 }} />

        <Typography gutterBottom>Property Type</Typography>
        {propertyTypes.map((type) => (
          <FormControlLabel
            key={type.id}
            control={
              <Checkbox
                checked={selectedPropertyType === type.id}
                onChange={() => {
                  setSelectedPropertyType(
                    selectedPropertyType === type.id ? 0 : type.id
                  );
                  setSelectedSubTypes([0]);
                }}
              />
            }
            label={type.name}
          />
        ))}

        {selectedPropertyType !== null && selectedPropertyType !== 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom>
              {propertyTypes.find((pt) => pt.id === selectedPropertyType)?.name} Type
            </Typography>
            {subTypes.map((sub) => (
              <FormControlLabel
                key={sub.id}
                control={
                  <Checkbox
                    checked={selectedSubTypes.includes(sub.id)}
                    onChange={() => handleSubTypeToggle(sub.id)}
                  />
                }
                label={sub.name}
              />
            ))}
          </>
        )}
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" textAlign="center" fontWeight="bold" flexGrow={1}>
            Land & House Listings
          </Typography>
          <Button variant="contained" color="primary" sx={{ borderRadius: 2 }}>
            Post Your Property
          </Button>
        </Box>

        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {displayedHouses.map((house) => (
              <Box
                key={house.id}
                sx={{
                  width: { xs: "100%", sm: "50%", md: "25%", lg: "25%" },
                  padding: 1,
                  display: "flex",
                }}
              >
                <HouseCard house={house} />
              </Box>
            ))}
          </Grid>


          {totalPages > 1 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}
