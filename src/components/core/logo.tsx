'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

const DEFAULT_HEIGHT = 200;
const DEFAULT_WIDTH = 200;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({
  color = 'dark',
  emblem,
  height = DEFAULT_HEIGHT,
  width = DEFAULT_WIDTH,
}: LogoProps): React.JSX.Element {
  let url: string;

  if (emblem) {
    url = color === 'dark' ? '/newLogo.jpeg' : '/newLogo.jpeg';
  } else {
    url = color === 'light' ? '/newLogo.jpeg' : '/newLogo.jpeg';
  }

  // fallback default image
  if (!url) {
    url = '/defaultLogo.jpg';
  }

  return (
    <Box
      component="img"
      alt="logo"
      src={url}
      sx={{
        height,
        width,
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
      }}
    />
  );
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = DEFAULT_HEIGHT,
  width = DEFAULT_WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
