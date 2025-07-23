import CryptoJS from 'crypto-js';

async function hashData(data) {
  if (!window.crypto || !window.crypto.subtle) {
    // crypto.subtle이 지원되지 않는 경우 npm CryptoJS 사용
    return npmCryptoJs(data);
  }else{
    return cryptoSubtle(data);
  }
  
}

async function npmCryptoJs(data) {
  const hash = CryptoJS.SHA256(data);
  return hash.toString(CryptoJS.enc.Hex);
}

async function cryptoSubtle(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export { hashData };