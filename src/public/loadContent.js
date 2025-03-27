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

function tabChange(id) {
  const extractedId = id.split('/').pop();
  const target = document.getElementById(extractedId);
  const tabs = document.querySelectorAll('.content-section');
  tabs.forEach((tab) => {
    tab.classList.remove('active');
    const inputs = tab.querySelectorAll('input');
    inputs.forEach((input) => {
      input.value = ''; // 입력 필드 초기화
    });
  });
  target.classList.add('active');
}

export { loadContent, tabChange };