'use client';
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { APIURL } from "@/contexts/action";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  role: string;
  address: { street: string };
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Move fetchCustomers outside useEffect and wrap with useCallback
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${APIURL}/Users/AllCustomerUsers`, {
        params: {
          pgNo: page + 1,
          pgSize: rowsPerPage,
          search: searchQuery,
        },
      });


      if (response.data?.status && Array.isArray(response.data.data.users)) {
        const mapped: Customer[] = response.data.data.users.map((item: any) => ({
          id: item.id,
          name: item.fullName,
          email: item.email,
          phone: item.phoneNumber,
          status: item.status,
          role: item.userRole,
          avatar: '/assets/default-avatar.png',
          address: { street: item.address },
          createdAt: item.createdDate ? new Date(item.createdDate) : new Date(),
        }));

        setCustomers(mapped);
        setTotalCount(response.data.data.totalRecords || mapped.length);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>

      <CustomersFilters
        onSearch={(query: string) => {
          setSearchQuery(query);
          setPage(0);
        }}
      />

      <CustomersTable
        count={totalCount}
        page={page}
        rows={customers}
        rowsPerPage={rowsPerPage}
        loading={loading}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        onRefresh={fetchCustomers} // ✅ Now works!
      />
    </Stack>
  );
}
