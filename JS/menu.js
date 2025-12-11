// Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    if (!menuToggle || !menuClose || !navMenu || !menuOverlay) {
        return; // Menu elements not found, skip initialization
    }

    menuToggle.addEventListener('click', () => {
        navMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeMenu() {
        navMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});

