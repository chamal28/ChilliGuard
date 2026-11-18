(function () {
    const currentPage = (window.location.pathname.split('/').pop() || '').toLowerCase();

    // Keep exactly the same navigation and order on every authenticated page.
    const menuItems = [
        { href: 'dashboard.html', icon: 'fa-th-large', text: 'Dashboard', key: 'dashboard' },
        { href: 'detect.html', icon: 'fa-camera', text: 'Detect Disease', key: 'detect' },
        { href: 'result.html', icon: 'fa-chart-pie', text: 'Prediction Result', key: 'result' },
        { href: 'history.html', icon: 'fa-history', text: 'Detection History', key: 'history' }
    ];

    const links = menuItems.map(function (item) {
        const active = currentPage === item.href ? ' active' : '';
        return `
            <li class="nav-item sidebar-menu-link-item">
                <a href="${item.href}" class="sidebar-link${active}" data-nav-key="${item.key}">
                    <i class="fas ${item.icon}"></i>
                    <span>${item.text}</span>
                </a>
            </li>`;
    }).join('');

    document.write(`
        <aside class="sidebar" aria-label="ChilliGuard navigation">
            <div class="sidebar-brand">
                <a href="../index.html" class="brand-link">
                    <span class="brand-icon"><i class="fas fa-leaf"></i></span>
                    <span>ChilliGuard</span>
                </a>
            </div>

            <div class="sidebar-section">
                <p class="sidebar-heading">MAIN MENU</p>
                <nav id="dashNav" aria-label="Main navigation">
                    <ul class="navbar-nav sidebar-nav sidebar-menu">
                        ${links}

                        <li class="nav-item sidebar-help-item">
                            <div class="sidebar-help">
                                <div class="help-icon"><i class="fas fa-seedling"></i></div>
                                <h6>Keep Your Plants Healthy</h6>
                                <p>Detect chilli leaf diseases early and take appropriate action.</p>
                                <a href="detect.html">Start Detection <i class="fas fa-arrow-right ms-1"></i></a>
                            </div>
                        </li>

                        <li class="nav-item sidebar-logout-item">
                            <button type="button" id="logoutBtn" class="sidebar-logout">
                                <i class="fas fa-sign-out-alt"></i><span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    `);
})();
