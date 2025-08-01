// "use client";

import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Checkbox,
	Container,
	Divider,
	FormControlLabel,
	Grid,
	Pagination,
	Slider,
	Typography,
} from "@mui/material";
import Swal from "sweetalert2";

import { APIURL } from "@/contexts/action";
import HouseCard from "@/components/HouseCard/page";
import PostPropertyModal from "@/components/HouseCard/PostPropertyModal";

interface Props {
	propertyTypes: { id: number; name: string }[];
	landTypes: { id: number; name: string }[];
	buildingTypes: { id: number; name: string }[];
}

interface House {
	id: string; // Changed to string for consistency with API
	title: string;
	image: string;
	price: number;
	location: string;
	type: string;
	propertyType: string;
	landType: string;
	buildingType: string;
	remainingimages: number;
	images: string[];
}

export default function LandAndHousePage({ propertyTypes, landTypes, buildingTypes }: Props) {
	const [house, setHouses] = useState<House[]>([]);
	//const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchHouses = async () => {
			try {
				const res = await fetch(`${APIURL}/Properties/GetAllProperties?pgNo=1&pgSize=8`);
				if (!res.ok) throw new Error("Failed to fetch houses");

				// Debugging line, can be removed later
				const json = await res.json();

				const records = json.data?.record ?? [];

				const mapped = records.map(
					(item: any): House => ({
						id: item.id,
						title: item.title,
						image: item.image,
						price: parseInt(item.price.replace(/,/g, "")), // Convert "90,000,000" → 90000000
						location: item.location,
						propertyType: item.propertyType,
						landType: item.landType,
						buildingType: item.buildingType,
						type: item.type || "All",
						remainingimages: (item.images?.length || 0) - 1,
						images: item.images || [item.image],
					})
				); // Debugging line, can be removed later
				setHouses(mapped);
			} catch (error) {
				console.error(error);
				Swal.fire("Error", "Failed to load listings", "error");
			} finally {
				setLoading(false);
			}
		};

		fetchHouses();
	}, []);

	const prices = house.map((house) => house.price);
	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);

	const [priceRange, setPriceRange] = useState<number[]>([minPrice, maxPrice]);
	const [selectedPropertyType, setSelectedPropertyType] = useState<number | null>(0);
	const [selectedSubTypes, setSelectedSubTypes] = useState<number[]>([0]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8;
	const [modalOpen, setModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	// Debugging line
	const handlePostSubmit = async (formData: FormData) => {
		try {
			setLoading(true);

			const url = `${APIURL}/Properties/CreateProperty`;
			const token = sessionStorage.getItem("token");
			if (!token) throw new Error("User not authenticated");

			const res = await fetch(url, {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
				body: formData,
			});

			if (!res.ok) throw new Error("Failed to submit");
			setModalOpen(false); // Close modal after success

			await Swal.fire({
				icon: "success",
				title: "Property Posted!",
				text: "Your property was submitted successfully.",
				timer: 2000,
				showConfirmButton: false,
			});
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: "error",
				title: "Submission Failed",
				text: "Please try again later.",
			});
		} finally {
			setLoading(false);
		}
	};
	const handlePriceChange = (_: Event, newValue: number | number[]) => {
		setPriceRange(newValue as number[]);
	};

	const handleSubTypeToggle = (id: number) => {
		if (id === 0) {
			setSelectedSubTypes([0]);
		} else {
			setSelectedSubTypes((prev) => {
				const newSelected = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev.filter((i) => i !== 0), id];
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
	const filteredHouses = house.filter((house) => {
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
	});// Debugging line
	const totalPages = Math.ceil(filteredHouses.length / itemsPerPage);
	const displayedHouses = filteredHouses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
					step={50_000}
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
									setSelectedPropertyType(selectedPropertyType === type.id ? 0 : type.id);
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
									<Checkbox checked={selectedSubTypes.includes(sub.id)} onChange={() => handleSubTypeToggle(sub.id)} />
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
					<Button
						variant="contained"
						color="primary"
						sx={{ borderRadius: 2 }}
						onClick={() => setModalOpen(true)} // Show modal on click
					>
						Post Your Property
					</Button>

					{/* Place this OUTSIDE the button */}

					<PostPropertyModal
						open={modalOpen}
						onClose={() => setModalOpen(false)}
						propertyTypes={propertyTypes}
						landTypes={landTypes}
						buildingTypes={buildingTypes}
						onSubmit={handlePostSubmit}
						loading={loading}
					/>
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
