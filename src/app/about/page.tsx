import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'

export default function About() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Header />
        
        <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="flex items-start gap-8 mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  S
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">SoomPy</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    풀스택 개발자이자 기술 블로거입니다. 새로운 기술을 배우고 공유하는 것을 좋아합니다.
                  </p>
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>📍 Seoul, Korea</span>
                    <span>💼 Full Stack Developer</span>
                    <span>🎯 Tech Blogger</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills & Interests</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Docker', 'AWS', 'GraphQL'].map((skill) => (
                  <div key={skill} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                This blog is where I share my thoughts on software development, new technologies, and lessons learned from building various projects. 
                Feel free to reach out if you'd like to discuss tech, collaborate on projects, or just say hello!
              </p>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}