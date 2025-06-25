// 아카이브 관련 유틸리티 함수들

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  tags: string[]
  category: string
  publishedAt: string
  readTime: number
  views: number
  featured?: boolean
  slug?: string
}

export interface MonthData {
  month: number
  monthName: string
  posts: BlogPost[]
  count: number
}

export interface YearData {
  year: string
  posts: BlogPost[]
  months: MonthData[]
  count: number
  totalViews: number
}

export interface ArchiveData {
  [year: string]: YearData
}

// 월 이름 매핑
const MONTH_NAMES = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
]

// 포스트를 년도별/월별로 그룹화
export function groupPostsByYearAndMonth(posts: BlogPost[]): ArchiveData {
  const archiveData: ArchiveData = {}

  posts.forEach(post => {
    const date = new Date(post.publishedAt)
    const year = date.getFullYear().toString()
    const month = date.getMonth() + 1 // 0-based to 1-based

    // 년도 초기화
    if (!archiveData[year]) {
      archiveData[year] = {
        year,
        posts: [],
        months: [],
        count: 0,
        totalViews: 0
      }
    }

    // 년도에 포스트 추가
    archiveData[year].posts.push(post)
    archiveData[year].count++
    archiveData[year].totalViews += post.views || 0

    // 월별 데이터 찾기 또는 생성
    let monthData = archiveData[year].months.find(m => m.month === month)
    if (!monthData) {
      monthData = {
        month,
        monthName: MONTH_NAMES[month - 1],
        posts: [],
        count: 0
      }
      archiveData[year].months.push(monthData)
    }

    // 월에 포스트 추가
    monthData.posts.push(post)
    monthData.count++
  })

  // 각 년도의 월들을 최신순으로 정렬
  Object.values(archiveData).forEach(yearData => {
    yearData.months.sort((a, b) => b.month - a.month)
    yearData.posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  })

  return archiveData
}

// 년도별 통계 계산
export function getYearStats(yearData: YearData) {
  const mostPopularPost = yearData.posts.reduce((prev, current) => 
    (prev.views > current.views) ? prev : current, yearData.posts[0]
  )

  const categories = [...new Set(yearData.posts.map(p => p.category))]
  const tags = [...new Set(yearData.posts.flatMap(p => p.tags))]

  const monthlyStats = yearData.months.map(month => ({
    month: month.monthName,
    count: month.count,
    views: month.posts.reduce((sum, post) => sum + (post.views || 0), 0)
  }))

  return {
    totalPosts: yearData.count,
    totalViews: yearData.totalViews,
    averageViews: Math.round(yearData.totalViews / yearData.count),
    categoriesCount: categories.length,
    tagsCount: tags.length,
    mostPopularPost,
    categories,
    monthlyStats
  }
}

// 월별 통계 계산
export function getMonthStats(monthData: MonthData) {
  const totalViews = monthData.posts.reduce((sum, post) => sum + (post.views || 0), 0)
  const averageViews = Math.round(totalViews / monthData.count)
  
  const categories = [...new Set(monthData.posts.map(p => p.category))]
  const tags = [...new Set(monthData.posts.flatMap(p => p.tags))]

  const mostPopularPost = monthData.posts.reduce((prev, current) => 
    (prev.views > current.views) ? prev : current, monthData.posts[0]
  )

  return {
    totalPosts: monthData.count,
    totalViews,
    averageViews,
    categoriesCount: categories.length,
    tagsCount: tags.length,
    mostPopularPost,
    categories
  }
}

// 필터링된 아카이브 데이터 생성
export function getFilteredArchiveData(
  archiveData: ArchiveData, 
  searchQuery: string, 
  selectedCategory: string | null
): ArchiveData {
  const filteredData: ArchiveData = {}

  Object.entries(archiveData).forEach(([year, yearData]) => {
    const filteredMonths: MonthData[] = []
    let yearHasPosts = false

    yearData.months.forEach(monthData => {
      const filteredPosts = monthData.posts.filter(post => {
        // 카테고리 필터
        if (selectedCategory && post.category !== selectedCategory) {
          return false
        }
        
        // 검색어 필터
        if (searchQuery.trim() === '') {
          return true
        }
        
        const query = searchQuery.toLowerCase().trim()
        const title = (post.title || '').toLowerCase()
        const excerpt = (post.excerpt || '').toLowerCase()
        const category = (post.category || '').toLowerCase()
        const tags = post.tags || []
        
        return title.includes(query) ||
               excerpt.includes(query) ||
               category.includes(query) ||
               tags.some(tag => (tag || '').toLowerCase().includes(query))
      })

      if (filteredPosts.length > 0) {
        filteredMonths.push({
          ...monthData,
          posts: filteredPosts,
          count: filteredPosts.length
        })
        yearHasPosts = true
      }
    })

    if (yearHasPosts) {
      const allFilteredPosts = filteredMonths.flatMap(m => m.posts)
      filteredData[year] = {
        year,
        posts: allFilteredPosts,
        months: filteredMonths,
        count: allFilteredPosts.length,
        totalViews: allFilteredPosts.reduce((sum, post) => sum + (post.views || 0), 0)
      }
    }
  })

  return filteredData
}

// 태그 색상 생성
export function getTagColor(tag: string): string {
  const colors: { [key: string]: string } = {
    // Frontend & Core Technologies (Light Blue/Cyan family)
    'html': '#ffebee',
    'css': '#e3f2fd', 
    'javascript': '#fff9c4',
    'typescript': '#e8f5ff',
    'react': '#e0f7fa',
    'nextjs': '#f3e5f5',
    'vue': '#e8f5e8',
    'nuxt': '#f1f8e9',
    'frontend': '#e1f5fe',
    
    // Backend & Database (Green/Purple family)
    'backend': '#f1f8e9',
    'database': '#fff8e1',
    'node': '#e8f5e8',
    'python': '#fff3e0',
    
    // Development & Tools (Purple/Pink family)
    'development': '#f3e5f5',
    'tools': '#e8eaf6',
    'git': '#ffebee',
    'devops': '#e8eaf6',
    
    // Content Categories (Warm tones)
    'tutorial': '#e8f5e8',
    'review': '#fff3e0',
    'tech insights': '#e3f2fd',
    'personal': '#fce4ec',
    'career': '#fce4ec',
    'productivity': '#f3e5f5',
    
    // AI & Modern Tech (Light Green/Yellow)
    'ai': '#f9fbe7',
    
    // Design & UI (Orange/Pink family)
    'bootstrap': '#f3e5f5',
    'material-ui': '#e3f2fd',
    'responsive design': '#ffebee',
    'figma': '#fce4ec',
    'zeplin': '#fff3e0'
  }
  
  const normalizedTag = tag.toLowerCase().trim()
  return colors[normalizedTag] || '#f5f5f5'
}

// 날짜 포맷팅
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 조회수 포맷팅
export function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toLocaleString()
}