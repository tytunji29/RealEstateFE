'use client';
import { TextField } from '@mui/material';
import { useState } from 'react';

interface CustomersFiltersProps {
  onSearch: (query: string) => void;
}

export function CustomersFilters({ onSearch }: CustomersFiltersProps) {
  const [input, setInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <TextField
      fullWidth
      label="Search customers"
      value={input}
      onChange={handleChange}
      variant="outlined"
    />
  );
}
