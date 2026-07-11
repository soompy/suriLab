'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  ButtonBase,
  Collapse,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { extractMarkdownHeadings, MarkdownHeading } from '@/lib/markdownHeadings'

interface TableOfContentsProps {
  content: string
  className?: string
  sticky?: boolean
  collapsible?: boolean
  id?: string
}

export default function TableOfContents({
  content,
  className = '',
  sticky = true,
  collapsible = true,
  id = 'post-table-of-contents'
}: TableOfContentsProps) {
  const headings = useMemo(() => extractMarkdownHeadings(content), [content])
  const [activeHeading, setActiveHeading] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 112
      const currentHeading = [...headings]
        .reverse()
        .find((heading) => {
          const element = document.getElementById(heading.id)
          return element ? element.offsetTop <= scrollPosition : false
        })

      setActiveHeading(currentHeading?.id || headings[0].id)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  const activeIndex = Math.max(
    headings.findIndex((heading) => heading.id === activeHeading),
    0
  )

  const scrollToHeading = (heading: MarkdownHeading) => {
    const element = document.getElementById(heading.id)

    if (!element) return

    const top = element.getBoundingClientRect().top + window.scrollY - 88
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveHeading(heading.id)
  }

  return (
    <Box
      className={className}
      component="aside"
      aria-label="게시글 목차"
      sx={{
        position: sticky ? { xs: 'static', lg: 'sticky' } : 'static',
        top: { lg: 96 },
        alignSelf: 'flex-start'
      }}
    >
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.paper',
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(17, 24, 39, 0.04)'
        }}
      >
        <ButtonBase
          component="button"
          type="button"
          onClick={() => collapsible && setIsCollapsed((current) => !current)}
          aria-expanded={!isCollapsed}
          aria-controls={id}
          disabled={!collapsible}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            p: 2,
            textAlign: 'left',
            borderBottom: isCollapsed ? 0 : '1px solid',
            borderBottomColor: 'divider',
            cursor: collapsible ? 'pointer' : 'default',
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '-2px'
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            목차
          </Typography>
          {collapsible && (
            <KeyboardArrowDownIcon
              fontSize="small"
              sx={{
                color: 'text.secondary',
                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          )}
        </ButtonBase>

        <Collapse in={!isCollapsed} timeout={180}>
          <Box id={id} component="nav" sx={{ p: 1.25 }}>
            <Stack component="ol" spacing={0.25} sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {headings.map((heading) => {
                const isActive = activeHeading === heading.id

                return (
                  <Box component="li" key={heading.id}>
                    <ButtonBase
                      component="button"
                      type="button"
                      onClick={() => scrollToHeading(heading)}
                      sx={{
                        width: '100%',
                        display: 'block',
                        textAlign: 'left',
                        borderRadius: 1,
                        px: 1.25,
                        py: 0.875,
                        pl: heading.level === 3 ? 2.75 : 1.25,
                        color: isActive ? 'primary.main' : 'text.secondary',
                        bgcolor: isActive ? 'action.selected' : 'transparent',
                        fontWeight: isActive ? 700 : 500,
                        transition: 'background-color 0.18s ease, color 0.18s ease',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          color: 'text.primary'
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px'
                        }
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          display: 'block',
                          fontSize: heading.level === 3 ? '0.8125rem' : '0.875rem',
                          lineHeight: 1.45
                        }}
                      >
                        {heading.text}
                      </Typography>
                    </ButtonBase>
                  </Box>
                )
              })}
            </Stack>
          </Box>
        </Collapse>

        <LinearProgress
          variant="determinate"
          value={((activeIndex + 1) / headings.length) * 100}
          sx={{ height: 3 }}
        />
      </Box>
    </Box>
  )
}
