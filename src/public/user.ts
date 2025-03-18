import { loadContent } from './index';

document.addEventListener('DOMContentLoaded', () => {
  bindEventsToDynamicContent();
});
// 동적으로 로드된 콘텐츠에 이벤트 리스너를 추가하는 함수
export function bindEventsToDynamicContent() {
  bindSignUpEvent();
  bindLoginEvent();
}

function bindSignUpEvent() {
  const signUpBtn = document.querySelector('button[id="signUp"]');

  if (signUpBtn) {
    const signUp = document.querySelector(
      'form[action="/user/sign"]',
    ) as HTMLFormElement;
    signUpBtn.addEventListener('click', (event) => {
      event.preventDefault();
      (async () => {
        const formData = new FormData(signUp);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
          data[key] = value as string;
        });

        try {
          const response = await fetch('/user/sign', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const result = response.json();
            console.log('Sign Up Response:', result);
            alert('Sign Up Successful');
            // 회원가입 성공 시 로그인 페이지로 이동
            loadContent('/user/login');
          } else {
            const errorResult = response.json();
            console.error('Sign Up Error:', errorResult);
          }
        } catch (error) {
          console.error('Error during sign up:', error);
          alert('Sign Up Failed');
        }
      })().catch((error) => {
        console.error('Unexpected error during sign up:', error);
      });
    });
  }
}

function bindLoginEvent() {
  const loginBtn = document.querySelector('button[id="login"]');
  if (loginBtn) {
    const login = document.querySelector(
      'form[action="/user/login"]',
    ) as HTMLFormElement;
    loginBtn.addEventListener('click', (event) => {
      event.preventDefault();
      (async () => {
        const formData = new FormData(login);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
          data[key] = value as string;
        });

        try {
          const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const result = response.json();
            console.log('Login Response:', result);
            alert('Login Successful');
            // 로그인 성공 시 추가 동작
          } else {
            const errorResult = response.json();
            console.error('Login Error:', errorResult);
          }
        } catch (error) {
          console.error('Error during login:', error);
          alert('Login Failed');
        }
      })().catch((error) => {
        console.error('Unexpected error during login:', error);
      });
    });
  }
}
