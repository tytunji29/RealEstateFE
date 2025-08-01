// Example: page.tsx or dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { APIURL } from "@/contexts/action";
import PropertyTable from "@/components/dashboard/pendingrequest/property-details"; // adjust path if needed

interface Property {
	id: string;
	title: string;
	location: string;
	price: string;
	images: string[];
	remainingImages: number;
}

export default function PendingRequestsPage() {
	const [properties, setProperties] = useState<Property[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const fetchProperties = async () => {
		try {
			const response = await axios.get(`${APIURL}/Properties/GetAllPendingProperties`, {
				params: {
					pgNo: page + 1,
					pgSize: rowsPerPage,
				},
			});
			console.log("Response data:", response.data); // Debugging line, can be removed later
			if (!response.data?.status || !Array.isArray(response.data.data.record)) {
				await Swal.fire({
					icon: "success",
					title: "No Property Found!",
					text: `${response.data?.message}`,
					timer: 1000,
				});
			} else {
				const propertiesData: Property[] = response.data.data.record.map((item: any) => ({
					id: item.id,
					title: item.title,
					location: item.location,
					price: item.price,
					images: item.images || [],
					remainingImages: item.remainingImages || 0,
				}));
				setProperties(propertiesData);
			}
		} catch (error) {
			console.error("Failed to fetch properties:", error);
		}
	};

	useEffect(() => {
		fetchProperties(); // Fetch on first load
	}, []);

	return <PropertyTable data={properties} refresh={fetchProperties} />;
}
