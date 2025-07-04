"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid, { GridProps } from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import HouseCard from "@/components/HouseCard/page";

interface House {
	id: number;
	title: string;
	image: string;
	price: number;
	location: string;
	type: "Apartment" | "Bungalow" | "Duplex";
}

// Sample data
const allHouses: House[] = [
	{
		id: 1,
		title: "Modern Duplex",
		image: "/images/house1.jpg",
		price: 500000,
		location: "Lekki, Lagos",
		type: "Duplex",
	},
	{
		id: 2,
		title: "Luxury Apartment",
		image: "https://res.cloudinary.com/doghtjqip/image/upload/v1751613080/AgentsDoc/dariann-court-YsedfGnWjRaHABx86uqD_utmvlx.jpg",
		price: 350000,
		location: "Ikoyi, Lagos",
		type: "Apartment",
	},
	{
		id: 3,
		title: "Cozy Bungalow",
		image: "https://res.cloudinary.com/doghtjqip/image/upload/v1751613152/AgentsDoc/0684a5088b214f-luxury-5-bedroom-fully-detached-duplex-with-bq-in-osapa-detached-duplexes-for-sale-osapa-lekki-lagos_ewoocb.jpg",
		price: 200000,
		location: "Magodo, Lagos",
		type: "Bungalow",
	},
	{
		id: 4,
		title: "Penthouse Suite",
		image: "https://res.cloudinary.com/doghtjqip/image/upload/v1751613152/AgentsDoc/q7QaW-tastefully-finished-3-bedroom-penthouse-apartment-PgLr4C65qg4OegpDZMVc_eojvwf.jpg",
		price: 800000,
		location: "Victoria Island, Lagos",
		type: "Apartment",
	},
];

export default function LandAndHousePage() {
	const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
	const [apartmentChecked, setApartmentChecked] = useState(true);
	const [bungalowChecked, setBungalowChecked] = useState(true);
	const [duplexChecked, setDuplexChecked] = useState(true);

	const handlePriceChange = (_: Event, newValue: number | number[]) => {
		setPriceRange(newValue as number[]);
	};

	const filteredHouses = allHouses.filter((house) => {
		const withinPrice = house.price >= priceRange[0] && house.price <= priceRange[1];
		const typeMatch =
			(apartmentChecked && house.type === "Apartment") ||
			(bungalowChecked && house.type === "Bungalow") ||
			(duplexChecked && house.type === "Duplex");
		return withinPrice && typeMatch;
	});

	return (
		<Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
			{/* Sidebar Filter Panel */}
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

				{/* Price Filter */}
				<Typography gutterBottom>Price Range (₦)</Typography>
				<Slider
					value={priceRange}
					onChange={handlePriceChange}
					valueLabelDisplay="auto"
					min={0}
					max={1000000}
					step={50000}
				/>
				<Divider sx={{ my: 2 }} />

				{/* Type Filter */}
				<Typography gutterBottom>Property Type</Typography>
				<FormControlLabel
					control={<Checkbox checked={apartmentChecked} onChange={() => setApartmentChecked(!apartmentChecked)} />}
					label="Apartment"
				/>
				<FormControlLabel
					control={<Checkbox checked={bungalowChecked} onChange={() => setBungalowChecked(!bungalowChecked)} />}
					label="Bungalow"
				/>
				<FormControlLabel
					control={<Checkbox checked={duplexChecked} onChange={() => setDuplexChecked(!duplexChecked)} />}
					label="Duplex"
				/>
			</Box>

			{/* Main Content */}
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				{/* Topbar */}
				<Typography variant="h5" gutterBottom>
					Land & House Listings
				</Typography>

				{/* Listings Grid */}
				<Container maxWidth="xl">
					<Grid container spacing={3}>
						{/* {filteredHouses.map((house) => (
              <Grid
                item
                key={house.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <HouseCard house={house} />
              </Grid>
            ))} */}
						{/* {filteredHouses.map((house) => {
  const gridProps: GridProps = {
    item: true,
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
    key: house.id
  };
  return (
    <Grid {...gridProps}>
      <HouseCard house={house} />
    </Grid>
  );
})} */}

						{filteredHouses.map((house) => (
							<Box
								key={house.id}
								sx={{
									width: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" },
									padding: 2,
								}}
							>
								<HouseCard house={house} />
							</Box>
						))}
					</Grid>
				</Container>
			</Box>
		</Box>
	);
}
