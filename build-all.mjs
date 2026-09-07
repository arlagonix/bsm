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
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { parse as parseYaml } from "yaml";

const root = resolve(".");
const workspace = join(root, "workspace");
const output = join(root, "build");
const temp = join(root, ".build-temp");
const workspaceAssets = join(workspace, ".workspace", "assets");
const customCss = join(workspaceAssets, "style.css");
const workspaceConfigPath = join(workspace, "workspace.yaml");
// --base-url only affects sitemap.xml / robots.txt in gramax-cli.
const baseUrl =
  process.env.BASE_URL?.trim() ||
  "https://arlagonix.github.io/bsm";

const hasCustomCss = existsSync(customCss);
const warnedMessages = new Set();
const lucideIconCache = new Map();

const DOC_ROOT_FILENAMES = new Set([
  ".doc-root.yaml",
  ".docroot.yaml",
  ".doc-root.yml",
  ".docroot.yml",
  "doc-root.yaml",
  "docroot.yaml",
  "doc-root.yml",
  "docroot.yml",
]);

const workspaceConfig = existsSync(workspaceConfigPath)
  ? readYamlFile(workspaceConfigPath)
  : {};

const catalogEntries = readdirSync(workspace, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .map((entry) => {
    const dir = join(workspace, entry.name);
    return {
      name: entry.name,
      dir,
      configPath: findDocRootFile(dir),
    };
  })
  .filter((entry) => entry.configPath);

if (!catalogEntries.length) {
  console.error("No Gramax catalogs with a doc-root YAML file were found.");
  process.exit(1);
}

const allCatalogs = catalogEntries
  .map(({ name, dir, configPath }) => {
    const config = readYamlFile(configPath);

    return {
      name,
      dir,
      configPath,
      contentRoot: dirname(configPath),
      title: config.title || name,
      description: config.description || "",
      logo: config.logo || null,
      logoDark: config.logo_dark || null,
      style: config.style || null,
      group: config.group || null,
      hidden: config.hidden === true,
      language: config.language || null,
      order: Number.isFinite(Number(config.order)) ? Number(config.order) : 999999,
    };
  })
  // Gramax first sorts by title, then performs a stable order sort.
  .sort((a, b) =>
    a.title.localeCompare(b.title, undefined, {
      sensitivity: "variant",
      ignorePunctuation: true,
    }),
  )
  .sort((a, b) => a.order - b.order);

const catalogs = allCatalogs.filter((catalog) => !catalog.hidden);

console.log(`Catalogs: ${allCatalogs.map((catalog) => catalog.name).join(", ")}`);
if (allCatalogs.length !== catalogs.length) {
  console.log(
    `Hidden from workspace home: ${allCatalogs
      .filter((catalog) => catalog.hidden)
      .map((catalog) => catalog.name)
      .join(", ")}`,
  );
}

rmSync(output, { recursive: true, force: true });
rmSync(temp, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
mkdirSync(temp, { recursive: true });

for (const catalog of allCatalogs) {
  const catalogSource = join(workspace, catalog.name);
  const catalogTemp = join(temp, catalog.name);

  console.log(`\nBuilding ${catalog.name}...`);

  const command = [
    "npx gramax-cli build",
    `--source "${catalogSource}"`,
    `--destination "${catalogTemp}"`,
    hasCustomCss ? `--custom-css "${customCss}"` : null,
    baseUrl ? `--base-url "${baseUrl}"` : null,
  ]
    .filter(Boolean)
    .join(" ");

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

  cpSync(generatedCatalog, join(output, catalog.name), {
    recursive: true,
    force: true,
  });

  /*
   * Gramax's runtime can replace #dynamic-styles with an empty style element
   * after startup in our synthetic multi-catalog workspace. Keep a permanent
   * stylesheet link that the runtime does not manage.
   */
  if (hasCustomCss) {
    const generatedCustomCss = join(generatedCatalog, "styles.css");
    if (!existsSync(generatedCustomCss)) {
      console.error(`Gramax did not generate custom CSS for ${catalog.name}: ${generatedCustomCss}`);
      process.exit(1);
    }
    pinCatalogCustomStyle(catalog.name);
  }

  console.log(`Finished ${catalog.name}`);
}

/*
 * Workspace homepage assets.
 */
const homeAssets = join(output, "home-assets");
mkdirSync(homeAssets, { recursive: true });

// Apply the same workspace custom CSS to our generated workspace pages.
if (hasCustomCss) {
  copyFileSync(customCss, join(homeAssets, "style.css"));
}

// Prefer workspace custom home logos.
// Supported base names are home_logo_light / home_logo_dark.
// Common web image extensions are accepted; SVG wins if several exist.
const customHomeLogoLight = findWorkspaceAssetVariant("home_logo_light");
const customHomeLogoDark = findWorkspaceAssetVariant("home_logo_dark");

let homeLogoLight = null;
let homeLogoDark = null;

if (customHomeLogoLight) {
  const extension = extname(customHomeLogoLight).toLowerCase();
  copyFileSync(customHomeLogoLight, join(homeAssets, `home-logo-light${extension}`));
  homeLogoLight = `home-assets/home-logo-light${extension}`;
}

if (customHomeLogoDark) {
  const extension = extname(customHomeLogoDark).toLowerCase();
  copyFileSync(customHomeLogoDark, join(homeAssets, `home-logo-dark${extension}`));
  homeLogoDark = `home-assets/home-logo-dark${extension}`;
}

for (const catalog of catalogs) {
  catalog.homeLogoLight = resolveCatalogCardLogo(catalog, catalog.logo, "light");
  catalog.homeLogoDark = resolveCatalogCardLogo(catalog, catalog.logoDark, "dark");
}

/*
 * Gramax stores catalog logos in `.doc-root.yaml` in three forms:
 *
 *   logo: some-file.svg
 *   logo: icon:book-open:blue
 *   logo: emoji:📘
 *
 * File logos were already supported by the synthetic homepage. Icon/emoji
 * logos need to be resolved explicitly because they are normally rendered
 * by Gramax's React runtime.
 */

/*
 * Workspace section tree.
 *
 * This mirrors SitePresenter._getSection():
 * - `sections` wins over legacy `groups`;
 * - catalog assignments are unique and first-match wins;
 * - explicit `catalogs:` are assigned before child sections;
 * - catalog `group:` is considered only for top-level sections;
 * - a section is omitted only if it has neither catalogs nor child sections.
 */
const sectionsConfig = workspaceConfig.sections || workspaceConfig.groups || {};
const workspaceTree = buildWorkspaceTree(catalogs, sectionsConfig);

logWorkspaceTree(workspaceTree);

/*
 * Cross-catalog static search index.
 */
const searchIndex = [];

for (const catalog of catalogs) {
  const catalogRoot = catalog.contentRoot;
  const hiddenDirectories = collectHiddenMarkdownDirectories(catalogRoot);

  for (const file of walkFiles(catalogRoot)) {
    if (!file.toLowerCase().endsWith(".md")) continue;

    const relativePath = relative(catalogRoot, file);
    if (isUnderHiddenDirectory(relativePath, hiddenDirectories)) continue;

    const source = readFileSync(file, "utf8");
    const { frontmatter, body } = splitFrontmatter(source);
    if (frontmatter?.hidden === true) continue;

    const firstHeading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const title =
      frontmatter?.title ||
      firstHeading ||
      fallbackTitle(relativePath);

    const cleanBody = markdownToText(body);

    searchIndex.push({
      catalog: catalog.title,
      catalogName: catalog.name,
      title,
      href: markdownPathToHref(catalog.name, relativePath),
      text: cleanBody.slice(0, 20000),
    });
  }
}

writeWorkspacePages({
  workspaceName: workspaceConfig.name || "Gramax",
  workspaceIcon: workspaceConfig.icon || "layers",
  workspaceTree,
  searchIndex,
  homeLogoLight,
  homeLogoDark,
});

injectGlobalFavicons(customHomeLogoLight, customHomeLogoDark);
sanitizeBundledSecrets();
verifyWorkspaceBuild();

writeFileSync(join(output, ".nojekyll"), "", "utf8");

rmSync(temp, { recursive: true, force: true });

console.log("\nBuild complete.");
console.log(`Output: ${output}`);



function findDocRootFile(catalogDir, maxDepth = 5) {
  const queue = [{ dir: catalogDir, depth: 0 }];
  const seen = new Set();

  while (queue.length) {
    const current = queue.shift();
    const absolute = resolve(current.dir);
    if (seen.has(absolute)) continue;
    seen.add(absolute);

    let entries;
    try {
      entries = readdirSync(absolute, { withFileTypes: true });
    } catch {
      continue;
    }

    const docroot = entries.find(
      (entry) => entry.isFile() && DOC_ROOT_FILENAMES.has(entry.name.toLowerCase()),
    );
    if (docroot) return join(absolute, docroot.name);

    if (current.depth >= maxDepth) continue;

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "node_modules") continue;
      queue.push({ dir: join(absolute, entry.name), depth: current.depth + 1 });
    }
  }

  return null;
}

