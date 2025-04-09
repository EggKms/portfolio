import { loadContent, tabChange, updateHeaderBasedOnSession } from './loadContent.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');

  const links = document.querySelectorAll('a.tab'); // tab 클래스를 가진 링크만 선택
  links.forEach((link) => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      const target = event.target;
      tabChange(target.id);

      if (target.id === 'user/mypage') {
        // My Page가 표시될 때 유저 정보를 가져와 표시
        const response = await fetch('/user/status', {
          method: 'POST',
          credentials: 'include', // 쿠키 포함
        }).then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res;
        });
        const userData = await response.json();
        if (userData.authenticated) {
          document.getElementById('mypage').innerHTML = `
            <h2>Welcome, ${userData.user.userId}</h2>
            <p>Email: ${userData.user.email}</p>
          `;
        } else {
          document.getElementById('mypage').innerHTML = `
            <p>Please log in to view your details.</p>
          `;
        }
      }
    });
  });

  updateHeaderBasedOnSession(); // 초기 로드 시 헤더 업데이트
});

