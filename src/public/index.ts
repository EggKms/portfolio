document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');

  document.body.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.tagName === 'A' && target.id) {
      event.preventDefault();
      const href = target.getAttribute('href');

      if (target.id) {
        fetch(`/${target.id}`)
          .then((response) => response.text())
          .then((data) => {
            console.log(`Response from ${href}:`, data);
            const contentDiv = document.getElementById('content');
            if (contentDiv) {
              contentDiv.innerHTML = data;
            }
          })
          .catch((error) => {
            target.innerHTML = '현재 구현되어있지않습니다';
            console.error(`Error fetching ${href}:`, error);
          });
      }
    }
  });
});
