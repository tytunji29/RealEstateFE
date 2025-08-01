"use client";

import { useState } from "react";
import { Customer } from "@/app/dashboard/customers/page";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
	Avatar,
	CircularProgress,
	IconButton,
	Menu,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
} from "@mui/material";
import axios from "axios";

import { APIURL } from "@/contexts/action";

interface CustomersTableProps {
	count: number;
	page: number;
	rows: Customer[];
	rowsPerPage: number;
	loading?: boolean;
	onPageChange: (event: unknown, newPage: number) => void;
	onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
   onRefresh: () => void; // ✅ New prop
}

export function CustomersTable({
	count,
	page,
	rows,
	rowsPerPage,
	loading,
	onPageChange,
	onRowsPerPageChange,
  
  onRefresh, // ✅ Destructure it
}: CustomersTableProps) {
	const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
		setAnchorEls((prev) => ({ ...prev, [userId]: event.currentTarget }));
	};

	const handleMenuClose = (userId: string) => {
		setAnchorEls((prev) => ({ ...prev, [userId]: null }));
	};

const handleAction = async (userId: string, action: string) => {
  handleMenuClose(userId);

  try {
    let newapprovalStatus = "";
    switch (action) {
      case "Admin":
        newapprovalStatus = "admin";
        break;
      case "Deactivate":
        newapprovalStatus = "rejected";
        break;
      case "Reactivate":
        newapprovalStatus = "active";
        break;
      default:
        return;
    }

    const endpoint = `${APIURL}/Users/changeuserstatus`;
    const data = {
      id: userId,
      approvalStatus: newapprovalStatus,
    };

    const response = await axios.post(endpoint, data);

    // ✅ Alert message
    alert(response.data?.message || "User updated successfully");

    // ✅ Trigger refresh
    onRefresh();

  } catch (err) {
    console.error(`Failed to perform action: ${action}`, err);
    alert("Failed to update user.");
  }
};

	return (
		<Paper>
			{loading ? (
				<div style={{ padding: "2rem", textAlign: "center" }}>
					<CircularProgress />
				</div>
			) : (
				<>
					<Table>
						<TableHead>
							<TableRow>
								{/* <TableCell>Avatar</TableCell> */}
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Address</TableCell>
								<TableCell>Created</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((customer) => (
								<TableRow key={customer.id}>
									{/* <TableCell>
                    <Avatar src={customer.avatar} alt={customer.name} />
                  </TableCell> */}
									<TableCell>{customer.name}</TableCell>
									<TableCell>{customer.email}</TableCell>
									<TableCell>{customer.phone}</TableCell>
									<TableCell>{customer.status}</TableCell>
									<TableCell>{customer.role}</TableCell>
									<TableCell>{customer.address.street}</TableCell>
									<TableCell>{new Date(customer.createdAt).toDateString()}</TableCell>
									<TableCell>
										<IconButton
											aria-label="more"
											aria-controls={`menu-${customer.id}`}
											aria-haspopup="true"
											onClick={(event) => handleMenuOpen(event, customer.id)}
										>
											<MoreVertIcon />
										</IconButton>
										<Menu
											id={`menu-${customer.id}`}
											anchorEl={anchorEls[customer.id] || null}
											open={Boolean(anchorEls[customer.id])}
											onClose={() => handleMenuClose(customer.id)}
										>
											<MenuItem onClick={() => handleAction(customer.id, "Admin")}>Change Role to Admin</MenuItem>
											<MenuItem onClick={() => handleAction(customer.id, "Deactivate")}>Deactivate User</MenuItem>
											<MenuItem onClick={() => handleAction(customer.id, "Reactivate")}>Reactivate User</MenuItem>
										</Menu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<TablePagination
						component="div"
						count={count}
						page={page}
						onPageChange={onPageChange}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={onRowsPerPageChange}
						rowsPerPageOptions={[5, 10, 25]}
					/>
				</>
			)}
		</Paper>
	);
}
