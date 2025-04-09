function validateSignUp(signId, signEmail, signPassword) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!signId) {
    return { valid: false, message: 'ID는 필수입니다다' };
  }

  if (!emailPattern.test(signEmail)) {
    return { valid: false, message: 'Email 형식이 맞지 않습니다.' };
  }

  if (!passwordPattern.test(signPassword)) {
    return { valid: false, message: '비밀번호는 8자보다 길고 영문과 특수문자가 포함되어야합니다.' };
  }

  return { valid: true, message: '' };
}

export { validateSignUp };
