let originalChart, combinedChart;
const ctx = document.getElementById('interactionChart').getContext('2d');

// Global variables for data
let interactionData = [];
let eventsData = [];
let ukraineEventsData = [];

// Fetch data from APIs
async function fetchData() {
    const interactionRes = await fetch('http://localhost:3000/api/interactionTimeline');
    interactionData = await interactionRes.json();

    const globalEventsRes = await fetch('http://localhost:3000/api/globalEvents');
    eventsData = await globalEventsRes.json();

    const ukraineEventsRes = await fetch('http://localhost:3000/api/ukraineWarEvents');
    ukraineEventsData = await ukraineEventsRes.json();

    renderWordCloud();
    switchTab(0);
}

// Helper to filter and format data after 2021
function filterAfter2021(data) {
    return data.filter(row => new Date(row.period).getFullYear() > 2021);
}

// Align Events Directly with Total Interaction Timeline
function alignEvents(events, interactionDates, interactions) {
    return events.map(event => {
        // Find the exact match for the event's period in the interaction timeline
        const exactIndex = interactionDates.indexOf(event.period);
        return {
            x: event.period, // Use exact period for precision
            y: exactIndex >= 0 ? interactions[exactIndex] * 1.2 : null, // Place at 80% of y-axis for visibility
            label: event.event_title
        };
    });
}

// Render Original Interaction Timeline
function renderOriginalTimeline() {
    const filteredData = filterAfter2021(interactionData);
    const dates = filteredData.map(row => row.period);
    const interactions = filteredData.map(row => row.totalInteractions);

    originalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Total Interactions',
                data: interactions,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Total Interactions Timeline (After 2021)' }
            },
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Total Interactions' }, beginAtZero: true }
            }
        }
    });
}

// Render Combined Timeline
function renderCombinedTimeline() {
    const filteredData = filterAfter2021(interactionData);
    const dates = filteredData.map(row => row.period);
    const interactions = filteredData.map(row => row.totalInteractions);

    // Align Events with Timeline
    const alignedGlobalEvents = alignEvents(eventsData, dates, interactions);
    const alignedWarEvents = alignEvents(ukraineEventsData, dates, interactions);

    combinedChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Total Interactions',
                    data: interactions,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true
                },
                {
                    type: 'scatter',
                    label: 'Global Events',
                    data: alignedGlobalEvents,
                    backgroundColor: 'red',
                    pointRadius: 12,
                    pointStyle: 'circle',
                    yAxisID: 'y'
                },
                {
                    type: 'scatter',
                    label: 'Ukraine War Events',
                    data: alignedWarEvents,
                    backgroundColor: 'blue',
                    pointRadius: 20,
                    pointStyle: 'triangle',
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Combined Timeline: Interactions and Events' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            // Remove the default date from the tooltip
                            if (context.dataset.type === 'scatter') {
                                return context.dataset.label + ': ' + context.raw.label;
                            } else {
                                // Default tooltip for Total Interactions
                                return context.dataset.label + ': ' + context.formattedValue;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Date' }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Total Interactions' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Global Events' }
                },
                y2: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Ukraine War Events' },
                    ticks: { color: 'orange' }
                }
            }
        }
    });
}

// Render Event Lists
function renderEventsList(containerId, events) {
    const listContainer = document.getElementById(containerId);
    listContainer.innerHTML = ''; // Clear previous entries

    events.forEach(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `${event.period}: ${event.event_title}`;
        listContainer.appendChild(listItem);
    });
}

function renderUkraineEventsList() {
    renderEventsList('ukraine-events', ukraineEventsData);
}

function renderGlobalEventsList() {
    renderEventsList('global-events', eventsData);
}

// Switch Tabs
function switchTab(index) {
    document.querySelectorAll('.tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    if (originalChart) originalChart.destroy();
    if (combinedChart) combinedChart.destroy();

    if (index === 0) renderOriginalTimeline();
    else if (index === 1) renderCombinedTimeline();
}

// Render Word Cloud
async function renderWordCloud() {
    const response = await fetch('http://localhost:3000/api/trendingKeywords');
    const data = await response.json();

    const words = data.map(row => [row.keyword, row.total_occurrences]);

    WordCloud(document.getElementById('word-cloud-container'), {
        list: words,
        gridSize: 1,
        weightFactor: (size) => Math.log2(size) * 10,
        fontFamily: 'Arial, sans-serif',
        color: 'random-dark',
        rotateRatio: 0.5,
        drawOutOfBound: false
    });
}

// Initial Data Fetch
fetchData().then(() => {
    renderUkraineEventsList();
    renderGlobalEventsList();
});
