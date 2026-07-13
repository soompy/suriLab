import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import type { Components } from 'react-markdown'
import Image from 'next/image'
import Link from 'next/link'
import { Box, Link as MuiLink, Typography } from '@mui/material'
import {
  createHeadingSlug,
  extractMarkdownHeadings,
  getPlainHeadingText,
} from '@/lib/markdownHeadings'

interface PostMarkdownProps {
  content: string
}

export default function PostMarkdown({ content }: PostMarkdownProps) {
  const markdownHeadings = extractMarkdownHeadings(content)

  const getHeadingId = (children: React.ReactNode, level: 2 | 3, node?: unknown) => {
    const line = typeof node === 'object'
      && node !== null
      && 'position' in node
      && typeof (node as { position?: { start?: { line?: unknown } } }).position?.start?.line === 'number'
      ? (node as { position: { start: { line: number } } }).position.start.line
      : null
    const text = getPlainHeadingText(children)

    return markdownHeadings.find((heading) => heading.level === level && heading.line === line)?.id
      || markdownHeadings.find((heading) => heading.level === level && heading.text === text)?.id
      || createHeadingSlug(text)
  }

  const components: Components = {
    h1: ({ children }) => (
      <Typography variant="h3" component="h1" sx={{ my: 3, fontWeight: 700, lineHeight: 1.2 }}>
        {children}
      </Typography>
    ),
    h2: ({ children, node }) => (
      <Typography
        id={getHeadingId(children, 2, node)}
        variant="h4"
        component="h2"
        sx={{ mt: 5, mb: 2, fontWeight: 700, lineHeight: 1.3, scrollMarginTop: 96 }}
      >
        {children}
      </Typography>
    ),
    h3: ({ children, node }) => (
      <Typography
        id={getHeadingId(children, 3, node)}
        variant="h5"
        component="h3"
        sx={{ mt: 4, mb: 1.5, fontWeight: 700, lineHeight: 1.35, scrollMarginTop: 96 }}
      >
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography component="p" variant="body1" sx={{ mb: 2.5, lineHeight: 1.8, color: 'text.primary' }}>
        {children}
      </Typography>
    ),
    a: ({ href, children }) => {
      const isInternal = typeof href === 'string' && href.startsWith('/')

      return (
        <MuiLink
          component={isInternal ? Link : 'a'}
          href={href || '#'}
          target={isInternal ? undefined : '_blank'}
          rel={isInternal ? undefined : 'noopener noreferrer'}
          sx={{ fontWeight: 700, textUnderlineOffset: 3 }}
        >
          {children}
        </MuiLink>
      )
    },
    img: ({ src, alt, title }) => {
      if (!src || typeof src !== 'string') return null

      return (
        <Box component="figure" sx={{ my: 4, mx: 0 }}>
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 1 }}>
            <Image
              src={src}
              alt={alt || ''}
              fill
              sizes="(max-width: 900px) 100vw, 800px"
              style={{ objectFit: 'contain' }}
            />
          </Box>
          {title && (
            <Typography component="figcaption" variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
              {title}
            </Typography>
          )}
        </Box>
      )
    },
    blockquote: ({ children }) => (
      <Box
        component="blockquote"
        sx={{
          my: 3,
          mx: 0,
          pl: 2.5,
          py: 0.5,
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          color: 'text.secondary',
          '& p:last-child': { mb: 0 },
        }}
      >
        {children}
      </Box>
    ),
    ul: ({ children }) => (
      <Box component="ul" sx={{ my: 2.5, pl: 3, '& li': { mb: 1, lineHeight: 1.8 } }}>
        {children}
      </Box>
    ),
    ol: ({ children }) => (
      <Box component="ol" sx={{ my: 2.5, pl: 3, '& li': { mb: 1, lineHeight: 1.8 } }}>
        {children}
      </Box>
    ),
    code: ({ className, children }) => {
      const isBlock = /language-\w+/.test(className || '')

      if (isBlock) {
        return <code className={className}>{children}</code>
      }

      return (
        <Box
          component="code"
          sx={{
            px: 0.5,
            py: 0.125,
            borderRadius: 0.75,
            bgcolor: 'action.hover',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.9em',
          }}
        >
          {children}
        </Box>
      )
    },
    pre: ({ children }) => (
      <Box
        component="pre"
        sx={{
          my: 3,
          p: 2,
          overflowX: 'auto',
          borderRadius: 1,
          bgcolor: '#0f172a',
          color: '#e5e7eb',
          fontSize: '0.875rem',
          lineHeight: 1.7,
          '& code': {
            bgcolor: 'transparent',
            p: 0,
            fontFamily: 'var(--font-jetbrains-mono), monospace',
          },
        }}
      >
        {children}
      </Box>
    ),
    table: ({ children }) => (
      <Box sx={{ overflowX: 'auto', my: 3 }}>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
          {children}
        </Box>
      </Box>
    ),
    th: ({ children }) => (
      <Box component="th" sx={{ border: '1px solid', borderColor: 'divider', p: 1.25, textAlign: 'left', bgcolor: 'action.hover' }}>
        {children}
      </Box>
    ),
    td: ({ children }) => (
      <Box component="td" sx={{ border: '1px solid', borderColor: 'divider', p: 1.25, verticalAlign: 'top' }}>
        {children}
      </Box>
    ),
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}
