# Local build and deployment

Install dependencies once:

```powershell
npm install
```

Build the Gramax static site locally:

```powershell
npm run build
```

The generated site is written to `build/`.

Deploy it to the `gh-pages` branch:

```powershell
npm run deploy
```

The deployment script builds the site, copies all generated files (including Gramax dotfiles), adds `.nojekyll`, commits the result to `gh-pages`, and pushes the branch.

In GitHub, configure **Settings → Pages → Deploy from a branch → `gh-pages` → `/ (root)`**.
