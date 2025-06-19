'use client'

export default function HeroSection() {
  return (
    <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
            생각을 나누는 공간
          </h1>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            개발, 디자인, 그리고 일상의 인사이트를 담은 이야기들을 전합니다.
          </p>
        </div>
      </div>
    </section>
  )
}