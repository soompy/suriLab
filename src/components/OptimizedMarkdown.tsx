'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ContentImage } from './image/ContentImage'
import { Box, Typography } from '@mui/material'
import type { Components } from 'react-markdown'
import { memo, useMemo, Suspense } from 'react'

interface OptimizedMarkdownProps {
  content: string
  className?: string
  style?: React.CSSProperties
}

// Memoized CodeBlock component for better performance
const CodeBlock = memo(({ children, className }: { children: string; className?: string }) => {
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : 'text'
  
  // Only render syntax highlighter for code blocks with language
  if (!match) {
    return (
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
        <Box component="code">{children}</Box>
      </Box>
    )
  }
  
  return (
    <Suspense fallback={
      <Box
        sx={{
          height: '100px',
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          color: 'text.secondary',
          margin: '1.5rem 0',
        }}
      >
        Loading code...
      </Box>
    }>
      <SyntaxHighlighter
        style={vscDarkPlus as any}
        language={language}
        PreTag="div"
        customStyle={{
          borderRadius: '8px',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          margin: '1.5rem 0',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </Suspense>
  )
})

CodeBlock.displayName = 'CodeBlock'

const OptimizedMarkdown = memo(function OptimizedMarkdown({ 
  content, 
  className = '', 
  style = {} 
}: OptimizedMarkdownProps) {
  // Memoize custom components to prevent re-creation on every render
  const customComponents: Components = useMemo(() => ({
    img: ({ src, alt, title }) => {
      if (!src || typeof src !== 'string') return null
      
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
          mb: 2.5, 
          lineHeight: 1.2,
          color: 'text.primary',
          whiteSpace: 'pre-wrap', // 줄바꿈 보존
        }}
      >
        {children}
      </Typography>
    ),

    // 줄바꿈 처리
    br: () => (
      <Box component="br" sx={{ 
        display: 'block',
        content: '""',
        marginBottom: '1em'
      }} />
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
    
    // 커스텀 코드 스타일 - 최적화된 버전
    code: ({ children, className }) => {
      const match = /language-(\w+)/.exec(className || '')
      
      // 코드 블록인 경우 - 메모이제이션된 컴포넌트 사용
      if (match) {
        return <CodeBlock className={className}>{String(children)}</CodeBlock>
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

    // CodePen iframe 스타일
    iframe: ({ src, title, height, ...props }) => {
      if (src?.includes('codepen.io')) {
        return (
          <Box
            sx={{
              my: 3,
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: (theme) => 
                theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Box
              component="iframe"
              src={src}
              title={title || 'CodePen Embed'}
              height={height || 300}
              loading="lazy"
              sx={{
                width: '100%',
                border: 'none',
                display: 'block',
              }}
              {...props}
            />
          </Box>
        )
      }
      
      // 다른 iframe들은 기본 스타일 적용
      return (
        <Box
          component="iframe"
          src={src}
          title={title}
          height={height}
          sx={{
            width: '100%',
            border: 'none',
            borderRadius: '8px',
            my: 2,
          }}
          {...props}
        />
      )
    },
  }), []) // Empty dependency array since components don't depend on props

  // Memoize the markdown content processing
  const memoizedContent = useMemo(() => content, [content])

  return (
    <Box className={className} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={customComponents}
      >
        {memoizedContent}
      </ReactMarkdown>
    </Box>
  )
})

OptimizedMarkdown.displayName = 'OptimizedMarkdown'

export default OptimizedMarkdown