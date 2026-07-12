
        document.addEventListener('DOMContentLoaded', () => {
            // ===== 배너 슬라이드 (banner2 ↔ banner3) =====
            const slideImg = document.querySelector('.slide-banner img');
            const slideHeading = document.querySelector('.slide-banner h1');
            const currentSpan = document.querySelector('.slide-page .current');
            const totalSpan = document.querySelector('.slide-page .total');
            const banners = ['banner2.png', 'banner3.png'];
            let bannerIdx = 0;
            const slideBanner = document.querySelector('.slide-banner');
            function toggleBanner() {
                bannerIdx = 1 - bannerIdx;
                slideImg.src = 'images/' + banners[bannerIdx];
                slideHeading.style.display = bannerIdx === 0 ? '' : 'none';
                slideBanner.classList.toggle('show-alt', bannerIdx === 1);
                const cur = currentSpan.textContent;
                currentSpan.textContent = totalSpan.textContent;
                totalSpan.textContent = cur;
            }
            document.querySelector('.slide-btn .next').addEventListener('click', () => { toggleBanner(); restartAutoSlide(); });
            document.querySelector('.slide-btn .prev').addEventListener('click', () => { toggleBanner(); restartAutoSlide(); });
            // 자동 슬라이드 (5초마다) — 수동 클릭 시 타이머 리셋
            let autoSlideTimer = setInterval(toggleBanner, 5000);
            function restartAutoSlide() {
                clearInterval(autoSlideTimer);
                autoSlideTimer = setInterval(toggleBanner, 5000);
            }

            // ===== 제품 슬라이더 (wraparound: 끝 → 첫카드 직접 이동) =====
            const leftBtn = document.querySelector('.product-box > .left-btn');
            const rightBtn = document.querySelector('.product-box > .right-btn');
            const mobileMQ = window.matchMedia('(max-width: 768px)');
            const getVisibleCount = () => mobileMQ.matches ? 3 : 4;
            const getGap = () => mobileMQ.matches ? 12 : 20;
            const trackState = new Map();
            let isTransitioning = false;

            function getActiveTrack() {
                const active = document.querySelector('.content-box.active') || document.querySelector('#con01');
                return active.querySelector('.thing-track');
            }

            function scrollProduct(dir) {
                if (isTransitioning) return;
                const track = getActiveTrack();
                if (!track) return;
                const items = track.children;
                const realCount = items.length;
                const visibleCount = getVisibleCount();
                if (realCount <= visibleCount) return;
                const itemWidth = items[0].getBoundingClientRect().width;
                const step = itemWidth + getGap();
                const maxIdx = realCount - visibleCount;
                let idx = trackState.get(track) || 0;

                if (dir > 0) {
                    idx = (idx >= maxIdx) ? 0 : idx + 1;
                } else {
                    idx = (idx <= 0) ? maxIdx : idx - 1;
                }

                isTransitioning = true;
                track.style.transition = 'transform .4s ease';
                track.style.transform = `translateX(-${idx * step}px)`;
                trackState.set(track, idx);
                setTimeout(() => { isTransitioning = false; }, 400);
            }

            // 뷰포트 크기 변경 시 슬라이더 위치 리셋
            mobileMQ.addEventListener('change', () => {
                document.querySelectorAll('.thing-track').forEach(t => {
                    trackState.set(t, 0);
                    t.style.transition = 'none';
                    t.style.transform = 'translateX(0)';
                    void t.offsetWidth;
                    t.style.transition = 'transform .4s ease';
                });
            });

            // ===== 모바일 햄버거 메뉴 =====
            const hamburger = document.querySelector('.hamburger');
            const navUl = document.querySelector('.site-nav > ul');
            const backdrop = document.querySelector('.nav-backdrop');
            if (hamburger && navUl && backdrop) {
                hamburger.addEventListener('click', () => {
                    navUl.classList.toggle('open');
                    backdrop.classList.toggle('open');
                });
                backdrop.addEventListener('click', () => {
                    navUl.classList.remove('open');
                    backdrop.classList.remove('open');
                });
            }
            // 모바일 서브메뉴 accordion
            document.querySelectorAll('.site-nav > ul > li').forEach(li => {
                li.addEventListener('click', (e) => {
                    if (!mobileMQ.matches) return;
                    if (e.target.closest('ul ul')) return;
                    if (li.querySelector('ul')) {
                        e.stopPropagation();
                        li.classList.toggle('open');
                    }
                });
            });

            rightBtn.addEventListener('click', () => scrollProduct(1));
            leftBtn.addEventListener('click', () => scrollProduct(-1));

            // 탭 클릭: .active 클래스 토글 (스크롤 방지)
            const menuItems = document.querySelectorAll('.menu li');
            const contentBoxes = document.querySelectorAll('.content-box');
            // 초기 활성화 (첫 탭)
            menuItems[0].classList.add('active');
            contentBoxes[0].classList.add('active');

            menuItems.forEach((li, idx) => {
                const a = li.querySelector('a');
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    menuItems.forEach(m => m.classList.remove('active'));
                    contentBoxes.forEach(b => b.classList.remove('active'));
                    li.classList.add('active');
                    contentBoxes[idx].classList.add('active');
                    document.querySelectorAll('.thing-track').forEach(t => {
                        trackState.set(t, 0);
                        t.style.transition = 'none';
                        t.style.transform = 'translateX(0)';
                        void t.offsetWidth;
                        t.style.transition = 'transform .4s ease';
                    });
                });
            });
        });