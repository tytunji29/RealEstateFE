'use client';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';

interface PostPropertyModalProps {
  open: boolean;
  onClose: () => void;
  propertyTypes: { id: number; name: string }[];
  landTypes: { id: number; name: string }[];
  buildingTypes: { id: number; name: string }[];
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

export default function PostPropertyModal({
  open,
  onClose,
  propertyTypes,
  landTypes,
  buildingTypes,
  onSubmit,
}: PostPropertyModalProps) {
  const { register, handleSubmit, watch, reset } = useForm();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPropertyType = watch('PropertyType');

  const subTypes =
    selectedPropertyType == 0
      ? landTypes
      : buildingTypes;

  const handleImageUrlsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      urls.push(URL.createObjectURL(files[i]));
    }
    setImageUrls(urls);
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true); // show loading
    const formData = new FormData();
    formData.append('LandType', data.LandType || '0');
    formData.append('BuildingType', data.BuildingType || '0');
    formData.append('PropertyType', data.PropertyType || '0');
    formData.append('Price', data.Price);
    formData.append('Location', data.Location);
    formData.append('Title', data.Title);
    formData.append('Description', data.Description);
    formData.append('Nin', data.Nin);
    formData.append('Bvn', data.Bvn);

    if (data.DefaultImage[0]) {
      formData.append('DefaultImage', data.DefaultImage[0]);
    }

    if (data.ImageUrls && data.ImageUrls.length > 0) {
      for (const file of data.ImageUrls) {
        formData.append('ImageUrls', file);
      }
    }

    try {
      await onSubmit(formData); // await in case it's a Promise
      reset();
      setImageUrls([]);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Post Your Property</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <TextField label="Title" fullWidth margin="normal" {...register('Title')} />
            <TextField label="Location" fullWidth margin="normal" {...register('Location')} />
            <TextField label="Price (₦)" type="number" fullWidth margin="normal" {...register('Price')} />
            <TextField label="Description" fullWidth margin="normal" multiline rows={3} {...register('Description')} />

            <TextField
              select
              label="Property Type"
              fullWidth
              margin="normal"
              defaultValue="0"
              {...register('PropertyType')}
            >
              {propertyTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Sub Type"
              fullWidth
              margin="normal"
              defaultValue="0"
              {...register(selectedPropertyType == 0 ? 'LandType' : 'BuildingType')}
            >
              {subTypes.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>
                  {sub.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField label="NIN" fullWidth margin="normal" {...register('Nin')} />
            <TextField label="BVN" fullWidth margin="normal" {...register('Bvn')} />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Default Image
            </Typography>
            <input type="file" accept="image/*" {...register('DefaultImage')} />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Other Images
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              {...register('ImageUrls')}
              onChange={handleImageUrlsChange}
            />

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={onClose} color="secondary" sx={{ mr: 2 }} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      <Backdrop open={isSubmitting} sx={{ color: '#fff', zIndex: 1301 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
