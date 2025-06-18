import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'

export default function Projects() {
  const projects = [
    {
      title: 'SuriBlog',
      description: 'A modern blog platform built with Next.js and TypeScript featuring markdown support, dark mode, and responsive design.',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/soompy/suriblog',
      demo: 'https://suriblog.vercel.app'
    },
    {
      title: 'Task Manager Pro',
      description: 'Full-stack task management application with real-time updates and team collaboration features.',
      tech: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com/soompy/task-manager',
      demo: 'https://taskmanager-demo.com'
    },
    {
      title: 'Weather Dashboard',
      description: 'Beautiful weather application with location-based forecasts and interactive charts.',
      tech: ['Vue.js', 'Chart.js', 'OpenWeather API'],
      github: 'https://github.com/soompy/weather-dashboard',
      demo: 'https://weather-demo.com'
    }
  ]

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <Header />
        
        <main className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Projects</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a href={project.github} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm">
                    GitHub
                  </a>
                  <a href={project.demo} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm">
                    Live Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}