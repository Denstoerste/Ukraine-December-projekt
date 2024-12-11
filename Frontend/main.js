// Load data from API and render the website
document.addEventListener('DOMContentLoaded', async () => {
    const chartCanvas = document.getElementById('dataChart');
    const summaryContent = document.getElementById('summaryContent');

    try {
        const allPostsResponse = await fetch('/api/allPosts');
        const allPosts = await allPostsResponse.json();

        // Summarize data
        const summary = summarizeData(allPosts);
        summaryContent.innerHTML = `
      <p><strong>Total Posts:</strong> ${summary.totalPosts}</p>
      <p><strong>Total Reactions:</strong> ${summary.totalReactions}</p>
      <p><strong>Total Shares:</strong> ${summary.totalShares}</p>
      <p><strong>Total Comments:</strong> ${summary.totalComments}</p>
    `;

        // Create Chart Data
        const chartData = prepareChartData(allPosts);
        renderChart(chartCanvas, chartData);

    } catch (error) {
        console.error('Data Fetch Error:', error);
        summaryContent.innerHTML = 'Error loading data.';
    }
});

// Summarize data
function summarizeData(data) {
    const totalPosts = data.length;
    const totalReactions = data.reduce((sum, post) => sum + post.reactions, 0);
    const totalShares = data.reduce((sum, post) => sum + post.shares, 0);
    const totalComments = data.reduce((sum, post) => sum + post.comments, 0);
    return { totalPosts, totalReactions, totalShares, totalComments };
}

// Prepare Chart Data
function prepareChartData(data) {
    return {
        labels: data.map(post => post.date),
        datasets: [
            {
                label: 'Reactions',
                data: data.map(post => post.reactions),
                borderColor: '#0057B7',
                backgroundColor: 'rgba(0, 87, 183, 0.2)',
            },
            {
                label: 'Shares',
                data: data.map(post => post.shares),
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
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
                    text: 'Reactions and Shares Over Time',
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
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
