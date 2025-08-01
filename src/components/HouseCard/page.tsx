"use client";

import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface House {
  id: string;
  title: string;
  image: string;
  images: string[];
  price: number;
  location: string;
  type: string;
	propertyType: string;
	landType: string;
	buildingType: string;
  remainingimages: number;
}

export default function HouseCard({ house }: { house: House }) {
  const [open, setOpen] = useState(false);
console.log("HouseCard rendered with house:", house); // Debugging line
  return (
    <>
      <Card>
        <CardMedia
          component="img"
          height="180"
          image={house.image}
          alt={house.title}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {house.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {house.location} • {house.type}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            ₦{house.price.toLocaleString()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="success"
            variant="contained"
            onClick={() => setOpen(true)}
          >
            ({house.remainingimages}) More Images
          </Button>
          <Button size="small" color="secondary" variant="contained">
            View Contact
          </Button>
        </CardActions>
      </Card>

      {/* Modal with Swiper Slider */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: "relative", padding: 0 }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              background: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Swiper spaceBetween={10} slidesPerView={1}>
            {house.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`Image ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </DialogContent>
      </Dialog>
    </>
  );
}
