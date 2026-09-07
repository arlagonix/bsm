import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { parse as parseYaml } from "yaml";

const root = resolve(".");
const workspace = join(root, "workspace");
const output = join(root, "build");
const temp = join(root, ".build-temp");
const workspaceAssets = join(workspace, ".workspace", "assets");
const customCss = join(workspaceAssets, "style.css");
const workspaceConfigPath = join(workspace, "workspace.yaml");
const baseUrl = "https://arlagonix.github.io/bsm";

if (!existsSync(customCss)) {
  console.error(`Custom CSS not found: ${customCss}`);
  process.exit(1);
}

const workspaceConfig = existsSync(workspaceConfigPath)
  ? parseYaml(readFileSync(workspaceConfigPath, "utf8")) ?? {}
  : {};

const catalogNames = readdirSync(workspace, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => existsSync(join(workspace, name, ".doc-root.yaml")));

if (!catalogNames.length) {
  console.error("No Gramax catalogs found.");
  process.exit(1);
}

const catalogs = catalogNames
  .map((name) => {
    const configPath = join(workspace, name, ".doc-root.yaml");
    const config = parseYaml(readFileSync(configPath, "utf8")) ?? {};

    return {
      name,
      title: config.title || name,
      description: config.description || "",
      logo: config.logo || null,
      style: config.style || null,
      group: config.group || null,
      order: Number.isFinite(Number(config.order)) ? Number(config.order) : 999999,
    };
  })
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

console.log(`Catalogs: ${catalogs.map((catalog) => catalog.name).join(", ")}`);

