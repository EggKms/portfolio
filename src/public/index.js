import { loadContent, tabChange } from './loadContent.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');

  const links = document.querySelectorAll('a[id]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target;
      // loadContent(target.id);
      tabChange(target.id);
    });
  });
});
