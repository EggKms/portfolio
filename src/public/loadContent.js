// Deprecated
function loadContent(id) {
  const contentDiv = document.getElementById('content');
  fetch(`/${id}`)
    .then((response) => response.text())
    .then((data) => {
      if (contentDiv) {
        contentDiv.innerHTML = data;
      }
    })
    .catch((error) => {
      if (contentDiv) {
        contentDiv.innerHTML = '현재 구현되어있지않습니다';
      }
      console.error('Error', error);
    });
}

async function tabChange(id) {
  const extractedId = id.split('/').pop();
  const target = document.getElementById(extractedId);
  // console.log('target', target);
  const tabs = document.querySelectorAll('.content-section');
  tabs.forEach((tab) => {
    tab.classList.remove('active');
    const inputs = tab.querySelectorAll('input');
    inputs.forEach((input) => {
      input.value = ''; // 입력 필드 초기화
    });
  });
  target.classList.add('active');

  // 헤더 업데이트
  updateHeaderBasedOnSession();
}

function updateHeaderBasedOnSession() {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  toggleAuthLinks(isAuthenticated);
}

function toggleAuthLinks(authenticated) {
  const loginLinks = document.getElementById('login-links'); // Login/Sign Up 영역
  const logoutLinks = document.getElementById('logout-links'); // My Page/Log Out 영역

  if (authenticated) {
    // 로그인 상태
    loginLinks.style.display = 'none';
    logoutLinks.style.display = 'block';
  } else {
    // 비로그인 상태
    loginLinks.style.display = 'block';
    logoutLinks.style.display = 'none';
  }
}

export { loadContent, tabChange, updateHeaderBasedOnSession };