#!/usr/bin/env python3
"""Render a dependency-free academic site from its template and publication data."""
from html import escape
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent


def bibtex(paper):
    kind = paper['type'] if paper['type'] != 'preprint' else 'misc'
    fields = {'title': '{' + paper['title'] + '}', 'author': ' and '.join(paper['authors']), 'year': str(paper['year'])}
    for key in ('journal', 'booktitle', 'volume', 'pages', 'doi'):
        if paper.get(key):
            fields[key] = paper[key]
    if paper.get('article'):
        fields['eid'] = paper['article']
    if paper.get('arxiv'):
        fields.update(eprint=paper['arxiv'], archivePrefix='arXiv')
    if paper['id'] == 'peng2026aheadance':
        fields['note'] = 'Submitted to IEEE Transactions on Robot Learning (T-RL)'
    fields['url'] = paper.get('project') or paper.get('url') or ('https://doi.org/' + paper['doi'] if paper.get('doi') else 'https://arxiv.org/abs/' + paper['arxiv'])
    return '@' + kind + '{' + paper['id'] + ',\n' + '\n'.join('  ' + key + ' = {' + value + '},' for key, value in fields.items()) + '\n}'


def render(paper):
    paper_url = ('https://doi.org/' + paper['doi']) if paper.get('doi') else paper.get('url') or 'https://arxiv.org/abs/' + paper['arxiv']
    selected = 'true' if paper.get('selected') else 'false'
    media = ''
    if paper.get('image'):
        target = paper.get('project') or paper.get('video') or paper_url
        media = f'<a class="publication-media" href="{escape(target)}" aria-label="View the {escape(paper["title"])} project"><img src="{escape(paper["image"])}" alt="{escape(paper["image_alt"])}" width="480" height="270" loading="lazy"></a>'
    authors = ', '.join('<strong>Tianhu Peng</strong>' if author == 'Tianhu Peng' else escape(author) for author in paper['authors'])
    links = [f'<a href="{escape(paper_url)}">Paper</a>']
    if paper.get('doi') and paper.get('arxiv'):
        links.append(f'<a href="https://arxiv.org/abs/{paper["arxiv"]}">arXiv</a>')
    for key, label in [('project', 'Project'), ('video', 'Video')]:
        if paper.get(key):
            links.append(f'<a href="{escape(paper[key])}">{label}</a>')
    abstract = f'<p class="publication-summary">{escape(paper["description"])}</p>' if paper.get('description') else ''
    badge = '<span class="new-label">New submission</span>' if paper['id'] == 'peng2026aheadance' else ''
    award = f'<span class="award">{escape(paper["award"])}</span>' if paper.get('award') else ''
    return f'''<article class="publication{' publication-featured' if media else ''}" id="{paper['id']}" data-selected="{selected}">
  {media}
  <div class="publication-content">{badge}<h4><a href="{escape(paper_url)}">{escape(paper['title'])}</a></h4>
    <p class="publication-authors">{authors}</p>
    <p class="publication-venue">{escape(paper['venue'])}, {paper['year']}. {award}</p>
    {abstract}
    <div class="publication-links">{' '.join(links)}<details class="bibtex"><summary>BibTeX</summary><div class="bibtex-panel"><button class="bib-copy" type="button" hidden>Copy citation</button><pre><code>{escape(bibtex(paper))}</code></pre></div></details></div>
  </div>
</article>'''


def main():
    papers = json.loads((ROOT / 'data/publications.json').read_text())
    ids = [paper['id'] for paper in papers]
    if len(ids) != len(set(ids)):
        raise ValueError('Publication IDs must be unique')
    papers.sort(key=lambda paper: paper['date'], reverse=True)
    groups = []
    for year in sorted({paper['year'] for paper in papers}, reverse=True):
        articles = '\n'.join(render(paper) for paper in papers if paper['year'] == year)
        groups.append(f'<section class="publication-year" aria-labelledby="year-{year}"><h3 id="year-{year}">{year}</h3>{articles}</section>')
    template = (ROOT / 'index.template.html').read_text()
    if template.count('<!-- PUBLICATIONS -->') != 1:
        raise ValueError('The template must contain one publication placeholder')
    html = template.replace('<!-- PUBLICATIONS -->', '\n'.join(groups))
    (ROOT / 'index.html').write_text('\n'.join(line.rstrip() for line in html.splitlines()) + '\n')
    (ROOT / 'publications.bib').write_text('\n\n'.join(bibtex(paper) for paper in papers) + '\n')
    print(f'Rendered index.html and publications.bib from {len(papers)} papers.')


if __name__ == '__main__':
    main()
