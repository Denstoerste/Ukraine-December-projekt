const ctx = document.getElementById('metricsChart').getContext('2d');

fetch('/api/metrics')
    .then(response => response.json())
    .then(data => {
        const labels = data.map(item => item.ccpost_id);
        const values = data.map(item => item.engagement_rate);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Engagement Rate',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });
    });
