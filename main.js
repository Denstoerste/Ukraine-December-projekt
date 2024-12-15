document.addEventListener('DOMContentLoaded', async () => {
    const chartCanvas = document.getElementById('dataChart');
    const summaryContent = document.getElementById('summaryContent');

    try {
        const weeklyDataResponse = await fetch('/api/weeklyData');
        const weeklyData = await weeklyDataResponse.json();

        // Summarize weekly data
        const summary = summarizeData(weeklyData);
        summaryContent.innerHTML = `
            <p><strong>Total Reactions:</strong> ${summary.totalReactions}</p>
            <p><strong>Total Comments:</strong> ${summary.totalComments}</p>
            <p><strong>Total Shares:</strong> ${summary.totalShares}</p>
        `;

        // Prepare and render chart
        const chartData = prepareChartData(weeklyData);
        renderChart(chartCanvas, chartData);

    } catch (error) {
        console.error('Data Fetch Error:', error);
        summaryContent.innerHTML = 'Error loading data.';
    }
});

// Summarize data
function summarizeData(data) {
    const totalReactions = data.reduce((sum, week) => sum + week.totalReactions, 0);
    const totalComments = data.reduce((sum, week) => sum + week.totalComments, 0);
    const totalShares = data.reduce((sum, week) => sum + week.totalShares, 0);
    return { totalReactions, totalComments, totalShares };
}

// Prepare Chart Data
function prepareChartData(data) {
    return {
        labels: data.map(week => week.week),
        datasets: [
            {
                label: 'Reactions',
                data: data.map(week => week.totalReactions),
                borderColor: '#FFA500',
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
            },
            {
                label: 'Comments',
                data: data.map(week => week.totalComments),
                borderColor: '#FF00FF',
                backgroundColor: 'rgba(255, 0, 255, 0.2)',
            },
            {
                label: 'Shares',
                data: data.map(week => week.totalShares),
                borderColor: '#FFC0CB',
                backgroundColor: 'rgba(255, 192, 203, 0.2)',
            },
        ],
    };
}

// Render Chart
function renderChart(canvas, chartData) {
    new Chart(canvas, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Weekly Engagement Metrics Over Time',
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Week',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Count',
                    },
                },
            },
        },
    });
}
