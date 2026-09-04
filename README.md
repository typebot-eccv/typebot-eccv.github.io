# typebot.github.io

Project page for the paper, built with Jekyll in the Nerfies style.

## Edit content

All page content lives in one file: [`_data/paper.yml`](_data/paper.yml).
Title, venue, authors, affiliations, link buttons, teaser, abstract, results
carousel, method/results sections, YouTube video, acknowledgements, and BibTeX
are read from there. Leave a field blank (`""`) or delete a list to hide that
element.

Site-wide metadata for search engines and link previews (title, description,
Twitter handle) lives in [`_config.yml`](_config.yml).

Media goes in `assets/`:

- `assets/images/teaser.png` is also the Open Graph / Twitter card image. Keep
  it 1200x630 so links unfurl correctly on X, Slack, and Discord.
- Put short, muted, looping `.mp4` files in `assets/videos/` (H.264, under a
  few MB each) and reference them as `assets/videos/name.mp4`.
- Put the paper PDF at `assets/paper.pdf` and set `links.pdf: assets/paper.pdf`
  if you want to host it here rather than link to arXiv.

Templates are in `_includes/` and the page order is set in `index.html`.
Custom CSS is in `assets/css/index.css`.

## Run locally

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open <http://localhost:4000/>.

## Deploy

Pushing to `main` runs `.github/workflows/jekyll.yml`, which builds the site
with Jekyll 4 and publishes it to GitHub Pages.

One-time setup: in the repository go to **Settings -> Pages** and set
**Source** to **GitHub Actions**.

The workflow passes the correct `--baseurl` automatically, so the page works
both as a project site (`https://<user>.github.io/<repo>/`) and as the root
site of the `typebot-eccv` organisation (`https://typebot-eccv.github.io/`).
For the root-site URL the repository must live at
`typebot-eccv/typebot-eccv.github.io`.
