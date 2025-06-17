import React from 'react'

const ReactMarkdown = ({ children }: { children: string }) => {
  return <div data-testid="markdown-preview">{children}</div>
}

export default ReactMarkdown