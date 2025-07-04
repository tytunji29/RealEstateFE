"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

interface House {
  id: number;
  title: string;
  image: string;
  price: number;
  location: string;
  type: string;
}

export default function HouseCard({ house }: { house: House }) {
  return (
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
        <Button size="small" variant="outlined">
          View
        </Button>
        <Button size="small" color="secondary" variant="contained">
          Contact
        </Button>
      </CardActions>
    </Card>
  );
}
