import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

export const metadata: Metadata = {
  title: 'Content Queue | SuriBlog Admin',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

type QueueItem = {
  name: string
  path: string
  status: string
  createdAt: string
  warnings: number
  published: boolean
}

const ROOT = process.cwd()
const AUTOMATION_ROOT = path.join(ROOT, 'automation')

function safeReadJson(filePath: string) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

function listFiles(dir: string, extension: string) {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.join(dir, entry.name))
}

function getIdeas(): QueueItem[] {
  return listFiles(path.join(AUTOMATION_ROOT, 'queue', 'ideas'), '.json').map((filePath) => {
    const idea = safeReadJson(filePath)

    return {
      name: String(idea?.title || path.basename(filePath)),
      path: path.relative(ROOT, filePath),
      status: String(idea?.status || 'idea'),
      createdAt: String(idea?.createdAt || '-'),
      warnings: 0,
      published: false,
    }
  })
}

function getDrafts(): QueueItem[] {
  const reports = listFiles(path.join(AUTOMATION_ROOT, 'reports'), '.json')
    .map((filePath) => safeReadJson(filePath))
    .filter(Boolean)

  return listFiles(path.join(AUTOMATION_ROOT, 'queue', 'drafts'), '.md').map((filePath) => {
    const file = path.relative(ROOT, filePath)
    const report = reports.find((item) => item?.file === file)

    return {
      name: path.basename(filePath),
      path: file,
      status: report?.publishable ? 'reviewed' : 'draft',
      createdAt: fs.statSync(filePath).mtime.toISOString(),
      warnings: Array.isArray(report?.warnings) ? report.warnings.length : 0,
      published: false,
    }
  })
}

function getReviewedFiles(): QueueItem[] {
  return listFiles(path.join(AUTOMATION_ROOT, 'queue', 'reviewed'), '.md').map((filePath) => ({
    name: path.basename(filePath),
    path: path.relative(ROOT, filePath),
    status: 'reviewed-output',
    createdAt: fs.statSync(filePath).mtime.toISOString(),
    warnings: 0,
    published: false,
  }))
}

function StatusChip({ status }: { status: string }) {
  const color = status === 'reviewed' ? 'success' : status === 'draft' ? 'warning' : 'default'

  return <Chip label={status} color={color} size="small" />
}

function QueueTable({ title, items }: { title: string; items: QueueItem[] }) {
  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 850 }}>
          {title}
        </Typography>
        {items.length === 0 ? (
          <Typography color="text.secondary">No files yet.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {items.map((item) => (
              <Box
                key={item.path}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) 140px 120px 90px' },
                  gap: 1,
                  alignItems: 'center',
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                    {item.path}
                  </Typography>
                </Box>
                <StatusChip status={item.status} />
                <Typography variant="body2" color="text.secondary">
                  warnings: {item.warnings}
                </Typography>
                <Chip label={item.published ? 'published' : 'not published'} size="small" variant="outlined" />
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

export default function ContentQueuePage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const ideas = getIdeas()
  const drafts = getDrafts()
  const reviewed = getReviewedFiles()

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <Chip label="Development only" color="warning" sx={{ mb: 2 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 900, mb: 1 }}>
            Content Automation Queue
          </Typography>
          <Typography color="text.secondary">
            이 페이지는 개발 환경에서만 파일 기반 자동화 큐를 확인하기 위한 보조 화면입니다.
          </Typography>
        </Box>

        <QueueTable title="Ideas" items={ideas} />
        <QueueTable title="Drafts" items={drafts} />
        <QueueTable title="Reviewed outputs" items={reviewed} />
      </Stack>
    </Container>
  )
}
