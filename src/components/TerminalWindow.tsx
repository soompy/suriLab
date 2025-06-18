'use client'

interface TerminalWindowProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export default function TerminalWindow({ 
  title = "terminal", 
  children, 
  className = "" 
}: TerminalWindowProps) {
  return (
    <div className={`bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          {/* Window Controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
          </div>
          <div className="text-sm text-gray-400 font-mono">
            <span className="text-green-400">●</span> {title}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span>UTF-8</span>
          <span>•</span>
          <span className="text-blue-400">active</span>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}