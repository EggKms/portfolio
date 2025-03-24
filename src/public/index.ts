import loadContent from './loadContent';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');

  const links = document.querySelectorAll('a[id]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      // showContent(target.id.split('/')[1]);
      loadContent(target.id);
    });
  });
});

// function showContent(id: string) {
//   const sections = document.querySelectorAll('.content-section');
//   sections.forEach((section) => {
//     if (section.id === id) {
//       section.classList.add('active');
//     } else {
//       section.classList.remove('active');
//     }
//   });
// }
