(() => {
  const controls = document.querySelector('.publication-tools');
  const years = [...document.querySelectorAll('.publication-year')];
  if (controls) {
    controls.hidden = false;
    controls.addEventListener('click', event => {
      const button = event.target.closest('button[data-view]');
      if (!button) return;
      const selected = button.dataset.view === 'selected';
      controls.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      years.forEach(group => {
        const articles = [...group.querySelectorAll('.publication')];
        articles.forEach(article => { article.hidden = selected && article.dataset.selected !== 'true'; });
        group.hidden = articles.every(article => article.hidden);
      });
    });
  }
  document.querySelectorAll('.bib-copy').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const code = button.parentElement.querySelector('code');
      const status = document.getElementById('copy-status');
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = 'Copied';
        status.textContent = 'BibTeX citation copied to clipboard.';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Citation selected';
        status.textContent = 'The citation is selected. Use your keyboard or context menu to copy it.';
      }
      window.setTimeout(() => { button.textContent = 'Copy citation'; }, 2500);
    });
  });
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    links.forEach(link => {
      const section = document.querySelector(link.hash);
      if (section) observer.observe(section);
    });
  }
})();
