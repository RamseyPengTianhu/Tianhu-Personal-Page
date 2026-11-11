# Tianhu Peng — Academic Website

Personal academic homepage: https://ramseypengtianhu.github.io/Tianhu-Personal-Page/

This static website has no framework or runtime dependencies. GitHub Pages serves
the generated `index.html`, stylesheet, script and assets directly. Publication
text and resource links remain available without JavaScript.

## Update content

- Edit `index.template.html` for the biography, news, education and activities.
- Edit `data/publications.json` for papers, authors, venues and resource links.
  Set `selected: true` to include a paper in the selected-work filter. Keep
  submission status distinct from publication venue: AHEADance is submitted to
  IEEE Transactions on Robot Learning (T-RL).
- Replace `files/Tianhu_Peng_CV.pdf` with the compiled CV from the CV repository.

Render the page and downloadable bibliography after editing:

```sh
python3 scripts/build.py
```

Commit both the sources and generated files. Deployment continues to use the
existing GitHub Pages configuration and `main` branch.

## Preview

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Check desktop/mobile layouts, the selected-work filter,
BibTeX expansion/copy, local images and the CV PDF before publishing.

The layout takes inspiration from conventional academic homepages and Lingfan
Bao's site, with an author sidebar and bibliographic publication entries. Content
is specific to Tianhu Peng.