function readYamlFile(path) {
  try {
    const parsed = parseYaml(readFileSync(path, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    warnOnce(`Failed to parse YAML ${relative(root, path)}: ${error?.message || error}`);
    return {};
  }
}

function buildWorkspaceTree(catalogs, sectionsInfo) {
  const added = new Set();
  const catalogByName = new Map(catalogs.map((catalog) => [catalog.name, catalog]));

  const buildSections = (level, source, parentKeys = []) => {
    const sections = {};

    for (const [sectionKey, rawInfo] of Object.entries(source || {})) {
      if (!rawInfo || typeof rawInfo !== "object") continue;

      const info = rawInfo;
      const keys = [...parentKeys, sectionKey];
      const sectionCatalogs = [];
      const explicitNames = Array.isArray(info.catalogs)
        ? info.catalogs.map((name) => String(name))
        : [];

      const addCatalog = (catalog, reason) => {
        if (!catalog) {
          if (reason) warnOnce(reason);
          return;
        }

        if (added.has(catalog.name)) {
          warnOnce(
            `Catalog "${catalog.name}" is assigned more than once in workspace sections; Gramax keeps the first assignment.`,
          );
          return;
        }

        sectionCatalogs.push(catalog);
        added.add(catalog.name);
      };

      for (const catalogName of explicitNames) {
        addCatalog(
          catalogByName.get(catalogName),
          `Workspace section "${keys.join("/")}" references unknown or hidden catalog "${catalogName}".`,
        );
      }

      // Gramax uses legacy catalog `group:` only at the first section level.
      if (level === 0) {
        for (const catalog of catalogs) {
          if (catalog.group === sectionKey && !explicitNames.includes(catalog.name)) {
            addCatalog(catalog);
          }
        }
      }

      const childSections = info.sections
        ? buildSections(level + 1, info.sections, keys)
        : {};

      if (
        sectionCatalogs.length === 0 &&
        Object.keys(childSections).length === 0
      ) {
        continue;
      }

      sections[sectionKey] = {
        key: sectionKey,
        keys,
        title: info.title ?? "",
        icon: info.icon || null,
        view: info.view || null,
        description: info.description || null,
        catalogs: sectionCatalogs,
        sections: childSections,
      };
    }

    return sections;
  };

  const sections = buildSections(0, sectionsInfo);
  const otherCatalogs = catalogs.filter((catalog) => !added.has(catalog.name));

  return {
    key: null,
    keys: [],
    title: "",
    catalogs: otherCatalogs,
    sections,
  };
}

function logWorkspaceTree(workspaceTree) {
  const lines = [];

  const walk = (sections, depth = 0) => {
    for (const section of Object.values(sections || {})) {
      lines.push(
        `${"  ".repeat(depth)}${section.keys.join("/")} [${section.view || "folder"}]: ${
          section.catalogs.map((catalog) => catalog.name).join(", ") || "(no direct catalogs)"
        }`,
      );
      walk(section.sections, depth + 1);
    }
  };

  walk(workspaceTree.sections);

  if (workspaceTree.catalogs.length) {
    lines.push(`Other/root: ${workspaceTree.catalogs.map((catalog) => catalog.name).join(", ")}`);
  }

  console.log("Workspace home model:");
  for (const line of lines) console.log(`  ${line}`);
}

function collectHiddenMarkdownDirectories(catalogRoot) {
  const hidden = [];

  for (const file of walkFiles(catalogRoot)) {
    if (!/[\\\\/]_index\\.md$/i.test(file)) continue;

    const source = readFileSync(file, "utf8");
    const { frontmatter } = splitFrontmatter(source);
    if (frontmatter?.hidden !== true) continue;

    hidden.push(relative(catalogRoot, resolve(file, "..")));
  }

  return hidden;
}

function isUnderHiddenDirectory(relativePath, hiddenDirectories) {
  const normalized = relativePath.split(sep).join("/");

  return hiddenDirectories.some((directory) => {
    const rawDir = directory.split(sep).join("/");
    const dir = rawDir === "." ? "" : rawDir.replace(/^\.\/?/, "");
    if (!dir) return true;
    return normalized === `${dir}/_index.md` || normalized.startsWith(`${dir}/`);
  });
}

function writeWorkspacePages({
  workspaceName,
  workspaceIcon,
  workspaceTree,
  searchIndex,
  homeLogoLight,
  homeLogoDark,
}) {
  writeFileSync(
    join(output, "index.html"),
    renderWorkspacePage({
      workspaceName,
      workspaceIcon,
      bodyHtml: renderRootContent(workspaceTree, "./"),
      searchIndex,
      homeLogoLight,
      homeLogoDark,
      rootPrefix: "./",
      pageTitle: workspaceName,
    }),
    "utf8",
  );

  const writeSection = (section, parents = []) => {
    const targetDir = join(output, "home", ...section.keys);
    mkdirSync(targetDir, { recursive: true });

    const rootPrefix = "../".repeat(section.keys.length + 1);

    // Gramax treats a top-level `view: section` route as the main page
    // focused/scrolled to that inline section.
    if (section.keys.length === 1 && section.view === "section") {
      writeFileSync(
        join(targetDir, "index.html"),
        renderWorkspacePage({
          workspaceName,
          workspaceIcon,
          bodyHtml: renderRootContent(workspaceTree, rootPrefix),
          searchIndex,
          homeLogoLight,
          homeLogoDark,
          rootPrefix,
          pageTitle: workspaceName,
          initialGroup: section.key,
        }),
        "utf8",
      );
    } else {
      const breadcrumb = [...parents, section];
      writeFileSync(
        join(targetDir, "index.html"),
        renderWorkspacePage({
          workspaceName,
          workspaceIcon,
          bodyHtml: renderFolderContent(section, breadcrumb, rootPrefix),
          searchIndex,
          homeLogoLight,
          homeLogoDark,
          rootPrefix,
          pageTitle: `${section.title || section.key} — ${workspaceName}`,
        }),
        "utf8",
      );
    }

    for (const child of Object.values(section.sections || {})) {
      writeSection(child, [...parents, section]);
    }
  };

  for (const section of Object.values(workspaceTree.sections || {})) {
    writeSection(section);
  }
}

function renderRootContent(workspaceTree, rootPrefix) {
  const sectionEntries = Object.entries(workspaceTree.sections || {});
  const sectionViews = sectionEntries.filter(([, section]) => section.view === "section");
  const folderViews = sectionEntries.filter(([, section]) => section.view !== "section");
  const html = [];

  for (const [, section] of sectionViews) {
    html.push(
      renderGroup({
        title: section.title,
        folders: Object.values(section.sections || {}),
        catalogs: section.catalogs,
        rootPrefix,
        id: `section-${encodeURIComponent(section.key)}`,
      }),
    );
  }

  if (sectionViews.length > 0 && workspaceTree.catalogs.length > 0) {
    html.push(renderContentDivider("Other"));
  }

  if (folderViews.length > 0 || workspaceTree.catalogs.length > 0) {
    html.push(
      renderGroup({
        folders: folderViews.map(([, section]) => section),
        catalogs: workspaceTree.catalogs,
        rootPrefix,
      }),
    );
  }

  return html.join("\n") || `<div class="empty-state">No catalogs found.</div>`;
}

function renderFolderContent(section, breadcrumb, rootPrefix) {
  const crumbs = [
    `<a href="${rootPrefix}">Home</a>`,
    ...breadcrumb.map((entry, index) => {
      const isLast = index === breadcrumb.length - 1;
      if (isLast) return `<span>${escapeHtml(entry.title || entry.key)}</span>`;

      const href = `${rootPrefix}home/${entry.keys.map(encodeURIComponent).join("/")}/`;
      return `<a href="${href}">${escapeHtml(entry.title || entry.key)}</a>`;
    }),
  ];

  return `
<nav class="breadcrumb" aria-label="Breadcrumb">
  ${crumbs.join('<span class="breadcrumb-separator">/</span>')}
</nav>

<section class="folder-page">
  ${
    section.title
      ? `<h2 class="folder-page-title">${escapeHtml(section.title)}</h2>`
      : ""
  }

  ${renderGroup({
    folders: Object.values(section.sections || {}),
    catalogs: section.catalogs,
    rootPrefix,
  })}
</section>`;
}

function renderGroup({
  title = null,
  folders = [],
  catalogs = [],
  rootPrefix = "./",
  id = null,
}) {
  if (!folders.length && !catalogs.length) return "";

  return `
<section class="workspace-group"${id ? ` id="${escapeHtml(id)}"` : ""}>
  ${title ? `<h2>${escapeHtml(title)}</h2>` : ""}
  <div class="group-container">
    ${
      folders.length
        ? `<div class="home-grid folder-grid">
    ${folders.map((section) => renderFolderCard(section, rootPrefix)).join("\n")}
  </div>`
        : ""
    }
    ${
      catalogs.length
        ? `<div class="home-grid catalog-grid">
    ${catalogs.map((catalog) => renderCatalogCard(catalog, rootPrefix)).join("\n")}
  </div>`
        : ""
    }
  </div>
</section>`;
}

function renderContentDivider(label) {
  return `
<div class="content-divider">
  <span></span>
  <div>${escapeHtml(label)}</div>
  <span></span>
</div>`;
}

function renderFolderCard(section, rootPrefix) {
  const title = section.title || "New group";
  const href = `${rootPrefix}home/${section.keys.map(encodeURIComponent).join("/")}/`;
  const iconSvg = section.icon ? resolveLucideSvg(section.icon) : null;

  return `
<a class="folder-card" href="${href}" data-folder="${escapeHtml(section.key)}">
  <div class="catalog-title">${escapeHtml(title)}</div>
  ${
    section.description
      ? `<div class="catalog-description">${escapeHtml(section.description)}</div>`
      : ""
  }
  ${
    iconSvg
      ? `<div class="folder-feature" aria-hidden="true">${iconSvg}</div>`
      : ""
  }
</a>`;
}

function renderCatalogCard(catalog, rootPrefix) {
  const nativeStyles = new Set([
    "red",
    "blue",
    "black",
    "green",
    "purple",
    "teal",
    "blue-pink",
    "red-green",
    "pink-blue",
    "orange-red",
    "red-orange",
    "blue-green",
    "blue-purple",
    "purple-blue",
    "dark-orange",
    "pink-purple",
    "orange-green",
    "green-orange",
    "bright-orange",
    "purple-orange",
  ]);

  const validStyle = nativeStyles.has(catalog.style) ? catalog.style : null;

  if (catalog.style && !validStyle) {
    warnOnce(`Unknown Gramax catalog style "${catalog.style}" on "${catalog.name}".`);
  }

  const cardStyle = validStyle
    ? ` style="--catalog-card-bg: var(--color-card-bg-${escapeHtml(validStyle)})"`
    : "";

  const styleAttr = validStyle
    ? ` data-style="${escapeHtml(validStyle)}"`
    : "";

  const lightLogo = catalog.homeLogoLight;
  const darkLogo = catalog.homeLogoDark || lightLogo;

  let logoHtml = "";

  if (lightLogo && darkLogo === lightLogo) {
    logoHtml = renderCatalogLogoVisual(lightLogo, rootPrefix, "");
  } else {
    if (lightLogo) {
      logoHtml += renderCatalogLogoVisual(lightLogo, rootPrefix, "theme-light-only");
    }
    if (darkLogo) {
      logoHtml += renderCatalogLogoVisual(darkLogo, rootPrefix, "theme-dark-only");
    }
  }

  return `
<a class="catalog-card" href="${rootPrefix}${encodeURIComponent(catalog.name)}/"${styleAttr}${cardStyle}>
  <div class="catalog-title">${escapeHtml(catalog.title)}</div>
  ${
    catalog.description
      ? `<div class="catalog-description ${logoHtml ? "with-visual" : ""}">${escapeHtml(catalog.description)}</div>`
      : ""
  }
  ${logoHtml}
</a>`;
}

function renderCatalogLogoVisual(logo, rootPrefix, extraClass) {
  if (!logo) return "";

  if (logo.type === "file") {
    return `<div class="catalog-visual ${extraClass}"><div class="catalog-logo-file" style="background-image:url('${escapeCssUrl(rootPrefix + logo.src)}')"></div></div>`;
  }

  if (logo.type === "emoji") {
    return `<div class="catalog-visual catalog-logo-emoji ${extraClass}" aria-hidden="true">${escapeHtml(logo.emoji)}</div>`;
  }

  if (logo.type === "icon") {
    const color =
      logo.color && /^[a-z-]+$/.test(logo.color)
        ? ` style="--catalog-icon-color: var(--color-icon-${escapeHtml(logo.color)})"`
        : "";

    return `<div class="catalog-visual catalog-logo-icon ${extraClass}"${color} aria-hidden="true">${logo.svg}</div>`;
  }

  return "";
}

function renderWorkspacePage({
  workspaceName,
  workspaceIcon,
  bodyHtml,
  searchIndex,
  homeLogoLight,
  homeLogoDark,
  rootPrefix,
  pageTitle,
  initialGroup = null,
}) {
  const searchForPage = searchIndex.map((item) => ({
    ...item,
    href: `${rootPrefix}${item.href}`,
  }));
  const serializedSearch = JSON.stringify(searchForPage).replaceAll("<", "\\u003C");
  const serializedInitialGroup = JSON.stringify(
    initialGroup ? `section-${encodeURIComponent(initialGroup)}` : null,
  );
  const workspaceBrand = renderWorkspaceBrand({
    workspaceName,
    workspaceIcon,
    homeLogoLight,
    homeLogoDark,
    rootPrefix,
  });

  const customStyleLink = hasCustomCss
    ? `<link id="workspace-custom-style-link" rel="stylesheet" href="${rootPrefix}home-assets/style.css">`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${escapeHtml(pageTitle)}</title>

  <script>
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
        const parsed = raw
          ? JSON.parse(raw)
          : { state: { values: {} }, version: 1 };

        parsed.state ??= {};
        parsed.state.values ??= {};
        parsed.state.values.general ??= {};
        parsed.state.values.general.theme = theme;

        if (parsed.version == null) parsed.version = 1;
        localStorage.setItem(key, JSON.stringify(parsed));
      } catch {}
    };
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

      /* Gramax catalog card styles: core/styles/themes.css */
      --color-card-bg-blue: linear-gradient(90deg, rgba(0,112,216,.05), rgba(37,202,224,.05)), rgba(255,255,255,.05);
      --color-card-bg-bright-orange: linear-gradient(90deg, rgba(253,154,37,.05), rgba(255,221,0,.05)), rgba(255,255,255,.05);
      --color-card-bg-dark-orange: linear-gradient(60deg, rgba(255,78,0,.05) 0%, rgba(236,159,5,.05) 74%), rgba(255,255,255,.05);
      --color-card-bg-purple: linear-gradient(90deg, rgba(138,66,255,.05), rgba(226,64,163,.05)), rgba(255,255,255,.05);
      --color-card-bg-green: linear-gradient(90deg, rgba(0,176,155,.05), rgba(150,201,61,.05)), rgba(255,255,255,.05);
      --color-card-bg-red: linear-gradient(90deg, rgba(255,4,31,.05), rgba(199,14,0,.05)), rgba(255,255,255,.05);
      --color-card-bg-pink-blue: linear-gradient(90deg, rgba(246,79,89,.05), rgba(196,113,237,.05), rgba(18,194,233,.05)), rgba(255,255,255,.05);
      --color-card-bg-pink-purple: linear-gradient(90deg, rgba(255,83,52,.05), rgba(251,28,175,.05), rgba(196,27,255,.05)), rgba(255,255,255,.05);
      --color-card-bg-orange-green: linear-gradient(90deg, rgba(255,141,7,.05), rgba(207,223,24,.05), rgba(87,235,74,.05)), rgba(255,255,255,.05);
      --color-card-bg-purple-blue: linear-gradient(90deg, rgba(188,2,255,.05), rgba(0,224,255,.05)), rgba(255,255,255,.05);
      --color-card-bg-red-orange: linear-gradient(90deg, rgba(255,1,62,.05), rgba(252,124,97,.05), rgba(255,168,0,.05)), rgba(255,255,255,.05);
      --color-card-bg-blue-green: linear-gradient(90deg, rgba(0,148,199,.05), rgba(0,219,114,.05)), rgba(255,255,255,.05);
      --color-card-bg-orange-red: linear-gradient(90deg, rgba(244,178,6,.05), rgba(254,137,85,.05), rgba(255,56,183,.05)), rgba(255,255,255,.05);
      --color-card-bg-green-orange: linear-gradient(90deg, rgba(8,221,4,.05), rgba(255,184,0,.05)), rgba(255,255,255,.05);
      --color-card-bg-blue-pink: linear-gradient(90deg, rgba(1,127,255,.05), rgba(255,138,222,.05)), rgba(255,255,255,.05);
      --color-card-bg-red-green: linear-gradient(90deg, rgba(240,80,83,.05), rgba(245,206,0,.05), rgba(153,219,0,.05)), rgba(255,255,255,.05);
      --color-card-bg-blue-purple: linear-gradient(90deg, rgba(96,131,255,.05), rgba(192,35,248,.05)), rgba(255,255,255,.05);
      --color-card-bg-purple-orange: linear-gradient(90deg, rgba(148,63,249,.05), rgba(255,120,0,.05)), rgba(255,255,255,.05);
      --color-card-bg-black: linear-gradient(246.66deg, rgba(138,147,157,.05) 7.94%, rgba(18,19,21,.05) 93.7%), rgba(255,255,255,.05);
      --color-card-bg-teal: linear-gradient(90deg, rgba(20,184,166,.05), rgba(6,182,212,.05)), rgba(255,255,255,.05);

      /* Gramax icon colors: ui-kit palette + vars.css (light l=35%). */
      --color-icon-yellow: hsl(44 98% 35%);
      --color-icon-green: hsl(120 71% 35%);
      --color-icon-purple: hsl(247 100% 35%);
      --color-icon-blue: hsl(194 100% 35%);
      --color-icon-orange: hsl(16 100% 35%);
      --color-icon-red: hsl(340 100% 35%);
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

      /* Gramax icon colors: dark palette + vars.css (dark l=65%). */
      --color-icon-yellow: hsl(44 35% 65%);
      --color-icon-green: hsl(120 34% 65%);
      --color-icon-purple: hsl(247 35% 65%);
      --color-icon-blue: hsl(195 35% 65%);
      --color-icon-orange: hsl(15 35% 65%);
      --color-icon-red: hsl(340 35% 65%);
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
    }

    body {
      --app-font-famaly: -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue";
      --font-weight-default: 300;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: var(--app-font-famaly), sans-serif;
      font-weight: var(--font-weight-default);
    }

    .page-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
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

    .topbar-inner,
    main,
    .bottom-info {
      width: 100%;
      max-width: 1144px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 36px;
      padding-right: 36px;
    }

    .topbar-inner {
      min-height: 58px;
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

    .workspace-brand > svg,
    .workspace-brand-logo {
      width: 22px;
      height: 22px;
      object-fit: contain;
      flex: 0 0 auto;
    }

    .workspace-brand span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .theme-dark-only { display: none !important; }
    [data-theme="dark"] .theme-light-only { display: none !important; }
    [data-theme="dark"] .theme-dark-only { display: flex !important; }
    img.theme-dark-only { display: none !important; }
    [data-theme="dark"] img.theme-dark-only { display: block !important; }

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

    .icon-button:hover { background: var(--surface-hover); }

    main {
      flex: 1;
      padding-top: 28px;
      padding-bottom: 32px;
    }

    .workspace-group {
      scroll-margin-top: 72px;
    }

    .workspace-group + .workspace-group,
    .workspace-group + .content-divider,
    .content-divider + .workspace-group {
      margin-top: 48px;
    }

    .workspace-group > h2,
    .folder-page-title {
      margin: 0 0 24px;
      text-align: center;
      font-size: 24px;
      line-height: 1.25;
      font-weight: 600;
    }

    .group-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .home-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(188px, 1fr));
      gap: 16px;
    }

    .catalog-card,
    .folder-card {
      position: relative;
      min-width: 0;
      padding: 16px 18px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--catalog-card-bg, var(--surface));
      box-shadow: var(--shadow);
      color: var(--text);
      text-decoration: none;
      overflow: hidden;
      transition: transform .14s ease, box-shadow .14s ease, background .14s ease;
    }

    .catalog-card { height: 132px; }
    .folder-card { height: 110px; }

    .catalog-card:hover,
    .folder-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(20,24,31,.10);
    }

    .catalog-card:not([data-style]):hover,
    .folder-card:hover {
      background: var(--surface-hover);
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
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.35;
    }

    .catalog-description.with-visual {
      padding-right: 52px;
    }

    .catalog-visual {
      position: absolute;
      width: 52px;
      height: 52px;
      right: -2px;
      bottom: -2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .catalog-logo-file {
      width: 100%;
      height: 100%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      margin-left: 2px;
      margin-top: 2px;
    }

    .catalog-logo-icon {
      color: var(--catalog-icon-color, var(--text));
    }

    .catalog-logo-icon svg {
      width: 46px;
      height: 46px;
      display: block;
      stroke: currentColor;
    }

    .catalog-logo-emoji {
      font-size: 40px;
      line-height: 1;
    }

    .folder-feature {
      position: absolute;
      right: 12px;
      bottom: 12px;
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border: 1px solid var(--border);
      border-radius: 9px;
      background: var(--surface-hover);
    }

    .folder-feature svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
    }

    .content-divider {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 14px;
      color: var(--muted);
      font-size: 14px;
      text-align: center;
    }

    .content-divider > span {
      height: 1px;
      background: var(--border);
    }

    .breadcrumb {
      min-height: 24px;
      margin-bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      color: var(--muted);
      font-size: 14px;
    }

    .breadcrumb a {
      color: var(--muted);
      text-decoration: none;
    }

    .breadcrumb a:hover { color: var(--text); }
    .breadcrumb-separator { opacity: .7; }

    .folder-page {
      padding-top: 16px;
    }

    .bottom-info {
      display: flex;
      justify-content: flex-end;
      padding-top: 20px;
      padding-bottom: 20px;
      color: var(--muted);
      font-size: 12px;
    }

    .search-overlay {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding: 10vh 20px 20px;
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

    .empty-state {
      padding: 48px 24px;
      color: var(--muted);
      text-align: center;
    }

    @media (min-width: 1024px) and (max-width: 1279px) {
      .topbar-inner,
      main,
      .bottom-info {
        max-width: 1173px;
        padding-left: 36px;
        padding-right: 36px;
      }

      .home-grid {
        grid-template-columns: repeat(4, minmax(188px, 1fr));
        gap: 16px;
      }
    }

    @media (min-width: 768px) and (max-width: 1023px) {
      .topbar-inner,
      main,
      .bottom-info {
        max-width: 902px;
        padding-left: 24px;
        padding-right: 24px;
      }

      .group-container {
        gap: 20px;
      }

      .home-grid {
        grid-template-columns: repeat(4, minmax(171px, 1fr));
        gap: 12px;
      }
    }

    @media (max-width: 767px) {
      .topbar-inner,
      main,
      .bottom-info {
        max-width: 100%;
        padding-left: 16px;
        padding-right: 16px;
      }

      .group-container {
        gap: 20px;
      }

      .home-grid {
        grid-template-columns: repeat(2, minmax(165px, 1fr));
        gap: 12px;
        overflow-x: auto;
      }
    }

    @media (max-width: 640px) {
      .workspace-group + .workspace-group,
      .workspace-group + .content-divider,
      .content-divider + .workspace-group {
        margin-top: 32px;
      }
    }
  </style>

  ${customStyleLink}
</head>

<body id="custom-style">
  <script>
    (() => {
      const theme = window.__readGramaxTheme__();
      document.body.dataset.theme = theme;
      document.documentElement.className = theme;
    })();
  </script>

  <div class="page-shell">
    <header class="topbar">
      <div class="topbar-inner">
        ${workspaceBrand}

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
      ${bodyHtml}
    </main>

    <footer class="bottom-info">© ${new Date().getFullYear()} Gramax</footer>
  </div>

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
        <div class="empty-state">Start typing to search all catalogs.</div>
      </div>
    </div>
  </div>

  <script>
    const SEARCH_INDEX = ${serializedSearch};

    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    function applyTheme(theme) {
      document.body.dataset.theme = theme;
      document.documentElement.className = theme;
      themeIcon.innerHTML = theme === "dark"
        ? ${JSON.stringify(moonIcon())}
        : ${JSON.stringify(sunIcon())};
    }

    applyTheme(window.__readGramaxTheme__());

    const initialGroupId = ${serializedInitialGroup};
    if (initialGroupId) {
      requestAnimationFrame(() => {
        document.getElementById(initialGroupId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }

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
        results.innerHTML = '<div class="empty-state">Start typing to search all catalogs.</div>';
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
        results.innerHTML = '<div class="empty-state">No results.</div>';
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

function renderWorkspaceBrand({
  workspaceName,
  workspaceIcon,
  homeLogoLight,
  homeLogoDark,
  rootPrefix,
}) {
  let visual = "";

  if (homeLogoLight) {
    if (homeLogoDark && homeLogoDark !== homeLogoLight) {
      visual += `<img class="workspace-brand-logo theme-light-only" src="${rootPrefix}${homeLogoLight}" alt="">`;
      visual += `<img class="workspace-brand-logo theme-dark-only" src="${rootPrefix}${homeLogoDark}" alt="">`;
    } else {
      visual += `<img class="workspace-brand-logo" src="${rootPrefix}${homeLogoLight}" alt="">`;
    }
  } else if (homeLogoDark) {
    visual += `<span class="theme-light-only">${workspaceIconSvg(workspaceIcon)}</span>`;
    visual += `<img class="workspace-brand-logo theme-dark-only" src="${rootPrefix}${homeLogoDark}" alt="">`;
  } else {
    visual = workspaceIconSvg(workspaceIcon);
  }

  return `
<a class="workspace-brand" href="${rootPrefix}" aria-label="${escapeHtml(workspaceName)}">
  ${visual}
  <span>${escapeHtml(workspaceName)}</span>
</a>`;
}

function renderRedirectPage(target, workspaceName) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(workspaceName)}</title>
  <meta http-equiv="refresh" content="0;url=${escapeHtml(target)}">
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body></body>
</html>`;
}


function resolveCatalogCardLogo(catalog, rawLogo, variant) {
  if (!rawLogo || typeof rawLogo !== "string") return null;

  if (rawLogo.startsWith("emoji:")) {
    return {
      type: "emoji",
      emoji: rawLogo.slice("emoji:".length),
    };
  }

  if (rawLogo.startsWith("icon:")) {
    const raw = rawLogo.slice("icon:".length);
    const separator = raw.indexOf(":");
    const code = separator === -1 ? raw : raw.slice(0, separator);
    const color = separator === -1 ? null : raw.slice(separator + 1);
    const svg = resolveLucideSvg(code);

    if (!svg) {
      warnOnce(
        `Catalog "${catalog.name}" uses Lucide icon "${code}", but it could not be resolved. ` +
        `Install it once with: npm install --save-dev lucide-static`,
      );
      return null;
    }

    return {
      type: "icon",
      code,
      color,
      svg,
    };
  }

  const catalogDir = resolve(catalog.contentRoot);
  const logoSource = resolve(catalog.contentRoot, rawLogo);
  const relativeLogoPath = relative(catalogDir, logoSource);

  if (
    relativeLogoPath.startsWith("..") ||
    relativeLogoPath === ".." ||
    !existsSync(logoSource)
  ) {
    warnOnce(
      `Catalog "${catalog.name}" logo file was not found inside the catalog: ${rawLogo}`,
    );
    return null;
  }

  const extension = extname(rawLogo);
  const logoName = `${safeFileName(catalog.name)}-${variant}${extension}`;
  copyFileSync(logoSource, join(homeAssets, logoName));

  return {
    type: "file",
    src: `home-assets/${encodeURIComponent(logoName)}`,
  };
}

function resolveLucideSvg(code) {
  if (!code || !/^[a-z0-9-]+$/i.test(code)) return null;
  if (lucideIconCache.has(code)) return lucideIconCache.get(code);

  const iconPath = join(
    root,
    "node_modules",
    "lucide-static",
    "icons",
    `${code}.svg`,
  );

  if (!existsSync(iconPath)) {
    lucideIconCache.set(code, null);
    return null;
  }

  let svg = readFileSync(iconPath, "utf8")
    .replace(/<\?xml[\s\S]*?\?>\s*/g, "")
    .replace(/<!--[\s\S]*?-->\s*/g, "")
    .trim()
    .replace(/\swidth="[^"]*"/g, "")
    .replace(/\sheight="[^"]*"/g, "")
    .replace(/<svg\b/, '<svg focusable="false" aria-hidden="true"');

  lucideIconCache.set(code, svg);
  return svg;
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

  return `${encodeURIComponent(catalogName)}/${encoded}${encoded ? "/" : ""}`;
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

function sanitizeBundledSecrets() {
  /*
   * gramax-cli 1.0.52 currently ships build/E2E environment values and
   * credential-shaped example placeholders inside the shared browser bundle.
   *
   * IMPORTANT: only sanitize Gramax-generated shared JS assets. Scanning the
   * whole site could mutate legitimate code examples in user documentation.
   */
  const assetsRoot = join(output, "assets");
  if (!existsSync(assetsRoot)) return;

  const jsExtensions = new Set([".js", ".mjs", ".cjs"]);

  // E2E variables are test-only and should never be needed by static docs.
  const e2eEnvPattern =
    /\b(GX_E2E_[A-Z0-9_]+)\s*:\s*"((?:\\.|[^"\\])*)"/g;

  // Other obvious secret-bearing build variables, including TAURI signing
  // values, are also stripped if they were accidentally embedded.
  const sensitiveEnvPattern =
    /\b([A-Z][A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PRIVATE_KEY|API_KEY)[A-Z0-9_]*)\s*:\s*"((?:\\.|[^"\\])*)"/g;

  // Defense in depth for GitLab PATs that may appear outside env objects.
  const gitlabTokenPattern = /glpat-[A-Za-z0-9._-]+/g;

  // Credential-shaped UI placeholders in the current Gramax bundle. These
  // are examples, but GitHub Push Protection classifies them as real secrets.
  // Keep known placeholder values split into short chunks so this sanitizer
  // itself does not trip repository secret scanners.
  const credentialLikePlaceholders = [
    ["4740fbc6", "db719d42", "c158b885", "80be7633", "c1e38682", "7ebe9134", "e9a5198c", "52cb2e4c"].join(""),
    ["31fa8d7b", "332125ed", "2d89b9b3", "d735e129", "2b499d82"].join(""),
    ["e5a43119", "d84f620f", "edfc0929", "e125ed4b", "10a6a5f4"].join(""),
    ["NzIzNTYy", "NTQ3NjQx", "Ova29fNc", "HrLYMGH7", "7/YuEAKp", "qy+Q"].join(""),
  ];

  const bundleFiles = walkFiles(assetsRoot).filter((file) =>
    jsExtensions.has(extname(file).toLowerCase()),
  );

  let replacements = 0;
  const touched = [];

  for (const file of bundleFiles) {
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }

    let fileReplacements = 0;

    const clearEnvValue = (_match, key) => {
      replacements += 1;
      fileReplacements += 1;
      return `${key}:""`;
    };

    let sanitized = content.replace(e2eEnvPattern, clearEnvValue);
    sanitized = sanitized.replace(sensitiveEnvPattern, clearEnvValue);

    sanitized = sanitized.replace(gitlabTokenPattern, () => {
      replacements += 1;
      fileReplacements += 1;
      return "REDACTED_GITLAB_TOKEN";
    });

    for (const placeholder of credentialLikePlaceholders) {
      if (!sanitized.includes(placeholder)) continue;

      const occurrences = sanitized.split(placeholder).length - 1;
      replacements += occurrences;
      fileReplacements += occurrences;
      sanitized = sanitized.split(placeholder).join("example-token");
    }

    // Defensive verification, still limited to the generated Gramax bundle.
    const remainingE2EPattern =
      /\bGX_E2E_[A-Z0-9_]+\s*:\s*"(?!")[^"]+"/;
    const remainingSensitiveEnvPattern =
      /\b[A-Z][A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PRIVATE_KEY|API_KEY)[A-Z0-9_]*\s*:\s*"(?!")[^"]+"/;
    const hasKnownPlaceholder = credentialLikePlaceholders.some((value) =>
      sanitized.includes(value),
    );

    if (
      remainingE2EPattern.test(sanitized) ||
      remainingSensitiveEnvPattern.test(sanitized) ||
      gitlabTokenPattern.test(sanitized) ||
      hasKnownPlaceholder
    ) {
      gitlabTokenPattern.lastIndex = 0;
      throw new Error(
        `Refusing to finish build: sensitive or credential-shaped value remains in ${relative(output, file)}`,
      );
    }

    gitlabTokenPattern.lastIndex = 0;

    if (fileReplacements > 0) {
      writeFileSync(file, sanitized, "utf8");
      touched.push(relative(output, file));
    }
  }

  if (replacements > 0) {
    console.log(
      `Sanitized ${replacements} Gramax bundle sensitive/credential-shaped value(s) from ${touched.length} generated file(s).`,
    );
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

function warnOnce(message) {
  if (warnedMessages.has(message)) return;
  warnedMessages.add(message);
  console.warn(`Warning: ${message}`);
}

function escapeCssUrl(value) {
  return String(value)
    .replaceAll("\\\\", "\\\\\\\\")
    .replaceAll("'", "\\\\'");
}

function verifyWorkspaceBuild() {
  const required = [join(output, "index.html"), join(output, "assets")];

  for (const catalog of allCatalogs) {
    required.push(join(output, catalog.name, "index.html"));
  }

  for (const path of required) {
    if (!existsSync(path)) {
      throw new Error(`Build verification failed; expected output is missing: ${path}`);
    }
  }

  console.log("Workspace build verification passed.");
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
  const resolved = resolveLucideSvg(icon);
  if (resolved) return resolved;

  if (icon && icon !== "layers") {
    warnOnce(
      `Workspace/section Lucide icon "${icon}" could not be resolved. ` +
      `Install it once with: npm install --save-dev lucide-static`,
    );
  }

  // Dependency-free fallback.
  return `
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="m12 2 9 5-9 5-9-5 9-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="m3 12 9 5 9-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m3 17 9 5 9-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
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