rmSync(output, { recursive: true, force: true });
rmSync(temp, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
mkdirSync(temp, { recursive: true });

for (const catalog of catalogs) {
  const catalogSource = join(workspace, catalog.name);
  const catalogTemp = join(temp, catalog.name);

  console.log(`\nBuilding ${catalog.name}...`);

  const command = [
    "npx gramax-cli build",
    `--source "${catalogSource}"`,
    `--destination "${catalogTemp}"`,
    `--custom-css "${customCss}"`,
    `--base-url "${baseUrl}"`,
  ].join(" ");

  const result = spawnSync(command, {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });

  if (result.error) {
    console.error(`Failed to start Gramax for ${catalog.name}:`, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Gramax build failed for ${catalog.name}. Exit code: ${result.status}`);
    process.exit(result.status ?? 1);
  }

  /*
   * Shared Gramax assets. Do not copy root index/SEO files from individual
   * catalog builds because this wrapper owns the workspace root.
   */
  for (const entry of readdirSync(catalogTemp, { withFileTypes: true })) {
    if (
      entry.name === catalog.name ||
      entry.name === "index.html" ||
      entry.name === "sitemap.xml" ||
      entry.name === "robots.txt"
    ) {
      continue;
    }

    cpSync(join(catalogTemp, entry.name), join(output, entry.name), {
      recursive: true,
      force: true,
    });
  }

  const generatedCatalog = join(catalogTemp, catalog.name);

  if (!existsSync(generatedCatalog)) {
    console.error(`Expected generated catalog not found: ${generatedCatalog}`);
    process.exit(1);
  }

  const generatedCustomCss = join(generatedCatalog, "styles.css");
  if (!existsSync(generatedCustomCss)) {
    console.error(`Gramax did not generate custom CSS for ${catalog.name}: ${generatedCustomCss}`);
    process.exit(1);
  }

  cpSync(generatedCatalog, join(output, catalog.name), {
    recursive: true,
    force: true,
  });

  /*
   * Gramax's runtime can replace #dynamic-styles with an empty style element
   * after startup in our synthetic multi-catalog workspace. Keep a permanent
   * stylesheet link that the runtime does not manage.
   */
  pinCatalogCustomStyle(catalog.name);

  console.log(`Finished ${catalog.name}`);
}

/*
 * Workspace homepage assets.
 */
const homeAssets = join(output, "home-assets");
mkdirSync(homeAssets, { recursive: true });

// Apply the same workspace custom CSS to our generated homepage.
copyFileSync(customCss, join(homeAssets, "style.css"));

// Prefer workspace custom home logos.
// Supported names:
//   home_logo_light.svg / home_logo_light.png
//   home_logo_dark.svg  / home_logo_dark.png
// SVG wins if both formats exist.
const customHomeLogoLight = findWorkspaceAssetVariant("home_logo_light");
const customHomeLogoDark = findWorkspaceAssetVariant("home_logo_dark");

let homeLogoLight = null;
let homeLogoDark = null;

if (customHomeLogoLight) {
  const extension = extname(customHomeLogoLight).toLowerCase();
  copyFileSync(customHomeLogoLight, join(homeAssets, `home-logo-light${extension}`));
  homeLogoLight = `./home-assets/home-logo-light${extension}`;
}

if (customHomeLogoDark) {
  const extension = extname(customHomeLogoDark).toLowerCase();
  copyFileSync(customHomeLogoDark, join(homeAssets, `home-logo-dark${extension}`));
  homeLogoDark = `./home-assets/home-logo-dark${extension}`;
}

for (const catalog of catalogs) {
  if (!catalog.logo) continue;

  const logoSource = join(workspace, catalog.name, catalog.logo);
  if (!existsSync(logoSource)) continue;

  const extension = extname(catalog.logo);
  const logoName = `${safeFileName(catalog.name)}${extension}`;
  copyFileSync(logoSource, join(homeAssets, logoName));
  catalog.homeLogo = `./home-assets/${encodeURIComponent(logoName)}`;
}

/*
 * Workspace root sections.
 *
 * This follows Gramax's actual root-page behavior:
 * - only top-level entries with view: section render inline on "/"
 * - catalogs are assigned by explicit `catalogs:` and, for top-level
 *   sections, by catalog `group:` as Gramax also does
 * - catalogs that were not assigned render under "Other"
 */
const sectionsConfig = workspaceConfig.sections ?? workspaceConfig.groups ?? {};
const catalogByName = new Map(catalogs.map((catalog) => [catalog.name, catalog]));
const assigned = new Set();
const groups = [];

for (const [key, section] of Object.entries(sectionsConfig)) {
  if (!section || typeof section !== "object") continue;
  if (section.view !== "section") continue;

  const explicitNames = Array.isArray(section.catalogs)
    ? section.catalogs.map(String)
    : [];

  const sectionCatalogs = [];

  const addCatalog = (catalog) => {
    if (!catalog || assigned.has(catalog.name)) return;
    sectionCatalogs.push(catalog);
    assigned.add(catalog.name);
  };

  for (const name of explicitNames) {
    addCatalog(catalogByName.get(name));
  }

  for (const catalog of catalogs) {
    if (catalog.group === key && !explicitNames.includes(catalog.name)) {
      addCatalog(catalog);
    }
  }

  if (sectionCatalogs.length > 0) {
    groups.push({
      title: section.title || key,
      description: section.description || null,
      catalogs: sectionCatalogs,
    });
  }
}

const unassigned = catalogs.filter((catalog) => !assigned.has(catalog.name));

if (groups.length === 0) {
  groups.push({
    title: null,
    description: null,
    catalogs,
  });
} else if (unassigned.length > 0) {
  groups.push({
    title: "Other",
    description: null,
    catalogs: unassigned,
  });
}

console.log(
  "Workspace sections:",
  groups
    .map((group) => `${group.title ?? "(root)"}: ${group.catalogs.map((c) => c.name).join(", ")}`)
    .join(" | "),
);

/*
 * Cross-catalog static search index.
 */
const searchIndex = [];

for (const catalog of catalogs) {
  const catalogRoot = join(workspace, catalog.name);

  for (const file of walkFiles(catalogRoot)) {
    if (!file.toLowerCase().endsWith(".md")) continue;

    const relativePath = relative(catalogRoot, file);
    const source = readFileSync(file, "utf8");
    const { frontmatter, body } = splitFrontmatter(source);

    const firstHeading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const title =
      frontmatter?.title ||
      firstHeading ||
      fallbackTitle(relativePath);

    const cleanBody = markdownToText(body);

    searchIndex.push({
      catalog: catalog.title,
      title,
      href: markdownPathToHref(catalog.name, relativePath),
      text: cleanBody.slice(0, 20000),
    });
  }
}

writeFileSync(
  join(output, "index.html"),
  renderHomePage({
    workspaceName: workspaceConfig.name || "Gramax",
    workspaceIcon: workspaceConfig.icon || "layers",
    groups,
    searchIndex,
    homeLogoLight,
    homeLogoDark,
  }),
  "utf8",
);

injectGlobalFavicons(customHomeLogoLight, customHomeLogoDark);

writeFileSync(join(output, ".nojekyll"), "", "utf8");

rmSync(temp, { recursive: true, force: true });

console.log("\nBuild complete.");
console.log(`Output: ${output}`);

function renderHomePage({
  workspaceName,
  workspaceIcon,
  groups,
  searchIndex,
  homeLogoLight,
  homeLogoDark,
}) {
  const sectionsHtml = groups
    .filter((group) => group.catalogs.length > 0)
    .map(
      (group) => `
<section class="workspace-section">
  ${group.title ? `<h2>${escapeHtml(group.title)}</h2>` : ""}
  ${
    group.description
      ? `<p class="section-description">${escapeHtml(group.description)}</p>`
      : ""
  }
  <div class="catalog-grid">
    ${group.catalogs.map(renderCatalogCard).join("\n")}
  </div>
</section>`,
    )
    .join("\n");

  const serializedSearch = JSON.stringify(searchIndex).replaceAll("<", "\\u003C");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${escapeHtml(workspaceName)}</title>

  <script>
    // Gramax static builds persist settings under this Zustand key.
    window.__GRAMAX_SETTINGS_KEY__ = "app-settings-cache";

    window.__readGramaxTheme__ = function () {
      try {
        const raw = localStorage.getItem(window.__GRAMAX_SETTINGS_KEY__);
        if (raw) {
          const parsed = JSON.parse(raw);
          const theme = parsed?.state?.values?.general?.theme;
          if (theme === "dark" || theme === "light") return theme;
        }
      } catch {}

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    window.__setGramaxTheme__ = function (theme) {
      try {
        const key = window.__GRAMAX_SETTINGS_KEY__;
        const raw = localStorage.getItem(key);

        let parsed = raw
          ? JSON.parse(raw)
          : { state: { values: {} }, version: 1 };

        parsed.state ??= {};
        parsed.state.values ??= {};
        parsed.state.values.general ??= {};
        parsed.state.values.general.theme = theme;

        if (parsed.version == null) parsed.version = 1;

        localStorage.setItem(key, JSON.stringify(parsed));
      } catch {}

      document.body?.setAttribute("data-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    };

    document.documentElement.setAttribute("data-theme", window.__readGramaxTheme__());
  </script>

  <style>
    :root {
      --bg: #f8f9fb;
      --surface: #fff;
      --surface-hover: #f5f6f8;
      --text: #20242b;
      --muted: #737a84;
      --border: #dfe3e8;
      --header-bg: rgba(248,249,251,.84);
      --shadow: 0 2px 5px rgba(20,24,31,.08);
      --overlay: rgba(15,18,22,.42);
    }

    [data-theme="dark"] {
      --bg: #111214;
      --surface: #1b1d20;
      --surface-hover: #24272c;
      --text: #f0f1f3;
      --muted: #a0a6af;
      --border: #32363c;
      --header-bg: rgba(17,18,20,.86);
      --shadow: 0 2px 6px rgba(0,0,0,.28);
      --overlay: rgba(0,0,0,.62);
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
    }

    body {
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, sans-serif;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      width: 100%;
      background: var(--header-bg);
      backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border);
    }

    .topbar-inner {
      width: min(1144px, calc(100% - 48px));
      min-height: 58px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .workspace-brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      color: var(--text);
      text-decoration: none;
      font-size: 17px;
      font-weight: 500;
    }

    .workspace-brand svg {
      flex: 0 0 auto;
    }

    .workspace-brand-logo {
      width: 22px;
      height: 22px;
      object-fit: contain;
      flex: 0 0 auto;
    }

    .workspace-brand-logo.dark {
      display: none;
    }

    [data-theme="dark"] .workspace-brand-logo.light {
      display: none;
    }

    [data-theme="dark"] .workspace-brand-logo.dark {
      display: block;
    }

    .workspace-brand span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-button {
      width: 40px;
      height: 40px;
      padding: 0;
      border: 0;
      border-radius: 9px;
      background: transparent;
      color: var(--text);
      display: grid;
      place-items: center;
      cursor: pointer;
    }

    .icon-button:hover {
      background: var(--surface-hover);
    }

    main {
      width: min(1144px, calc(100% - 48px));
      margin: 0 auto;
      padding: 32px 0 56px;
    }

    .workspace-section + .workspace-section { margin-top: 48px; }

    .workspace-section h2 {
      margin: 0 0 24px;
      text-align: center;
      font-size: 24px;
      line-height: 1.25;
      font-weight: 600;
    }

    .section-description {
      max-width: 680px;
      margin: -12px auto 24px;
      color: var(--muted);
      text-align: center;
      font-size: 15px;
      line-height: 1.5;
    }

    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .catalog-card {
      position: relative;
      height: 132px;
      min-width: 0;
      padding: 16px 18px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--surface);
      box-shadow: var(--shadow);
      color: var(--text);
      text-decoration: none;
      overflow: hidden;
      transition: transform .14s ease, box-shadow .14s ease, background .14s ease;
    }

    .catalog-card:hover {
      transform: translateY(-1px);
      background: var(--surface-hover);
      box-shadow: 0 4px 10px rgba(20,24,31,.10);
    }

    .catalog-title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 18px;
      line-height: 1.25;
      font-weight: 600;
    }

    .catalog-description {
      margin-top: 7px;
      padding-right: 52px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.35;
    }

    .catalog-logo {
      position: absolute;
      width: 52px;
      height: 52px;
      right: 0;
      bottom: 0;
      object-fit: contain;
      object-position: right bottom;
    }

    .search-overlay {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding: 12vh 20px 20px;
      background: var(--overlay);
    }

    .search-overlay.open { display: flex; }

    .search-dialog {
      width: min(680px, 100%);
      max-height: 70vh;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--surface);
      box-shadow: 0 18px 60px rgba(0,0,0,.24);
    }

    .search-input-wrap {
      padding: 14px;
      border-bottom: 1px solid var(--border);
    }

    #workspace-search-input {
      width: 100%;
      padding: 11px 13px;
      border: 1px solid var(--border);
      border-radius: 9px;
      outline: none;
      background: var(--bg);
      color: var(--text);
      font: inherit;
      font-size: 16px;
    }

    #workspace-search-input:focus {
      border-color: color-mix(in srgb, var(--text) 35%, var(--border));
    }

    .search-results {
      max-height: calc(70vh - 76px);
      overflow-y: auto;
      padding: 8px;
    }

    .search-result {
      display: block;
      padding: 11px 12px;
      border-radius: 9px;
      color: var(--text);
      text-decoration: none;
    }

    .search-result:hover { background: var(--surface-hover); }

    .search-result-title {
      font-weight: 600;
      margin-bottom: 3px;
    }

    .search-result-meta,
    .search-result-snippet {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.4;
    }

    .search-result-snippet {
      margin-top: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .search-empty {
      padding: 24px;
      color: var(--muted);
      text-align: center;
    }

    @media (max-width: 920px) {
      .catalog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (max-width: 560px) {
      .topbar-inner,
      main { width: min(100% - 32px, 1144px); }

      .catalog-grid { grid-template-columns: 1fr; }
      .workspace-section h2 { font-size: 22px; }
    }
  </style>

  <!-- Workspace custom CSS is loaded last, just like Gramax. -->
  <link id="workspace-custom-style-link" rel="stylesheet" href="./home-assets/style.css">
</head>

<body id="custom-style">
  <script>
    document.body.setAttribute("data-theme", document.documentElement.getAttribute("data-theme") || "light");
  </script>

  <header class="topbar">
    <div class="topbar-inner">
      <a class="workspace-brand" href="./" aria-label="${escapeHtml(workspaceName)}">
        ${
          homeLogoLight
            ? `<img class="workspace-brand-logo light" src="${homeLogoLight}" alt="">`
            : workspaceIconSvg(workspaceIcon)
        }
        ${
          homeLogoDark
            ? `<img class="workspace-brand-logo dark" src="${homeLogoDark}" alt="">`
            : ""
        }
        <span>${escapeHtml(workspaceName)}</span>
      </a>

      <div class="top-actions">
        <button class="icon-button" id="search-button" type="button" aria-label="Search" title="Search">
          ${searchIcon()}
        </button>

        <button class="icon-button" id="theme-toggle" type="button" aria-label="Toggle theme" title="Toggle theme">
          <span id="theme-icon"></span>
        </button>
      </div>
    </div>
  </header>

  <main>
    ${sectionsHtml || `<div class="search-empty">No catalogs found.</div>`}
  </main>

  <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true">
    <div class="search-dialog">
      <div class="search-input-wrap">
        <input
          id="workspace-search-input"
          type="search"
          placeholder="Search all catalogs…"
          autocomplete="off"
        >
      </div>
      <div class="search-results" id="search-results">
        <div class="search-empty">Start typing to search all catalogs.</div>
      </div>
    </div>
  </div>

  <script>
    const SEARCH_INDEX = ${serializedSearch};

    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    function applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      document.body.setAttribute("data-theme", theme);
      themeIcon.innerHTML = theme === "dark"
        ? ${JSON.stringify(moonIcon())}
        : ${JSON.stringify(sunIcon())};
    }

    applyTheme(window.__readGramaxTheme__());

    themeButton.addEventListener("click", () => {
      const current = window.__readGramaxTheme__();
      const next = current === "dark" ? "light" : "dark";
      window.__setGramaxTheme__(next);
      applyTheme(next);
    });

    window.addEventListener("storage", (event) => {
      if (event.key === window.__GRAMAX_SETTINGS_KEY__) {
        applyTheme(window.__readGramaxTheme__());
      }
    });

    const overlay = document.getElementById("search-overlay");
    const searchButton = document.getElementById("search-button");
    const input = document.getElementById("workspace-search-input");
    const results = document.getElementById("search-results");

    function openSearch() {
      overlay.classList.add("open");
      input.focus();
      input.select();
      renderSearch();
    }

    function closeSearch() {
      overlay.classList.remove("open");
    }

    function escapeHtmlClient(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function renderSearch() {
      const query = input.value.trim().toLocaleLowerCase();

      if (!query) {
        results.innerHTML = '<div class="search-empty">Start typing to search all catalogs.</div>';
        return;
      }

      const matches = SEARCH_INDEX
        .map((item) => {
          const title = item.title.toLocaleLowerCase();
          const text = item.text.toLocaleLowerCase();
          let score = 0;

          if (title === query) score += 100;
          if (title.startsWith(query)) score += 50;
          if (title.includes(query)) score += 25;
          if (text.includes(query)) score += 5;

          return { item, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

      if (!matches.length) {
        results.innerHTML = '<div class="search-empty">No results.</div>';
        return;
      }

      results.innerHTML = matches.map(({ item }) => {
        const lower = item.text.toLocaleLowerCase();
        const pos = lower.indexOf(query);
        const start = Math.max(0, pos >= 0 ? pos - 80 : 0);
        const snippet = item.text.slice(start, start + 220).trim();

        return \`
          <a class="search-result" href="\${item.href}">
            <div class="search-result-title">\${escapeHtmlClient(item.title)}</div>
            <div class="search-result-meta">\${escapeHtmlClient(item.catalog)}</div>
            <div class="search-result-snippet">\${escapeHtmlClient(snippet)}</div>
          </a>
        \`;
      }).join("");
    }

    searchButton.addEventListener("click", openSearch);
    input.addEventListener("input", renderSearch);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeSearch();
    });

    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }

      if (event.key === "Escape") closeSearch();
    });
  </script>
</body>
</html>`;
}

function renderCatalogCard(catalog) {
  return `
<a class="catalog-card" href="./${encodeURIComponent(catalog.name)}/">
  <div class="catalog-title">${escapeHtml(catalog.title)}</div>
  ${
    catalog.description
      ? `<div class="catalog-description">${escapeHtml(catalog.description)}</div>`
      : ""
  }
  ${
    catalog.homeLogo
      ? `<img class="catalog-logo" src="${catalog.homeLogo}" alt="">`
      : ""
  }
</a>`;
}

function walkFiles(dir) {
  const result = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".doc-root.yaml") continue;

    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push(...walkFiles(path));
    } else {
      result.push(path);
    }
  }

  return result;
}

