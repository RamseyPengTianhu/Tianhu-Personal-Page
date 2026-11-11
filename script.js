(() => {
  const videoDialog = document.getElementById('video-dialog');
  if (videoDialog && typeof videoDialog.showModal === 'function') {
    const player = document.getElementById('video-player');
    const title = document.getElementById('video-dialog-title');
    const youtubeLink = document.getElementById('video-youtube-link');
    const closeButton = videoDialog.querySelector('.video-close');
    let videoTrigger = null;

    document.querySelectorAll('a[data-youtube-id]').forEach(link => {
      link.setAttribute('aria-haspopup', 'dialog');
    });
    document.addEventListener('click', event => {
      const link = event.target.closest('a[data-youtube-id]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = link.dataset.youtubeId;
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      event.preventDefault();
      videoTrigger = link;
      title.textContent = link.dataset.videoTitle;
      youtubeLink.href = `https://www.youtube.com/watch?v=${id}`;
      const iframe = document.createElement('iframe');
      const url = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
      url.search = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1', origin: window.location.origin });
      iframe.src = url.href;
      iframe.title = link.dataset.videoTitle;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      player.replaceChildren(iframe);
      videoDialog.showModal();
      document.body.classList.add('video-open');
      closeButton.focus();
    });
    closeButton.addEventListener('click', () => videoDialog.close());
    youtubeLink.addEventListener('click', () => videoDialog.close());
    videoDialog.addEventListener('click', event => {
      if (event.target !== videoDialog) return;
      const box = videoDialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) videoDialog.close();
    });
    videoDialog.addEventListener('close', () => {
      player.replaceChildren();
      document.body.classList.remove('video-open');
      if (videoTrigger && videoTrigger.isConnected) videoTrigger.focus({ preventScroll: true });
    });
  }

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
