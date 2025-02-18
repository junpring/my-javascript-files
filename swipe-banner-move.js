const coverImageMove = document.querySelector('.cover-image-move');
const bannerLink = document.querySelector('.banner-image'); // 배너 링크 요소
let isTouching = false;
let startX, startY;
let lastX = 0, lastY = 0;
let animationFrame;
let swipeInProgress = false;
let animationInterval;
let movingDown = true; // 현재 방향 (true: 아래, false: 위)

// 페이지 로드 시 즉시 애니메이션 실행
window.addEventListener('load', () => {
  startAnimationImmediately();
});

// 🚀 즉시 애니메이션 실행 + 루프 시작
function startAnimationImmediately() {
  if (animationInterval) clearInterval(animationInterval);

  coverImageMove.style.transition = 'transform 1.5s ease-in-out, opacity 0.5s ease-in-out';
  coverImageMove.style.transform = 'translateY(150px)'; // 바로 아래로 이동
  coverImageMove.style.opacity = '1'; // 다시 보이게 설정

  movingDown = false; // 다음에 위로 가도록 설정

  // 2초마다 반복 실행
  animationInterval = setInterval(() => {
    if (!swipeInProgress) {
      coverImageMove.style.transition = 'transform 1.5s ease-in-out';

      if (movingDown) {
        coverImageMove.style.transform = 'translateY(150px)'; // 아래로 이동
      } else {
        coverImageMove.style.transform = 'translateY(-150px)'; // 위로 이동
      }

      movingDown = !movingDown; // 방향 변경
    }
  }, 2000);
}

// 스와이프 시작
const startEvent = (e) => {
  isTouching = true;
  swipeInProgress = true;

  const touch = e.touches ? e.touches[0] : e;
  startX = touch.clientX - lastX;
  startY = touch.clientY - lastY;

  coverImageMove.style.transition = 'none';
  coverImageMove.style.cursor = 'grabbing';

  clearInterval(animationInterval); // 애니메이션 멈추기
  e.preventDefault();
};

// 스와이프 이동
const moveEvent = (e) => {
  if (!isTouching) return;

  const touch = e.touches ? e.touches[0] : e;
  lastX = touch.clientX - startX;
  lastY = touch.clientY - startY;

  if (!animationFrame) {
    animationFrame = requestAnimationFrame(() => {
      coverImageMove.style.transform = `translate(${lastX}px, ${lastY}px)`;
      animationFrame = null;
    });
  }
};

// 스와이프 종료 후 숨기기 + 링크 이동 + 요소 삭제
const endEvent = () => {
  if (isTouching) {
    isTouching = false;
    coverImageMove.style.cursor = 'grab';

    coverImageMove.style.transition = 'opacity 0.5s ease-out';
    coverImageMove.style.opacity = '0'; // 서서히 사라지게 함

    // 다시 애니메이션 시작 X (숨긴 후 멈춤)
    swipeInProgress = true;

    // 배너 이미지 클릭처럼 링크를 트리거 (새 탭에서 열기)
    if (bannerLink) {
      window.open(bannerLink.href, '_blank'); // 새 탭에서 링크 열기
    }

    // coverImageMove 요소를 DOM에서 삭제
    setTimeout(() => {
      coverImageMove.remove(); // 0.5초 후 제거 (애니메이션 효과 적용 후)
    }, 500); // 애니메이션이 끝난 후 0.5초 뒤에 제거
  }
};

// 배너 클릭 시 스와이프 배너 숨기기
bannerLink.addEventListener('click', () => {
  // 배너 클릭 시 coverImageMove를 즉시 제거
  if (coverImageMove) {
    coverImageMove.remove();
  }
});

// 이벤트 리스너 추가
coverImageMove.addEventListener('touchstart', startEvent, { passive: false });
coverImageMove.addEventListener('mousedown', startEvent);

document.addEventListener('touchmove', moveEvent, { passive: false });
document.addEventListener('mousemove', moveEvent);

document.addEventListener('touchend', endEvent);
document.addEventListener('mouseup', endEvent);
document.addEventListener('touchcancel', endEvent);
