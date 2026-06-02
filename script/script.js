document.addEventListener('DOMContentLoaded', () => {

    // 1.1 로고 클릭 시 최상단으로 이동
    const logo = document.querySelector('.logo');
    logo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 2. Sticky Header Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Portfolio Filtering & Pagination
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workCards = Array.from(document.querySelectorAll('.work-card'));
    const paginationContainer = document.getElementById('pagination');
    
    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 12;

    function updatePortfolio() {
        // 1. Filter items
        const filteredCards = workCards.filter(card => {
            return currentFilter === 'all' || card.getAttribute('data-category') === currentFilter;
        });

        // 2. Calculate pagination
        const totalItems = filteredCards.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Ensure currentPage is within bounds
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        // 3. Show/Hide cards
        workCards.forEach(card => {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
        });

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentItems = filteredCards.slice(start, end);

        currentItems.forEach((card, index) => {
            card.style.display = 'flex';
            // Slight delay for each card animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 50);
        });

        // 4. Render Pagination Controls
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        const nav = document.createElement('nav');
        nav.className = 'pagination';
        nav.setAttribute('aria-label', '페이지 선택');

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            currentPage--;
            updatePortfolio();
            scrollToWorks();
        });
        nav.appendChild(prevBtn);

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                updatePortfolio();
                scrollToWorks();
            });
            nav.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            currentPage++;
            updatePortfolio();
            scrollToWorks();
        });
        nav.appendChild(nextBtn);

        paginationContainer.appendChild(nav);
    }

    function scrollToWorks() {
        const worksSection = document.getElementById('works');
        if (worksSection) {
            window.scrollTo({
                top: worksSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            currentFilter = button.getAttribute('data-filter');
            currentPage = 1; // Reset to page 1 on filter change
            updatePortfolio();
        });
    });

    // Initialize
    updatePortfolio();

    // 3.1 Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = navLinksContainer.classList.toggle('active');
            // Update aria-expanded state
            mobileToggle.setAttribute('aria-expanded', isExpanded);
            mobileToggle.setAttribute('aria-label', isExpanded ? '메뉴 닫기' : '메뉴 열기');
            // Change icon
            const icon = mobileToggle.querySelector('i');
            if (isExpanded) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // 4. Smooth Scrolling for Navigation
    const navLinks = document.querySelectorAll('.nav-links a, .cta-btn, .logo, .scroll-down a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Close mobile menu if open
                    if (navLinksContainer.classList.contains('active')) {
                        navLinksContainer.classList.remove('active');
                        const icon = mobileToggle.querySelector('i');
                        icon.className = 'fa-solid fa-bars';
                    }

                    window.scrollTo({
                        top: targetSection.offsetTop - 0,
                        behavior: 'smooth'
                    });
                } else if (targetId === '#') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 5. Simple Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            if (name) {
                alert(`감사합니다, ${name}님! 문의 내용이 정상적으로 접수되었습니다. 곧 연락드리겠습니다.`);
                contactForm.reset();
            } else {
                alert('이름과 내용을 모두 입력해주세요.');
            }
        });
    }

    // 6. Simple reveal animation on scroll (respects prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        if (!prefersReducedMotion.matches) {
            section.style.transition = 'all 0.8s ease-out';
            section.style.transform = 'translateY(30px)';
        }
        observer.observe(section);
    });

    // Add CSS for reveal class
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        section.reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // 7. Top Button functionality
    const topBtn = document.getElementById('topBtn');

    if (topBtn) {
        // Toggle visibility based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                topBtn.classList.add('visible');
            } else {
                topBtn.classList.remove('visible');
            }
        });

        // Click event to scroll to top
        topBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 8. Image Modal Logic
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.querySelector('.modal-close');
    const cardImages = document.querySelectorAll('.card-img img');
    const detailBtns = document.querySelectorAll('.card-btn');

    const openModal = (src) => {
        modal.style.display = 'block';
        modalImg.src = src;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    // Card Images click logic
    cardImages.forEach(img => {
        const src = img.getAttribute('src');
        const isSupportedImage = /\.(jpg|jpeg|png)$/i.test(src);

        if (isSupportedImage) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => openModal(src));
        }
    });

    // Detail Buttons click logic
    detailBtns.forEach(btn => {
        const href = btn.getAttribute('href');
        const isSupportedImage = /\.(jpg|jpeg|png)$/i.test(href);

        if (isSupportedImage) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(href);
            });
        }
    });

    // Close logic
    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on clicking overlay
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});
