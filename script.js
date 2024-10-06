// Data to be used in the chart (array of objects)
var data = [
    { dimension: 'Product A', measure: 10 },
    { dimension: 'Product B', measure: 15 },
    { dimension: 'Product C', measure: 5 },
    { dimension: 'Product D', measure: 20 },
    { dimension: 'Product E', measure: 8 }
];

// Extracting labels and values from data
var labels = data.map(function(row) { return row.dimension; });
var values = data.map(function(row) { return row.measure; });

// Create a doughnut chart using Chart.js
var ctx = document.getElementById('myBarChart').getContext('2d');
var myBarChart = new Chart(ctx, {
    type: 'radar', // Specify chart type
    data: {
        labels: labels, // Set the labels (categories on the x-axis)
        datasets: [{
            label: 'Sales',
            data: values, // Set the data for each category
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        }
    }
});

