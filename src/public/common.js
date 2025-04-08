// 인증된 요청을 보내는 함수
async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('No authentication token found. Please log in.');
    return;
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
}

export { authenticatedFetch };