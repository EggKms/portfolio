import { bindEventsToDynamicContent } from './user';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');

  const links = document.querySelectorAll('a[id]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      loadContent(target.id);
    });
  });
});

export function loadContent(id: string) {
  const contentDiv = document.getElementById('content');
  fetch(`/${id}`)
    .then((response) => response.text())
    .then((data) => {
      if (contentDiv) {
        contentDiv.innerHTML = data;
        bindEventsToDynamicContent(); // 동적으로 로드된 콘텐츠에 이벤트 리스너 추가
      }
    })
    .catch((error) => {
      if (contentDiv) {
        contentDiv.innerHTML = '현재 구현되어있지않습니다';
      }
      console.error('Error', error);
    });
}
