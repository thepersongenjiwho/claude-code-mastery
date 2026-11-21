// 프로필 내용은 이 파일에서만 수정합니다. script.js가 이 값을 읽어 화면에 그립니다.
window.PROFILE = {
  name: "더펄슨후",
  nameEn: "THEPERSONHU",
  subtitle: "SUB DPS",
  role: "공격군",
  position: "서브딜러",
  hero: "겐지",
  difficulty: 3,

  // 히어로 이미지: 직접 캡처한 인게임 스크린샷을 images 폴더에 이 이름으로 넣으세요.
  // 파일이 없으면 표창 장식이 대신 보입니다.
  heroImage: "images/genji-dragonblade.jpg",
  heroImageAlt: "겐지가 용검을 뽑아 적진으로 돌진하는 인게임 장면",

  // 히어로 헤드라인: em이 true인 조각만 강조 색으로 표시됩니다.
  headline: [
    { text: "정교한 " },
    { text: "에임", em: true },
    { text: ",\n날카로운 " },
    { text: "용검", em: true },
    { text: ",\n승리를 만드는 " },
    { text: "사이드", em: true },
    { text: "." },
  ],

  intro: "정교한 표창 에임, 탁월한 용검 실력, 팀을 승리로 이끄는 사이드 플레이.",

  // 소개 섹션의 능력 아이콘 (icon: shuriken | blade | flank)
  abilities: [
    { icon: "shuriken", title: "표창 에임", desc: "정교한 표창 에임으로 먼 거리의 적까지 정확하게 마무리합니다." },
    { icon: "blade", title: "용검", desc: "탁월한 용검 실력으로 한타의 흐름을 단숨에 뒤집습니다." },
    { icon: "flank", title: "사이드 플레이", desc: "적의 뒤를 흔드는 사이드 플레이로 팀을 승리로 이끕니다." },
  ],

  skills: [{ name: "질우근 성공률", value: 30 }],

  // 프로젝트 카드 3개 (icon: diamond | shuriken | blade)
  projects: [
    { icon: "diamond", label: "현시즌 티어", title: "다이아 5", desc: "이번 시즌 경쟁전에서 다이아 5 달성." },
    { icon: "shuriken", label: "시그니처 1", title: "표창 에임", desc: "정교한 표창 에임으로 만들어 내는 꾸준한 딜과 마무리." },
    { icon: "blade", label: "시그니처 2", title: "용검 & 사이드 플레이", desc: "탁월한 용검 실력과 팀을 승리로 이끄는 사이드 플레이." },
  ],

  email: "kms4301@naver.com",
};
