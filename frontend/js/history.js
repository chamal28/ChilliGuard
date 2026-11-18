
document.addEventListener('DOMContentLoaded', function () {

    const token = localStorage.getItem('authToken') ||
                  sessionStorage.getItem('authToken');

    const tbody = document.getElementById('historyTableBody');
    const search = document.getElementById('historySearch');
    const errorBox = document.getElementById('historyError');
    const emptyBox = document.getElementById('historyEmpty');

    const table = document.querySelector('.history-table');
    const tableContainer = document.querySelector('.table-responsive');

    let records = [];

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Create a separate container for mobile history cards.
    const mobileCards = document.createElement('div');
    mobileCards.className = 'history-mobile-cards';

    if (tableContainer) {
        tableContainer.insertAdjacentElement('afterend', mobileCards);
    }

    const logoutButton = document.getElementById('logoutBtn');

    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    loadHistory();


    // ==========================================
    // LOAD HISTORY FROM API
    // ==========================================

    async function loadHistory() {

        try {

            const response = await fetch(
                'http://localhost:5000/api/dashboard',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || 'Unable to load detection history.'
                );
            }

            const stats = data.statistics || {};

            setValue('historyTotalScans', stats.total_scans);
            setValue('historyMonthlyScans', stats.monthly_scans);
            setValue('historyDiseaseScans', stats.disease_scans);
            setValue('historyHealthyScans', stats.healthy_scans);

            records = Array.isArray(data.recent_predictions)
                ? data.recent_predictions
                : [];

            renderRecords(records);

        } catch (error) {

            if (errorBox) {
                errorBox.textContent = error.message ||
                    'Unable to connect to ChilliGuard server.';

                errorBox.classList.remove('d-none');
            }

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-5">
                        Detection history could not be loaded.
                    </td>
                </tr>
            `;

        }
    }


    // ==========================================
    // UPDATE STATISTICS
    // ==========================================

    function setValue(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value ?? 0;
        }

    }


    // ==========================================
    // RENDER HISTORY RECORDS
    // ==========================================

    function renderRecords(items) {

        tbody.innerHTML = '';
        mobileCards.innerHTML = '';

        if (!items.length) {

            emptyBox.classList.remove('d-none');

            if (tableContainer) {
                tableContainer.classList.add('d-none');
            }

            mobileCards.classList.add('d-none');

            return;
        }

        emptyBox.classList.add('d-none');

        if (tableContainer) {
            tableContainer.classList.remove('d-none');
        }

        mobileCards.classList.remove('d-none');

        items.forEach(function (item, index) {

            // Desktop table row
            renderTableRow(item, index);

            // Mobile card
            renderMobileCard(item, index);

        });

    }


    // ==========================================
    // DESKTOP TABLE ROW
    // ==========================================

    function renderTableRow(item, index) {

        const row = document.createElement('tr');

        // Detection column
        const detection = document.createElement('td');

        const icon = document.createElement('span');
        icon.className = 'history-row-icon';

        const leafIcon = document.createElement('i');
        leafIcon.className = 'fas fa-leaf';

        icon.appendChild(leafIcon);

        const number = document.createElement('span');
        number.className = 'history-row-number';
        number.textContent = `#${index + 1}`;

        detection.append(icon, number);


        // Disease column
        const disease = document.createElement('td');

        const diseaseName = document.createElement('strong');
        diseaseName.className = 'history-disease-name';
        diseaseName.textContent =
            item.disease_name || 'Unknown condition';

        disease.appendChild(diseaseName);


        // Severity column
        const stage = document.createElement('td');

        const stageBadge = document.createElement('span');
        stageBadge.className = stageClass(item.severity_level);
        stageBadge.textContent =
            item.severity_level || 'Not available';

        stage.appendChild(stageBadge);


        // Model score column
        const score = document.createElement('td');

        const scoreValue = Number(item.confidence_score);

        score.textContent = Number.isFinite(scoreValue)
            ? `${scoreValue.toFixed(2)}%`
            : '—';


        // Date column
        const date = document.createElement('td');
        date.textContent = formatDate(item.timestamp);


        row.append(detection, disease, stage, score, date);

        tbody.appendChild(row);

    }


    // ==========================================
    // MOBILE HISTORY CARD
    // ==========================================

    function renderMobileCard(item, index) {

        const card = document.createElement('article');
        card.className = 'history-mobile-card';


        // Card header
        const header = document.createElement('div');
        header.className = 'history-mobile-card-header';

        const detection = document.createElement('span');
        detection.className = 'history-mobile-number';

        const icon = document.createElement('i');
        icon.className = 'fas fa-leaf';

        detection.append(icon, document.createTextNode(` Detection #${index + 1}`));

        const badge = document.createElement('span');
        badge.className = stageClass(item.severity_level);
        badge.textContent = item.severity_level || 'Not available';

        header.append(detection, badge);


        // Disease name
        const disease = document.createElement('h5');
        disease.className = 'history-mobile-disease';
        disease.textContent = item.disease_name || 'Unknown condition';


        // Details section
        const details = document.createElement('div');
        details.className = 'history-mobile-details';


        // Model score
        const scoreItem = createDetail(
            'Model Score',
            formatScore(item.confidence_score)
        );

        // Date
        const dateItem = createDetail(
            'Date & Time',
            formatDate(item.timestamp)
        );

        details.append(scoreItem, dateItem);

        card.append(header, disease, details);

        mobileCards.appendChild(card);

    }


    // ==========================================
    // CREATE MOBILE CARD DETAIL
    // ==========================================

    function createDetail(label, value) {

        const detail = document.createElement('div');
        detail.className = 'history-mobile-detail';

        const title = document.createElement('small');
        title.textContent = label;

        const content = document.createElement('strong');
        content.textContent = value;

        detail.append(title, content);

        return detail;

    }


    // ==========================================
    // FORMAT MODEL SCORE
    // ==========================================

    function formatScore(value) {

        const score = Number(value);

        return Number.isFinite(score)
            ? `${score.toFixed(2)}%`
            : '—';

    }


    // ==========================================
    // SEVERITY BADGE STYLE
    // ==========================================

    function stageClass(stage) {

        const value = String(stage || '').toLowerCase();

        if (
            value.includes('advanced') ||
            value.includes('severe')
        ) {
            return 'history-badge badge-danger';
        }

        if (
            value.includes('early') ||
            value.includes('moderate')
        ) {
            return 'history-badge badge-warning';
        }

        if (
            value.includes('healthy') ||
            value.includes('none')
        ) {
            return 'history-badge badge-success';
        }

        return 'history-badge badge-neutral';

    }


    // ==========================================
    // DATE AND TIME FORMATTING
    // ==========================================

    function formatDate(value) {

        if (!value) {
            return 'Not available';
        }

        const timestamp = String(value)
            .trim()
            .replace(' ', 'T');

        // SQLite CURRENT_TIMESTAMP is stored in UTC.
        // Add Z only when the timestamp has no timezone information.

        const hasTimezone =
            /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp);

        const date = new Date(
            hasTimezone ? timestamp : `${timestamp}Z`
        );

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString('en-GB', {

            timeZone: 'Asia/Colombo',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false

        });

    }


    // ==========================================
    // SEARCH HISTORY
    // ==========================================

    if (search) {

        search.addEventListener('input', function () {

            const query = this.value.trim().toLowerCase();

            const filtered = records.filter(item =>

                String(item.disease_name || '')
                    .toLowerCase()
                    .includes(query) ||

                String(item.severity_level || '')
                    .toLowerCase()
                    .includes(query)

            );

            renderRecords(filtered);

        });

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    function logout() {

        ['authToken', 'currentUser'].forEach(key => {

            localStorage.removeItem(key);
            sessionStorage.removeItem(key);

        });

        sessionStorage.removeItem('predictionResult');
        sessionStorage.removeItem('predictionValidation');
        sessionStorage.removeItem('predictionId');

        window.location.href = 'login.html';

    }

});
