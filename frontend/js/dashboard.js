
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken') ||
                  sessionStorage.getItem('authToken');

    const userData = localStorage.getItem('currentUser') ||
                     sessionStorage.getItem('currentUser');

    const errorBox = document.getElementById('dashboardError');
    const recentTable = document.getElementById('recentDetections');

    if (!token || !userData) {
        window.location.href = 'login.html';
        return;
    }

    let currentUser;

    try {
        currentUser = JSON.parse(userData);
    } catch (error) {
        logout();
        return;
    }

    document.getElementById('welcomeMessage').textContent =
        `Welcome, ${currentUser.full_name}!`;

    document.getElementById('logoutBtn').addEventListener('click', logout);

    document.querySelectorAll('.view-all-btn').forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'history.html';
        });
    });

    loadDashboard();

    async function loadDashboard() {
        try {
            const response = await fetch('http://localhost:5000/api/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to load dashboard data.');
            }

            updateStatistics(data.statistics);
            displayRecentDetections(data.recent_predictions);

        } catch (error) {
            showError(error.message);
            recentTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-muted">
                        Unable to load recent detections.
                    </td>
                </tr>
            `;
        }
    }

    function updateStatistics(stats) {
        document.getElementById('totalScans').textContent =
            stats.total_scans ?? 0;

        document.getElementById('diseaseScans').textContent =
            stats.disease_scans ?? 0;

        document.getElementById('healthyScans').textContent =
            stats.healthy_scans ?? 0;

        document.getElementById('monthlyScans').textContent =
            stats.monthly_scans ?? 0;

        document.getElementById('monthlyDiseaseScans').textContent =
            stats.monthly_disease_scans ?? 0;
    }

    function displayRecentDetections(predictions) {
        recentTable.innerHTML = '';

        if (!predictions || predictions.length === 0) {
            recentTable.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-history">
                        <i class="fas fa-leaf fa-2x mb-2 text-success"></i>
                        <p class="mb-0">No predictions yet.</p>
                        <small>Upload a chilli leaf image to get started.</small>
                    </td>
                </tr>
            `;
            return;
        }

        predictions.forEach(function(prediction) {
            const row = document.createElement('tr');

            const diseaseCell = document.createElement('td');
            const severityCell = document.createElement('td');
            const dateCell = document.createElement('td');

            const imageCell = document.createElement('td');
            const imageIcon = document.createElement('div');
            imageIcon.className = 'detection-thumb';
            imageIcon.innerHTML = '<i class="fas fa-leaf"></i>';
            imageCell.appendChild(imageIcon);

            const diseaseName = document.createElement('strong');
            diseaseName.textContent = prediction.disease_name || 'Unknown';
            diseaseCell.appendChild(diseaseName);

            const severityBadge = document.createElement('span');
            severityBadge.className = getSeverityClass(prediction.severity_level);
            severityBadge.textContent = prediction.severity_level || 'Not available';
            severityCell.appendChild(severityBadge);

            dateCell.textContent = formatDate(prediction.timestamp);

            row.appendChild(imageCell);
            row.appendChild(diseaseCell);
            row.appendChild(severityCell);
            row.appendChild(dateCell);

            recentTable.appendChild(row);
        });
    }

    function getSeverityClass(severity) {
        const value = String(severity || '').toLowerCase();

        if (value.includes('advanced') || value.includes('severe')) {
            return 'badge bg-danger';
        }

        if (value.includes('moderate')) {
            return 'badge bg-warning text-dark';
        }

        if (value.includes('early')) {
            return 'badge bg-info text-dark';
        }

        if (value.includes('healthy') || value.includes('none')) {
            return 'badge bg-success';
        }

        return 'badge bg-secondary';
    }

    function formatDate(timestamp) {
        if (!timestamp) return 'Not available';

        const date = new Date(timestamp.replace(' ', 'T'));

        if (Number.isNaN(date.getTime())) {
            return timestamp;
        }

        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove('d-none');
    }

    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');

        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');

        window.location.href = 'login.html';
    }
});
