import { loadContent, tabChange, updateHeaderBasedOnSession } from './loadContent.js';
import { validateSignUp } from './validate.js';
import { hashData } from './encdec.js'; // 추가된 import

document.addEventListener('DOMContentLoaded', () => {
  bindEventsToDynamicContent();
  // 헤더 업데이트는 index.js에서 처리
});

// 동적으로 로드된 콘텐츠에 이벤트 리스너를 추가하는 함수
function bindEventsToDynamicContent() {
  bindEvent();
}

function bindEvent() {
  const signUpBtn = document.querySelector('button[id="signUp"]');
  if (signUpBtn) {
    signUpBtn.addEventListener('click', (event) => {
      event.preventDefault();
      siginUpProcess();
    });
  }

  const loginBtn = document.querySelector('button[id="login"]');
  if (loginBtn) {
    loginBtn.addEventListener('click', (event) => {
      event.preventDefault();
      loginProcess();
    });
  }

  const logoutLink = document.querySelector('a[id="user/logout"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      logoutProcess();
    });
  }

  const generateKeyBtn = document.querySelector('button[id="generateKey"]');
  if (generateKeyBtn) {
    generateKeyBtn.addEventListener('click', (event) => {
      event.preventDefault();
      generateKey();
    });
  }
}

function siginUpProcess() {
  const signUp = document.querySelector('form[action="/user/sign"]');
  const signId = document.getElementById('sign_id').value;
  const signEmail = document.getElementById('sign_email').value;
  const signPassword = document.getElementById('sign_password').value;

  const validation = validateSignUp(signId, signEmail, signPassword);
  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  (async () => {
    const hashedPassword = await hashData(signPassword); // 비밀번호 암호화
    const formData = new FormData(signUp);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = key === 'sign_password' ? hashedPassword : value; // 암호화된 비밀번호 사용
    });

    try {
      const response = await fetch('/user/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // 쿠키를 포함하여 요청
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Sign Up Response:', result);
        alert(result.message);

        if (result.status === 'success') {
          sessionStorage.setItem('isAuthenticated', 'true');
          tabChange('user/home');
        }
      } else {
        const errorResult = await response.json();
        console.error('Sign Up Error:', errorResult);
        alert(errorResult.message);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('Sign Up Failed');
    }
  })();
}

function loginProcess() {
  const login = document.querySelector('form[action="/user/login"]');
  const loginId = document.getElementById('login_id').value;
  const password = document.getElementById('login_password').value;

  (async () => {
    const hashedPassword = await hashData(password); // 비밀번호 암호화
    const formData = new FormData(login);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = key === 'login_password' ? hashedPassword : value; // 암호화된 비밀번호 사용
    });

    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // 쿠키를 포함하여 요청
      });

      if (response.ok) {
        const result = await response.json();
        // console.log('Login Response:', result);
        alert(result.message);

        if (result.status === 'success') {
          sessionStorage.setItem('isAuthenticated', 'true');
          tabChange('user/home');
        }
      } else {
        const errorResult = await response.json();
        console.error('Login Error:', errorResult);
        alert(errorResult.message || 'Login Failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login Failed');
    }
  })();
}

function logoutProcess() {
  fetch('/user/logout', {
    method: 'POST',
    credentials: 'include', // 쿠키 포함
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status === 'success') {
        alert(result.message);

        // 로그인 상태 삭제
        sessionStorage.removeItem('isAuthenticated');
        tabChange('header/home'); // 홈으로 이동
      } else {
        alert('Logout Failed');
      }
    })
    .catch((error) => {
      console.error('Error during logout:', error);
      alert('Logout Failed');
    });
}

async function apiRequestWithTokenRetry(url, options) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // 쿠키 포함
    });

    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return await fetch(url, {
          ...options,
          credentials: 'include',
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Error during API request:', error);
    throw error;
  }
}

async function refreshAccessToken() {
  try {
    const response = await fetch('/user/refresh', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
    });

    const result = await response.json();
    if (result.status === 'success') {
      console.log('Access token refreshed successfully.');
      return true;
    } else {
      console.error('Failed to refresh access token:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return false;
  }
}

function generateKeyTest() {
  return crypto.randomBytes(32).toString('hex');
}