function splitFrontmatter(source) {
  if (!source.startsWith("---")) {
    return { frontmatter: {}, body: source };
  }

  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);

  if (!match) {
    return { frontmatter: {}, body: source };
  }

  let frontmatter = {};
  try {
    frontmatter = parseYaml(match[1]) ?? {};
  } catch {}

  return {
    frontmatter,
    body: source.slice(match[0].length),
  };
}

function markdownToText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackTitle(relativePath) {
  const file = relativePath.split(/[\\/]/).pop() || relativePath;
  const name = file.replace(/\.md$/i, "").replace(/^_index$/i, "");
  return name
    ? name.replaceAll("-", " ").replaceAll("_", " ")
    : "Home";
}

function markdownPathToHref(catalogName, relativePath) {
  const normalized = relativePath.split(sep).join("/");
  const withoutExt = normalized.replace(/\.md$/i, "");
  const parts = withoutExt.split("/");

  if (parts.at(-1) === "_index") parts.pop();

  const encoded = parts
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `./${encodeURIComponent(catalogName)}/${encoded}${encoded ? "/" : ""}`;
}


function pinCatalogCustomStyle(catalogName) {
  const catalogOutput = join(output, catalogName);
  const marker = 'data-bsm-custom-style="true"';
  const href = `${catalogName}/styles.css`;

  for (const file of walkFiles(catalogOutput)) {
    if (!file.toLowerCase().endsWith(".html")) continue;

    let html = readFileSync(file, "utf8");

    if (html.includes("data-bsm-custom-style")) continue;

    const link = `<link rel="stylesheet" href="${href}" ${marker}>`;

    /*
     * Generated Gramax pages already contain a <base> tag, so the same
     * catalogName/styles.css URL resolves correctly from nested pages and
     * from GitHub Pages subpaths.
     */
    html = html.replace("</head>", `  ${link}\n</head>`);
    writeFileSync(file, html, "utf8");
  }
}

