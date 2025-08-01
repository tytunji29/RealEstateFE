import React, { useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import Slider from "react-slick";
import { de } from "zod/dist/types/v4/locales";

import { APIURL } from "@/contexts/action";

interface Property {
	id: string;
	title: string;
	location: string;
	price: string;
	images: string[];
	remainingImages: number;
}

interface PropertyTableProps {
	data: Property[];
	refresh: () => void;
}

export default function PropertyTable({ data, refresh }: PropertyTableProps) {
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const handleView = (images: string[], id: string) => {
		setSelectedImages(images);
		setSelectedId(id);
		setOpen(true);
	};

	const handleAction = async (status: "Approved" | "Rejected") => {
		// Call your API to approve/reject here
console.log("Submitting action:", status, "for property ID:", selectedId);
		const token = sessionStorage.getItem("token");
		if (!token) throw new Error("User not authenticated");
		try {
			await fetch(`${APIURL}/Properties/DecidePropertyById/${selectedId}`, {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` ,"Content-Type": "application/json" },
				body: JSON.stringify({ status: status}), 
			});
			setOpen(false);
			refresh(); // Refresh table
		} catch (err) {
			console.error("Error submitting action:", err);
		}
	};

	return (
		<>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell>Location</TableCell>
						<TableCell>Price</TableCell>
						<TableCell>Image Count</TableCell>
						<TableCell>Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((property) => (
						<TableRow key={property.id}>
							<TableCell>{property.title}</TableCell>
							<TableCell>{property.location}</TableCell>
							<TableCell>₦{property.price}</TableCell>
							<TableCell>{property.images.length}</TableCell>
							<TableCell>
								<Button variant="outlined" onClick={() => handleView(property.images, property.id)}>
									View
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
				<DialogTitle>View Images</DialogTitle>
				<DialogContent>
					{selectedImages.length > 0 ? (
						<Slider
							dots={true}
							infinite={true}
							speed={500}
							slidesToShow={1}
							slidesToScroll={1}
							arrows={true}
							autoplay={false}
						>
							{selectedImages.map((url, index) => (
								<Box key={index} display="flex" justifyContent="center" alignItems="center" height={400}>
									<img
										src={url}
										alt={`property-img-${index}`}
										style={{
											maxHeight: "100%",
											maxWidth: "100%",
											objectFit: "contain",
											borderRadius: 8,
										}}
									/>
								</Box>
							))}
						</Slider>
					) : (
						<Typography>No images available</Typography>
					)}

					<Box display="flex" justifyContent="flex-end" mt={3}>
						<Button onClick={() => handleAction("Rejected")} color="error" sx={{ mr: 2 }}>
							Reject
						</Button>
						<Button onClick={() => handleAction("Approved")} color="primary" variant="contained">
							Approve
						</Button>
					</Box>
				</DialogContent>
			</Dialog>
		</>
	);
}
