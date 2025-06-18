'use client'

import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import BlogMainPage from '@/components/BlogMainPage'

export default function Home() {
  const samplePosts = [
    {
      id: '1',
      title: 'Getting Started with React Hooks',
      content: `# React Hooks Introduction

React Hooks revolutionized how we write components. Here's a simple example:

\`\`\`javascript
import { useState, useEffect } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    document.title = \`Count: \${count}\`
  }, [count])
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
\`\`\`

This example shows **useState** and **useEffect** in action.`,
      tags: ['react', 'javascript', 'hooks'],
      createdAt: '2024-01-15T10:00:00Z',
      author: 'John Doe'
    },
    {
      id: '2',
      title: 'Python for Data Science',
      content: `# Data Science with Python

Python is excellent for data analysis. Here's a basic example:

\`\`\`python
import pandas as pd
import numpy as np

# Create sample data
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'score': [95, 87, 92]
}

df = pd.DataFrame(data)
print(df.head())
\`\`\`

This creates a simple DataFrame for analysis.`,
      tags: ['python', 'data-science', 'pandas'],
      createdAt: '2024-01-10T15:30:00Z',
      author: 'Jane Smith'
    }
  ]

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Header />
        
        <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
          <BlogMainPage
            posts={samplePosts}
            onPostClick={(post) => {
              // For now, we'll navigate to a preview route in the future
              console.log('Post clicked:', post.title)
            }}
          />
        </main>
      </div>
    </ThemeProvider>
  )
}