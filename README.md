# Online Game Tournament Platform

Vue 3 기반 온라인 게임 토너먼트 플랫폼 프로젝트입니다.  
Battlefy와 유사하게 사용자가 토너먼트를 생성하고, 참가 신청을 하고, 대진표를 통해 경기 결과를 관리할 수 있는 웹 서비스를 목표로 합니다.

## 주요 기능

- 토너먼트 목록 조회
- 토너먼트 생성
- 토너먼트 상세 페이지
- 참가 신청
- 참가자 목록 확인
- 싱글 엘리미네이션 대진표
- 경기 상세 페이지
- 점수 입력 및 승자 결정
- 로그인 / 회원가입

## 기술 스택

### Frontend

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Tailwind CSS

### Backend 예정

- Node.js
- Express
- PostgreSQL
- Prisma
- JWT Authentication

## 프로젝트 구조

```txt
src/
├─ assets/
├─ components/
├─ router/
│  └─ index.js
├─ stores/
├─ views/
│  ├─ Home.vue
│  ├─ TournamentList.vue
│  ├─ TournamentCreate.vue
│  ├─ TournamentDetail.vue
│  ├─ Participants.vue
│  ├─ Bracket.vue
│  ├─ MatchDetail.vue
│  ├─ Login.vue
│  └─ Register.vue
├─ App.vue
└─ main.js

라우팅 구조
Path	Page
/	메인 페이지
/tournaments	토너먼트 목록
/tournaments/create	토너먼트 생성
/tournaments/:id	토너먼트 상세
/tournaments/:id/participants	참가자 목록
/tournaments/:id/bracket	대진표
/matches/:id	경기 상세
/login	로그인
/register	회원가입
설치 및 실행
npm install
npm run dev
빌드
npm run build
개발 목표

1차 MVP에서는 다음 흐름을 구현하는 것을 목표로 합니다.

토너먼트 생성
→ 참가 신청
→ 참가자 목록 구성
→ 대진표 생성
→ 경기 결과 입력
→ 승자 진출
→ 우승자 결정
향후 추가 기능
팀 단위 참가
관리자 권한
체크인 기능
경기 결과 승인
더블 엘리미네이션
라운드 로빈 방식
게임별 토너먼트 필터링
실시간 채팅
알림 기능
이미지 업로드
OAuth 로그인
프로젝트 목적

이 프로젝트는 Vue 기반 SPA 개발 경험을 쌓기 위한 포트폴리오 프로젝트입니다.
프론트엔드 라우팅, 상태 관리, 컴포넌트 구조화, 백엔드 API 연동, 대진표 알고리즘 구현을 학습하는 것을 목표로 합니다.