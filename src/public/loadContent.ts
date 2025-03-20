export default function loadContent(id: string) {
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
