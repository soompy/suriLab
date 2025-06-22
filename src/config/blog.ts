export const BLOG_CONFIG = {
  // 블로그 소유자 정보
  owner: {
    id: 'owner-soomin',
    name: '이수민', // 여기에 실제 이름 입력
    email: 'soomin@example.com', // 여기에 실제 이메일 입력
    bio: '개발자이자 블로거입니다.',
    avatar: '/images/profile.jpg', // 프로필 이미지 경로
    social: {
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      twitter: 'https://twitter.com/yourusername'
    }
  },
  
  // 블로그 메타데이터
  metadata: {
    title: 'SuriBlog',
    description: '개발과 기술에 대한 이야기',
    url: 'https://yourdomain.com',
    image: '/images/og-image.jpg'
  },
  
  // 인증 설정
  auth: {
    adminPassword: process.env.BLOG_ADMIN_PASSWORD || 'admin123!',
    sessionTimeout: 24 * 60 * 60 * 1000 // 24시간
  }
} as const