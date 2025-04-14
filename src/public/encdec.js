async function hashData(data) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  // SHA-256 해시 생성
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);

  // ArrayBuffer를 16진수 문자열로 변환
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
}


export { hashData};