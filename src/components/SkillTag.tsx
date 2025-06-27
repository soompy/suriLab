'use client'

import { Chip, ChipProps } from '@mui/material'
import { getTagColor } from '@/utils/archiveHelpers'

interface SkillTagProps extends Omit<ChipProps, 'label'> {
  label: string
  variant?: 'default' | 'small'
  getColor?: (tag: string) => string
}

export default function SkillTag({ 
  label, 
  variant = 'default',
  getColor = getTagColor,
  sx = {},
  ...props 
}: SkillTagProps) {
  const baseSize = variant === 'small' ? '0.65rem' : '0.75rem'
  const baseHeight = variant === 'small' ? '18px' : 'auto'
  const tagColor = getColor(label)
  
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        fontSize: baseSize,
        height: baseHeight,
        backgroundColor: tagColor,
        border: `1px solid ${tagColor}`,
        color: '#000000',
        fontWeight: 600,
        '&:hover': {
          backgroundColor: tagColor,
          borderColor: tagColor
        },
        transition: 'all 0.2s ease',
        ...sx
      }}
      {...props}
    />
  )
}