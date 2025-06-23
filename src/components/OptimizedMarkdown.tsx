'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ContentImage } from './image'
import { Box, Typography } from '@mui/material'
import type { Components } from 'react-markdown'

interface OptimizedMarkdownProps {
  content: string
  className?: string
  style?: React.CSSProperties
}

export default function OptimizedMarkdown({ 
  content, 
  className = '', 
  style = {} 
}: OptimizedMarkdownProps) {
  const customComponents: Components = {
    img: ({ src, alt, title }) => {
      if (!src) return null
      
      return (
        <ContentImage
          src={src}
          alt={alt || '이미지'}
          caption={title}
          priority={false}
          quality={85}
          enableZoom={true}
          borderRadius="8px"
        />
      )
    },
    
    // 커스텀 헤딩 스타일
    h1: ({ children }) => (
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          my: 3, 
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {children}
      </Typography>
    ),
    
    h2: ({ children }) => (
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          my: 2.5, 
          fontWeight: 600,
          lineHeight: 1.3,
        }}
      >
        {children}
      </Typography>
    ),
    
    h3: ({ children }) => (
      <Typography 
        variant="h5" 
        component="h3" 
        sx={{ 
          my: 2, 
          fontWeight: 600,
          lineHeight: 1.4,
        }}
      >
        {children}
      </Typography>
    ),
    
    // 커스텀 문단 스타일
    p: ({ children }) => (
      <Typography 
        variant="body1" 
        component="p" 
        sx={{ 
          mb: 2, 
          lineHeight: 1.7,
          color: 'text.primary',
        }}
      >
        {children}
      </Typography>
    ),
    
    // 커스텀 인용문 스타일
    blockquote: ({ children }) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.02)' 
              : 'rgba(0, 0, 0, 0.02)',
          margin: '1.5rem 0',
          padding: '1rem 1.5rem',
          borderRadius: '0 8px 8px 0',
          '& p:last-child': {
            mb: 0,
          },
        }}
      >
        {children}
      </Box>
    ),
    
    // 커스텀 코드 블록 스타일
    pre: ({ children }) => (
      <Box
        component="pre"
        sx={{
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.05)',
          border: '1px solid',
          borderColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '1rem',
          margin: '1.5rem 0',
          overflow: 'auto',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          fontFamily: 'var(--font-jetbrains-mono), monospace',
        }}
      >
        {children}
      </Box>
    ),
    
    // 커스텀 코드 스타일
    code: ({ children, className }) => {
      const match = /language-(\w+)/.exec(className || '')
      
      // 코드 블록인 경우
      if (match) {
        return (
          <SyntaxHighlighter
            style={vscDarkPlus as any}
            language={match[1]}
            PreTag="div"
            customStyle={{
              borderRadius: '8px',
              fontSize: '0.875rem',
              lineHeight: 1.5,
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        )
      }
      
      // 인라인 코드인 경우
      return (
        <Box
          component="code"
          sx={{
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.08)',
            padding: '0.125rem 0.375rem',
            borderRadius: '4px',
            fontSize: '0.875em',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgb(249, 115, 22)' 
                : 'rgb(194, 65, 12)',
          }}
        >
          {children}
        </Box>
      )
    },
    
    // 커스텀 리스트 스타일
    ul: ({ children }) => (
      <Box 
        component="ul" 
        sx={{ 
          pl: 3, 
          my: 1.5,
          '& li': {
            mb: 0.5,
          },
        }}
      >
        {children}
      </Box>
    ),
    
    ol: ({ children }) => (
      <Box 
        component="ol" 
        sx={{ 
          pl: 3, 
          my: 1.5,
          '& li': {
            mb: 0.5,
          },
        }}
      >
        {children}
      </Box>
    ),
    
    li: ({ children }) => (
      <Typography 
        component="li" 
        sx={{ 
          lineHeight: 1.6,
          color: 'text.primary',
        }}
      >
        {children}
      </Typography>
    ),
    
    // 커스텀 링크 스타일
    a: ({ href, children }) => (
      <Box
        component="a"
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        sx={{
          color: 'primary.main',
          textDecoration: 'none',
          borderBottom: '1px solid transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderBottomColor: 'primary.main',
          },
        }}
      >
        {children}
      </Box>
    ),
    
    // 커스텀 테이블 스타일
    table: ({ children }) => (
      <Box
        sx={{
          overflow: 'auto',
          my: 2,
          border: '1px solid',
          borderColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
      >
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
          {children}
        </Box>
      </Box>
    ),
    
    th: ({ children }) => (
      <Box
        component="th"
        sx={{
          padding: '0.75rem',
          textAlign: 'left',
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.02)',
          borderBottom: '1px solid',
          borderColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
          fontWeight: 600,
        }}
      >
        {children}
      </Box>
    ),
    
    td: ({ children }) => (
      <Box
        component="td"
        sx={{
          padding: '0.75rem',
          borderBottom: '1px solid',
          borderColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.05)',
        }}
      >
        {children}
      </Box>
    ),
  }

  return (
    <Box className={className} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </Box>
  )
}