// window.RESUME 데이터를 읽어 index.html에 렌더링합니다.
// 모든 값은 textContent로 넣어서 HTML로 해석되지 않도록 합니다.

const SVG_NS = "http://www.w3.org/2000/svg";
const THEME_KEY = "theme";

// 아이콘 선 경로 (Feather Icons 기반, MIT)
const ICON_PATHS = {
  arrowRight: ["M5 12h14", "M12 5l7 7-7 7"],
  arrowUpRight: ["M7 17L17 7", "M7 7h10v10"],
};

// 링크 화살표가 hover 때 오른쪽 위로 살짝 움직이는 효과 (부모에 group 클래스 필요)
const ARROW_HOVER_CLASS =
  "shrink-0 text-faint transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none print:hidden";

// 요소 생성 헬퍼
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

// 장식용 SVG 아이콘 (스크린 리더에서는 읽지 않음)
function icon(name, className) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.75");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  if (className) svg.setAttribute("class", className);
  for (const d of ICON_PATHS[name]) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  return svg;
}

// 외부 링크 공통 속성
function externalLink(url, text, className) {
  const a = el("a", className, text);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

// 값이 없으면 섹션과 상단 바로가기의 해당 링크를 함께 숨깁니다.
function toggleSection(sectionId, hasContent) {
  const section = document.getElementById(sectionId);
  if (section) section.hidden = !hasContent;

  const navLink = document.querySelector(`#section-nav a[href="#${sectionId}"]`);
  if (navLink) navLink.parentElement.hidden = !hasContent;
}

// 경력과 학력이 같이 쓰는 한 줄: 왼쪽에 기간, 오른쪽에 제목과 부제
function entryRow(period, title, subtitle) {
  const row = el(
    "article",
    "grid grid-cols-1 gap-x-8 gap-y-2 border-t border-line py-8 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] print:py-2 print:first:pt-0"
  );
  row.append(el("p", "pt-1 text-sm tabular-nums text-faint", period));

  const body = el("div", "min-w-0");
  body.append(el("h3", "text-xl font-medium tracking-tight text-fg print:text-base", title));
  if (subtitle) body.append(el("p", "mt-1 text-accent-ink", subtitle));
  row.append(body);

  return { row, body };
}

function renderProfile(profile) {
  const name = profile.name ?? "";
  document.getElementById("profile-name").textContent = name;
  document.getElementById("profile-title").textContent = profile.title ?? "";
  document.getElementById("profile-intro").textContent = profile.intro ?? "";
  // 왼쪽 위 로고 자리에는 이름의 첫 글자를 씁니다. (예: 홍길동 → 홍)
  document.getElementById("profile-avatar").textContent = Array.from(name)[0] ?? "";

  const email = document.getElementById("profile-email");
  if (profile.email) {
    email.href = `mailto:${profile.email}`;
    const heading = el(
      "span",
      "flex items-center justify-between gap-4 text-3xl font-normal tracking-tight sm:text-4xl print:hidden",
      "연락하기"
    );
    heading.append(
      icon(
        "arrowRight",
        "h-8 w-8 shrink-0 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
      )
    );
    email.replaceChildren(
      heading,
      el("span", "mt-8 block break-all text-sm font-medium print:mt-0", profile.email)
    );
  } else {
    email.parentElement.hidden = true;
  }
}

function renderAbout(about) {
  document.getElementById("about-text").textContent = about ?? "";
  toggleSection("about", Boolean(about));
}

function renderSkills(skills) {
  // 항목 사이의 "/" 기호는 style.css의 .slash-list가 그립니다.
  const list = document.getElementById("skills-list");
  list.replaceChildren(...skills.map((skill) => el("li", null, skill)));
  toggleSection("skills", skills.length > 0);
}

function renderExperience(experience) {
  const list = document.getElementById("experience-list");
  list.replaceChildren(
    ...experience.map((job) => {
      const { row, body } = entryRow(job.period, job.company, job.role);

      const highlights = job.highlights ?? [];
      if (highlights.length > 0) {
        const ul = el("ul", "dash-list mt-4 space-y-2 leading-relaxed text-muted print:mt-1 print:space-y-0.5");
        ul.append(...highlights.map((text) => el("li", null, text)));
        body.append(ul);
      }
      return row;
    })
  );
  toggleSection("experience", experience.length > 0);
}

function renderProjects(projects) {
  const list = document.getElementById("projects-list");
  list.replaceChildren(
    ...projects.map((project) => {
      const linked = Boolean(project.link);
      const card = el(
        "article",
        "relative flex min-w-0 flex-col border border-line p-6 print:p-3" +
          (linked
            ? " group transition-colors duration-200 hover:border-fg motion-reduce:transition-none"
            : "")
      );

      const top = el("div", "flex items-start justify-between gap-4");
      top.append(el("h3", "min-w-0 text-xl font-medium tracking-tight text-fg print:text-base", project.name));
      if (linked) top.append(icon("arrowUpRight", `mt-1 h-5 w-5 ${ARROW_HOVER_CLASS}`));
      card.append(top, el("p", "mt-3 leading-relaxed text-muted print:mt-1", project.desc));

      // 사용 기술은 "JAVASCRIPT // TAILWIND CSS" 같은 작은 메타 글자로 표시
      const stack = project.stack ?? [];
      if (stack.length > 0) {
        const ul = el(
          "ul",
          "meta-list mt-6 flex flex-wrap gap-y-1 text-xs font-medium uppercase tracking-[0.12em] text-faint print:mt-2"
        );
        ul.append(...stack.map((tech) => el("li", null, tech)));
        card.append(ul);
      }

      if (linked) {
        // 링크의 ::after가 카드 전체를 덮어서 카드 어디를 눌러도 이동합니다.
        const link = externalLink(
          project.link,
          "코드 보기",
          "stretched-link mt-auto self-start pt-6 text-sm font-medium text-accent-ink underline decoration-1 underline-offset-4 after:absolute after:inset-0 print:pt-1 print:no-underline"
        );
        link.setAttribute("aria-label", `${project.name} 코드 보기, 새 창에서 열기`);
        card.append(link);
      }
      return card;
    })
  );
  toggleSection("projects", projects.length > 0);
}

function renderEducation(education) {
  const list = document.getElementById("education-list");
  list.replaceChildren(
    ...education.map((entry) => entryRow(entry.period, entry.school, entry.major).row)
  );
  toggleSection("education", education.length > 0);
}

function renderSocial(social) {
  const list = document.getElementById("social-list");
  list.replaceChildren(
    ...social.map((link) => {
      const item = el("li");
      const a = externalLink(
        link.url,
        null,
        "group flex items-center justify-between gap-4 border-b border-line py-4 text-xl tracking-tight text-fg transition-colors hover:text-accent-ink motion-reduce:transition-none print:border-0 print:py-0 print:text-sm"
      );
      a.append(el("span", null, link.name), icon("arrowUpRight", `h-5 w-5 ${ARROW_HOVER_CLASS}`));
      a.setAttribute("aria-label", `${link.name} 새 창에서 열기`);
      item.append(a);
      return item;
    })
  );
  toggleSection("social", social.length > 0);
}

function renderResume(resume) {
  renderProfile(resume.profile ?? {});
  renderAbout(resume.about);
  renderSkills(resume.skills ?? []);
  renderExperience(resume.experience ?? []);
  renderProjects(resume.projects ?? []);
  renderEducation(resume.education ?? []);
  renderSocial(resume.social ?? []);

  document.getElementById("footer-name").textContent =
    resume.profile?.name ? `© ${resume.profile.name}` : "";
}

// ---- 테마 (라이트 / 다크) ----
// 처음 테마는 index.html <head>의 짧은 스크립트가 정합니다. 여기서는 버튼과 시스템 설정 변경을 처리합니다.

function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function setTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
  document.getElementById("theme-toggle")?.setAttribute("aria-pressed", String(isDark));
}

function initTheme() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  setTheme(document.documentElement.classList.contains("dark"));

  button.addEventListener("click", () => {
    const isDark = !document.documentElement.classList.contains("dark");
    setTheme(isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch {
      // 저장하지 못해도 이번 화면에서는 전환됩니다.
    }
  });

  // 사용자가 직접 고른 적이 없으면 시스템 설정이 바뀔 때 따라갑니다.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    if (!readSavedTheme()) setTheme(event.matches);
  });
}

initTheme();

if (window.RESUME) {
  renderResume(window.RESUME);
} else {
  console.error("window.RESUME이 없습니다. data.js를 먼저 불러왔는지 확인하세요.");
}
