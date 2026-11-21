// data.js의 window.PROFILE을 화면에 그리고, 인터랙션을 연결합니다.
// 모든 텍스트는 textContent로 넣어 HTML로 해석되지 않게 합니다.
(function () {
  "use strict";

  var P = window.PROFILE;
  var SVG_NS = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 요소 생성 도우미
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // 아이콘 모음(<symbol>)에서 아이콘을 하나 만듭니다.
  function icon(name, className) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", className);
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  /* ---------- 렌더링 ---------- */

  var meta = P.nameEn + "  //  " + P.role + " " + P.position + "  //  " + P.hero;
  var binds = {
    name: P.name,
    subtitle: P.subtitle,
    role: P.role,
    position: P.position,
    hero: P.hero,
    intro: P.intro,
    meta: meta,
  };
  document.querySelectorAll("[data-bind]").forEach(function (node) {
    var key = node.getAttribute("data-bind");
    if (key in binds) node.textContent = binds[key];
  });

  // 히어로 헤드라인 (강조 단어만 다른 색)
  var headline = document.getElementById("headline");
  P.headline.forEach(function (part) {
    headline.appendChild(part.em ? el("span", "text-lime", part.text) : document.createTextNode(part.text));
  });

  // 히어로 이미지: 불러오기에 성공하면 표창 장식 대신 보여줍니다.
  var heroImg = document.getElementById("hero-img");
  if (P.heroImage) {
    heroImg.addEventListener("load", function () {
      heroImg.classList.remove("hidden");
      document.getElementById("hero-fallback").classList.add("hidden");
    });
    heroImg.alt = P.heroImageAlt || "";
    heroImg.src = P.heroImage;
  }

  // 난이도 별점
  var diff = document.getElementById("difficulty");
  diff.textContent = "★★★".slice(0, P.difficulty) + "☆☆☆".slice(0, 3 - P.difficulty);
  diff.setAttribute("aria-label", "난이도 3점 만점에 " + P.difficulty + "점");

  // 능력 아이콘 + 설명 전환
  var abilityBox = document.getElementById("abilities");
  var abilityTitle = document.getElementById("ability-title");
  var abilityDesc = document.getElementById("ability-desc");
  var abilityBtns = P.abilities.map(function (a, i) {
    // 메뉴 행 형태: 어두운 아이콘 타일 + 제목 + 작은 보조 글
    var btn = el("button", "ability-row flex w-full items-center gap-4 px-5 py-3 text-left");
    btn.type = "button";
    var tile = el("span", "tile flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white");
    tile.appendChild(icon(a.icon, "h-6 w-6"));
    var text = el("span", "flex flex-col");
    text.appendChild(el("span", "text-lg font-semibold leading-tight", a.title));
    text.appendChild(el("span", "mt-1 text-xs text-muted", "능력 " + pad2(i + 1)));
    btn.appendChild(tile);
    btn.appendChild(text);
    btn.addEventListener("click", function () {
      selectAbility(i);
    });
    abilityBox.appendChild(btn);
    return btn;
  });
  function selectAbility(index) {
    abilityBtns.forEach(function (b, i) {
      b.setAttribute("aria-pressed", String(i === index));
    });
    abilityTitle.textContent = P.abilities[index].title;
    abilityDesc.textContent = P.abilities[index].desc;
  }
  selectAbility(0);

  // 기술 스택
  var skillList = document.getElementById("skill-list");
  P.skills.forEach(function (s) {
    var li = el("li");
    var head = el("div", "flex items-end justify-between gap-4");
    head.appendChild(el("span", "text-xl font-semibold sm:text-2xl", s.name));
    var num = el("span", "text-5xl font-extrabold tabular-nums text-accent sm:text-7xl");
    var count = el("span", null, "0");
    count.setAttribute("data-target", s.value);
    num.appendChild(count);
    num.appendChild(el("span", "text-2xl text-muted sm:text-3xl", "%"));
    head.appendChild(num);

    var track = el("div", "mt-6 h-3 w-full overflow-hidden rounded-full bg-line shadow-inner");
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", s.name);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", s.value);
    var fill = el("div", "skill-fill h-full rounded-full");
    fill.setAttribute("data-target", s.value);
    track.appendChild(fill);

    var scale = el("div", "mt-3 flex justify-between text-[11px] font-medium tracking-widest text-muted");
    ["0", "50", "100"].forEach(function (t) {
      scale.appendChild(el("span", null, t));
    });

    li.appendChild(head);
    li.appendChild(track);
    li.appendChild(scale);
    skillList.appendChild(li);
  });

  // 프로젝트 카드 3개
  var projectList = document.getElementById("project-list");
  var total = pad2(P.projects.length);
  P.projects.forEach(function (p, i) {
    var li = el("li", "reveal");
    li.style.transitionDelay = i * 120 + "ms";
    var card = el("article", "project-card panel relative flex h-full flex-col overflow-hidden rounded-lg");

    // 카드 윗부분: 아이콘 타일 + 번호
    var top = el("div", "panel-top flex items-center justify-between px-6 py-5");
    var tile = el("span", "tile flex h-14 w-14 items-center justify-center rounded-lg text-lime");
    tile.appendChild(icon(p.icon, "h-7 w-7"));
    top.appendChild(tile);
    var idx = el("p", "flex items-baseline gap-1 font-semibold text-muted");
    idx.appendChild(el("span", "text-2xl leading-none text-ink", pad2(i + 1)));
    idx.appendChild(el("span", "text-sm", "/ " + total));
    top.appendChild(idx);
    card.appendChild(top);

    var body = el("div", "flex flex-1 flex-col px-6 pb-7 pt-5");
    body.appendChild(el("p", "text-xs font-bold tracking-widest text-accent", p.label));
    body.appendChild(el("h3", "mt-2 text-2xl font-extrabold tracking-tight", p.title));
    body.appendChild(el("p", "mt-3 leading-relaxed text-muted", p.desc));
    card.appendChild(body);
    li.appendChild(card);
    projectList.appendChild(li);
  });

  // 연락처
  var emailLink = document.getElementById("email-link");
  emailLink.href = "mailto:" + P.email;
  emailLink.textContent = P.email;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- 헤더 ---------- */

  var header = document.getElementById("site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 현재 보고 있는 섹션의 메뉴에 밑줄
  var navLinks = document.querySelectorAll(".nav-link");
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("main > section").forEach(function (s) {
    sectionObserver.observe(s);
  });

  /* ---------- 모바일 메뉴 ---------- */

  var menu = document.getElementById("mobile-menu");
  var menuBtn = document.getElementById("menu-btn");
  var menuClose = document.getElementById("menu-close");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) menuClose.focus();
    else menuBtn.focus({ preventScroll: true });
  }
  menuBtn.addEventListener("click", function () {
    setMenu(true);
  });
  menuClose.addEventListener("click", function () {
    setMenu(false);
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      setMenu(false);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
  });

  /* ---------- 스크롤 등장 + 스킬 애니메이션 ---------- */

  function animateSkills() {
    document.querySelectorAll(".skill-fill").forEach(function (f) {
      f.style.width = f.getAttribute("data-target") + "%";
    });
    document.querySelectorAll("#skill-list [data-target]:not(.skill-fill)").forEach(function (c) {
      var target = Number(c.getAttribute("data-target"));
      if (reduceMotion) {
        c.textContent = target;
        return;
      }
      var start = null;
      var duration = 1600;
      function step(t) {
        if (start === null) start = t;
        var k = Math.min((t - start) / duration, 1);
        c.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        if (entry.target.closest("#skills")) animateSkills();
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll(".reveal").forEach(function (r) {
    revealObserver.observe(r);
  });

  /* ---------- 이메일 복사 ---------- */

  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2000);
  }

  // clipboard API를 못 쓰는 환경(file:// 등)에서는 임시 입력창으로 복사합니다.
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  document.getElementById("copy-btn").addEventListener("click", function () {
    var done = function () {
      showToast("이메일이 복사되었습니다");
    };
    var fail = function () {
      if (fallbackCopy(P.email)) done();
      else showToast("복사하지 못했습니다. 직접 선택해 주세요");
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(P.email).then(done, fail);
    } else {
      fail();
    }
  });
})();
