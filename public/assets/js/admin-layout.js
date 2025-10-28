// Admin layout loader + simple auth guard
(function () {
    document.addEventListener('DOMContentLoaded', async () => {
        const isAdminArea = location.pathname.startsWith('/admin');

        // Auth guard: require token to access admin pages
        if (isAdminArea) {
            const token = localStorage.getItem('token');
            if (!token) {
                location.href = '/auth/login.html';
                return;
            }
            // Extra guard: ensure only ADMIN role can access admin pages
            try {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                const role = (user?.role || '').toUpperCase();
                if (role !== 'ADMIN') {
                    // Clear any accidental token and send to deny page
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    location.href = '/auth/deny.html';
                    return;
                }
            } catch (_e) {
                location.href = '/auth/login.html';
                return;
            }
        }

        // Helper to inject a fragment
        async function inject(selector, url) {
            const host = document.querySelector(selector);
            if (!host) return;
            try {
                const res = await fetch(url, { cache: 'no-cache' });
                const html = await res.text();
                host.innerHTML = html;
            } catch (_e) { /* ignore */ }
        }

        // Load header/sidebar/footer
        await Promise.all([
            inject('#header', '/admin/layout/header.html'),
            inject('#sidebar', '/admin/layout/sidebar.html'),
            inject('#footer', '/admin/layout/footer.html'),
        ]);

        // After header is mounted, set welcome name + logout
        const welcomeSpan = document.getElementById('welcomeName');
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (user && welcomeSpan) welcomeSpan.textContent = user.fullName || user.email || 'User';
        } catch (_e) { }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                location.href = '/auth/login.html';
            });
        }
    });
})();
