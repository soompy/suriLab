'use client'

import { Typography, Box } from '@mui/material'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ size = 'md' }: LogoProps) {
  const fontSize = {
    sm: '1rem',
    md: '1.3rem',
    lg: '1.5rem'
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography
        component="span"
        sx={{
          fontSize: fontSize[size],
          fontFamily: 'monospace',
          fontWeight: 700,
          color: 'primary.main',
          mr: 0.5,
        }}
      >
        &gt;_
      </Typography>
      <Typography
        component="span"
        sx={{
          fontSize: fontSize[size],
          fontWeight: 700,
          color: 'primary.main',
        }}
      >
        Suri
      </Typography>
      <Typography
        component="span"
        sx={{
          fontSize: fontSize[size],
          fontWeight: 400,
          color: 'text.secondary',
        }}
      >
        Blog
      </Typography>
    </Box>
  )
}