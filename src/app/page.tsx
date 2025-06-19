'use client'

import MuiThemeProvider from '@/components/MuiThemeProvider'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import PostGrid from '@/components/PostGrid'

export default function Home() {
  const samplePosts = [
    {
      id: '1',
      title: 'React Hooks로 시작하는 모던 React 개발',
      content: `React Hooks는 함수형 컴포넌트에서 상태 관리와 생명주기를 다룰 수 있게 해주는 강력한 기능입니다. useState와 useEffect를 활용하여 더 깔끔하고 재사용 가능한 컴포넌트를 만들어보세요.`,
      summary: 'React Hooks를 활용한 모던 컴포넌트 개발 방법과 실무 활용 팁',
      tags: ['React', 'JavaScript', 'Frontend'],
      createdAt: '2024-01-15T10:00:00Z',
      author: 'SuriBlog',
      readTime: 8,
      views: 1247
    },
    {
      id: '2',
      title: 'TypeScript와 Next.js로 타입 안전한 웹 개발',
      content: `TypeScript를 Next.js 프로젝트에 도입하여 타입 안전성을 확보하고 개발 경험을 향상시키는 방법을 알아봅니다. 실제 프로젝트 구성부터 고급 타입 활용까지 다룹니다.`,
      summary: 'Next.js에서 TypeScript를 활용한 타입 안전한 개발 환경 구축',
      tags: ['TypeScript', 'Next.js', 'WebDev'],
      createdAt: '2024-01-12T14:30:00Z',
      author: 'SuriBlog',
      readTime: 12,
      views: 2103
    },
    {
      id: '3',
      title: 'CSS Grid와 Flexbox: 모던 레이아웃 완벽 가이드',
      content: `CSS Grid와 Flexbox를 조합하여 복잡한 레이아웃을 효율적으로 구현하는 방법을 학습합니다. 실제 사례와 함께 반응형 디자인 패턴도 함께 다룹니다.`,
      summary: 'CSS Grid와 Flexbox를 활용한 현대적인 웹 레이아웃 구현 방법',
      tags: ['CSS', 'Layout', 'Design'],
      createdAt: '2024-01-08T09:15:00Z',
      author: 'SuriBlog',
      readTime: 10,
      views: 1856
    },
    {
      id: '4',
      title: 'Node.js와 Express로 RESTful API 설계하기',
      content: `Node.js와 Express 프레임워크를 사용하여 확장 가능한 RESTful API를 설계하고 구현하는 모범 사례를 소개합니다. 인증, 에러 처리, 데이터베이스 연동까지 포함합니다.`,
      summary: 'Node.js 기반 RESTful API 설계와 구현을 위한 실무 가이드',
      tags: ['Node.js', 'API', 'Backend'],
      createdAt: '2024-01-05T16:45:00Z',
      author: 'SuriBlog',
      readTime: 15,
      views: 3204
    },
    {
      id: '5',
      title: '웹 성능 최적화: 실무에서 바로 적용할 수 있는 기법들',
      content: `웹사이트 성능을 향상시키기 위한 실무 중심의 최적화 기법들을 소개합니다. 이미지 최적화, 코드 스플리팅, 캐싱 전략 등을 다룹니다.`,
      summary: '웹 성능 최적화를 위한 실용적인 기법과 도구 활용법',
      tags: ['Performance', 'Optimization', 'Web'],
      createdAt: '2024-01-02T11:20:00Z',
      author: 'SuriBlog',
      readTime: 11,
      views: 1923
    },
    {
      id: '6',
      title: 'Git 워크플로우: 팀 개발을 위한 브랜치 전략',
      content: `효율적인 팀 개발을 위한 Git 브랜치 전략과 워크플로우를 소개합니다. Git Flow, GitHub Flow 등 다양한 전략의 장단점을 비교분석합니다.`,
      summary: '팀 개발 효율성을 높이는 Git 브랜치 전략과 워크플로우',
      tags: ['Git', 'Workflow', 'Team'],
      createdAt: '2023-12-28T13:30:00Z',
      author: 'SuriBlog',
      readTime: 9,
      views: 1445
    },
    {
      id: '7',
      title: 'Docker로 개발 환경 표준화하기',
      content: `Docker를 활용하여 개발 환경을 컨테이너화하고 팀 전체의 환경을 표준화하는 방법을 알아봅니다. Docker Compose를 통한 멀티 컨테이너 구성도 다룹니다.`,
      summary: 'Docker를 활용한 개발 환경 컨테이너화와 표준화 가이드',
      tags: ['Docker', 'DevOps', 'Container'],
      createdAt: '2023-12-25T10:00:00Z',
      author: 'SuriBlog',
      readTime: 13,
      views: 2567
    },
    {
      id: '8',
      title: 'AWS로 시작하는 클라우드 네이티브 개발',
      content: `AWS 서비스를 활용하여 클라우드 네이티브 애플리케이션을 개발하는 방법을 학습합니다. Lambda, API Gateway, DynamoDB 등 핵심 서비스들을 다룹니다.`,
      summary: 'AWS 클라우드 서비스를 활용한 서버리스 애플리케이션 개발',
      tags: ['AWS', 'Cloud', 'Serverless'],
      createdAt: '2023-12-20T15:45:00Z',
      author: 'SuriBlog',
      readTime: 16,
      views: 2890
    }
  ]

  return (
    <MuiThemeProvider>
      <div style={{ minHeight: '100vh' }}>
        <Header />
        
        <main>
          <HeroSection />
          <PostGrid
            posts={samplePosts}
            onPostClick={(post) => {
              console.log('Post clicked:', post.title)
            }}
          />
        </main>
      </div>
    </MuiThemeProvider>
  )
}