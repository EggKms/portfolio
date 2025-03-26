import { loadContent, tabChange } from './loadContent.js';
import { validateSignUp } from './validate.js';
// import { encryptData, generateKey } from './encdec.js'; // 암호화 함수 임포트

document.addEventListener('DOMContentLoaded', () => {
  bindEventsToDynamicContent();
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

  const generateKeyBtn = document.querySelector('button[id="generateKey"]');
  if (generateKeyBtn) {
    generateKeyBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const key = generateKeyTest();
      alert('Generated Key: ' + key);
    });
  }
}

function siginUpProcess() {
  const signUp = document.querySelector(
    'form[action="/user/sign"]',
  );

  const signId = document.getElementById('sign_id').value;
  const signEmail = document.getElementById('sign_email').value;
  const signPassword = document.getElementById('sign_password').value;

  const validation = validateSignUp(signId, signEmail, signPassword);
  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  (async () => {
    const formData = new FormData(signUp);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // 데이터를 암호화합니다.
    // const encryptedData = encryptData(data, 'your-encryption-key');

    try {
      const response = await fetch('/user/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(encryptedData), // 암호화된 데이터 전송
        body: JSON.stringify(data), // 암호화된 데이터 전송
      });

      if (response.ok) {
        const result = response.json();
        console.log('Sign Up Response:', result);
        alert('Sign Up Successful');
        // 회원가입 성공 시 로그인 페이지로 이동
        // loadContent('/user/login');
        tabChange('user/login');
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
}

function loginProcess(){
  const login = document.querySelector(
    'form[action="/user/login"]',
  );

  (async () => {
    const formData = new FormData(login);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
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

}

function generateKeyTest() {
  return crypto.randomBytes(32).toString('hex');
}