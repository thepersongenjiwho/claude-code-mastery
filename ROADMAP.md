# 개발자 웹 이력서 개발 로드맵

개발자 본인의 경력, 프로젝트, 기술 스택을 한 페이지로 보여주는 웹 이력서를 만듭니다.

## 1. 기술 스택

| 영역 | 사용 기술 | 비고 |
|---|---|---|
| 마크업 | HTML5 | 시맨틱 태그(`header`, `main`, `section`, `footer`) 사용 |
| 스타일 | CSS + Tailwind CSS | Tailwind는 CDN으로 불러오고, 부족한 스타일만 `style.css`에 작성 |
| 동작 | JavaScript (Vanilla) | 프레임워크 없이 `data.js`의 내용을 DOM에 렌더링 |

- 빌드 도구, 패키지 매니저, 서버는 사용하지 않습니다.
- 브라우저에서 `index.html`을 열면 바로 동작해야 합니다.
- UI 언어는 한국어(`lang="ko"`)입니다.

## 2. 목표와 범위

### 목표
- 채용 담당자가 1~2분 안에 경력과 기술 스택을 파악할 수 있는 한 페이지 이력서
- 내용(`data.js`)과 화면(`index.html`, `script.js`)을 분리해서, 내용만 바꿔도 갱신되도록 구성
- PC와 모바일 모두 보기 편할 것

### 포함 섹션
- 프로필: 이름, 직무, 한 줄 소개, 이메일
- 소개
- 기술 스택
- 경력
- 프로젝트
- 학력
- SNS 링크: GitHub, YouTube, Instagram, 블로그 등 (`social` 배열)

### 제외 (초기 버전)
- 로그인, 회원 기능, 서버, DB
- 관리자 페이지 (내용은 `data.js`에서 직접 수정)
- 다크 모드, 영어 버전, 방문자 통계

## 3. 파일 구조

```
claude-code-mastery/
├── index.html   # 이력서 페이지 구조 (섹션 뼈대)
├── style.css    # 추가 스타일 (Tailwind로 처리하기 어려운 부분만)
├── data.js      # 이력서 내용 (window.RESUME). 주로 수정하는 파일
├── script.js    # data.js 내용을 DOM에 렌더링
├── ROADMAP.md
└── CLAUDE.md
```

- `data.js`를 쓰는 이유: JSON을 `fetch`로 읽으려면 로컬 서버가 필요하지만, `data.js`는 파일을 더블클릭해서 바로 열 수 있습니다.
- 기존 `login.html`, `login.css`, `login.js`는 이력서 작업과 무관하므로 건드리지 않습니다.

## 4. 데이터 모델

```js
// data.js
window.RESUME = {
  profile: {
    name: "홍길동",
    title: "웹 개발자",
    intro: "사용자가 편하게 쓰는 웹 화면을 만드는 것을 좋아합니다.",
    email: "hong@example.com",
    github: "https://github.com/example",
  },
  about: "HTML, CSS, JavaScript로 웹 화면을 만들고 있으며, 깔끔한 UI와 사용성에 관심이 많습니다.",
  skills: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Git"],
  experience: [
    {
      company: "OO 회사",
      role: "프론트엔드 개발자",
      period: "2023.03 ~ 2025.02",
      highlights: [
        "회원가입과 결제 화면을 반응형으로 개선",
        "재사용 가능한 UI 컴포넌트 10여 종 구현",
      ],
    },
  ],
  projects: [
    {
      name: "할 일 관리 앱",
      desc: "할 일을 추가, 완료, 삭제할 수 있는 웹 앱",
      stack: ["JavaScript", "Tailwind CSS"],
      link: "https://github.com/example/todo",
    },
  ],
  education: [
    { school: "OO 대학교", major: "컴퓨터공학", period: "2018.03 ~ 2024.02" },
  ],
  social: [
    { name: "GitHub", url: "https://github.com/example" },
    { name: "YouTube", url: "https://youtube.com/@example" },
    { name: "Instagram", url: "https://instagram.com/example" },
    { name: "Blog", url: "https://example.com" },
  ],
};
```

- 날짜는 `YYYY.MM` 형식으로 통일하고, 경력은 최신순으로 적습니다.
- 값이 비어 있는 섹션은 `script.js`에서 숨깁니다.
- 데이터는 `textContent`로 넣습니다. `innerHTML`에 데이터를 직접 넣지 않습니다.

## 5. 단계별 계획

### Phase 0 — 준비 (0.5일)
- [ ] 이력서에 넣을 정보 정리 (경력, 프로젝트 2개, 기술, 학력, 링크)
- [ ] 샘플 데이터로 `data.js` 작성

### Phase 1 — 기본 페이지 (1일)
- [ ] `index.html` 작성: Tailwind CDN 스크립트, `<header>`, `<main>`, 섹션 `<section id="...">`
- [ ] `script.js`에서 `window.RESUME`을 읽어 프로필, 소개, 기술, 경력, 프로젝트, 학력 렌더링
- [ ] 데이터가 없는 섹션 숨기기

### Phase 2 — 스타일과 반응형 (1일)
- [ ] 제목과 섹션 간격 통일 (`text-2xl font-bold`, `mt-12` 등)
- [ ] 360px ~ 1440px 폭에서 가로 스크롤 없이 표시 (`max-w-3xl mx-auto px-4`)
- [ ] 기술 스택을 태그 형태(`rounded-full bg-slate-100 px-3 py-1 text-sm`)로 표시
- [ ] 링크와 버튼에 키보드 포커스 표시 (`focus-visible:ring-2`)
- [ ] 추가 스타일은 `style.css`에 정리

### Phase 3 — 메타 정보와 인쇄 (0.5일)
- [ ] `<title>`, `<meta name="description">` 추가
- [ ] 인쇄 시 버튼 숨기기 (`print:hidden`), A4 한 장에 들어가도록 여백 조정
- [ ] 파비콘 추가

### Phase 4 — 품질 점검 (0.5일)
- [ ] Chrome, Edge에서 수동 확인 (가능하면 Safari, Firefox도)
- [ ] 제목 순서(h1 → h2 → h3) 확인, 이미지 `alt` 텍스트 작성
- [ ] 콘솔 에러 없음 확인
- [ ] 외부 링크 동작 확인

### Phase 5 — 배포 (선택, 0.5일)
- [ ] GitHub Pages 또는 Netlify에 정적 배포
- [ ] 배포 후 모바일에서 확인

### 이후 개선 (백로그)
- [ ] 다크 모드 (`dark:` 클래스 사용)
- [ ] 영어 버전 추가
- [ ] 프로젝트 카드에 스크린샷 추가

## 6. 작업 원칙

- 내용 수정은 `data.js`에서, 레이아웃 수정은 `index.html`과 `script.js`에서 합니다.
- 요소 ID를 바꾸면 `script.js`도 함께 수정합니다.
- Tailwind 클래스가 길어지면 같은 패턴을 `script.js`의 함수로 묶어 재사용합니다.
- 외부 스크립트는 Tailwind CDN 하나만 사용합니다.

## 7. 완료 기준

- [ ] `index.html`을 브라우저에서 열면 샘플 데이터가 모두 보인다.
- [ ] `data.js`만 수정해도 화면 내용이 바뀐다.
- [ ] 360px와 1440px 폭에서 가로 스크롤이 없다.
- [ ] 인쇄 미리보기가 A4 한 장에 들어간다.
- [ ] 콘솔에 에러가 없다.

## 8. 열린 질문

- 실제 이력서 내용(이름, 경력, 프로젝트, 연락처)은 언제 제공하는지
- 배포 여부와 위치 (GitHub Pages 등)