function findWorkspaceAssetVariant(baseName) {
  // Prefer scalable/modern formats first when several variants exist.
  for (const extension of [
    ".svg",
    ".png",
    ".webp",
    ".avif",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".bmp",
  ]) {
    const candidate = join(workspaceAssets, `${baseName}${extension}`);
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

function fileToDataUrl(file) {
  if (!file) return null;

  const extension = extname(file).toLowerCase();
  const mime =
    {
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".webp": "image/webp",
      ".avif": "image/avif",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".ico": "image/x-icon",
      ".bmp": "image/bmp",
    }[extension] || "application/octet-stream";

  return `data:${mime};base64,${readFileSync(file).toString("base64")}`;
}

function injectGlobalFavicons(lightSource, darkSource) {
  if (!lightSource && !darkSource) return;

  const lightData = fileToDataUrl(lightSource || darkSource);
  const darkData = fileToDataUrl(darkSource || lightSource);

  const faviconBlock = `
  <link id="bsm-favicon" rel="icon" href="${lightData}">
  <script id="bsm-favicon-theme">
    (() => {
      const lightIcon = ${JSON.stringify(lightData)};
      const darkIcon = ${JSON.stringify(darkData)};

      const readTheme = () => {
        const attr =
          document.documentElement.getAttribute("data-theme") ||
          document.body?.getAttribute("data-theme");

        if (attr === "light" || attr === "dark") return attr;

        try {
          const raw = localStorage.getItem("app-settings-cache");
          if (raw) {
            const parsed = JSON.parse(raw);
            const theme = parsed?.state?.values?.general?.theme;
            if (theme === "light" || theme === "dark") return theme;
          }
        } catch {}

        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      };

      const applyFavicon = () => {
        const link = document.getElementById("bsm-favicon");
        if (!link) return;
        link.href = readTheme() === "dark" ? darkIcon : lightIcon;
      };

      applyFavicon();

      new MutationObserver(applyFavicon).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });

      window.addEventListener("storage", applyFavicon);
      window.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener?.("change", applyFavicon);
    })();
  </script>
`;

  for (const file of walkFiles(output)) {
    if (!file.toLowerCase().endsWith(".html")) continue;

    let html = readFileSync(file, "utf8");

    if (html.includes('id="bsm-favicon"')) continue;

    html = html.replace("</head>", `${faviconBlock}</head>`);
    writeFileSync(file, html, "utf8");
  }
}

function findFile(dir, predicate) {
  if (!existsSync(dir)) return null;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      const found = findFile(path, predicate);
      if (found) return found;
    } else if (predicate(entry.name)) {
      return path;
    }
  }

  return null;
}

function safeFileName(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function workspaceIconSvg(icon) {
  switch (icon) {
    case "book-open":
    case "book-open-text":
      return `
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H9a3 3 0 0 1 3 3v17a3 3 0 0 0-3-3H4.5A2.5 2.5 0 0 0 2 21.5v-17Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H15a3 3 0 0 0-3 3v17a3 3 0 0 1 3-3h4.5a2.5 2.5 0 0 1 2.5 2.5v-17Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
</svg>`;

    case "folder":
      return `
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l2 2h7.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-10Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
</svg>`;

    case "layers":
    default:
      return `
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="m12 2 9 5-9 5-9-5 9-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="m3 12 9 5 9-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m3 17 9 5 9-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }
}

function searchIcon() {
  return `
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
  <path d="m20 20-4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;
}

function sunIcon() {
  return `
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/>
  <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;
}

function moonIcon() {
  return `
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z"
    stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
</svg>`;
}
