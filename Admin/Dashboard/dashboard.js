const salesCtx = document.createElement("canvas");
document.querySelector(".charts .card:nth-child(1) .chart-placeholder").replaceWith(salesCtx);

new Chart(salesCtx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Sales ($)',
      data: [1200, 1900, 3000, 2500, 4000, 4600, 5200],
      borderColor: '#059669',
      backgroundColor: 'rgba(5, 150, 105, 0.2)',
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  }
});

// ===== Top Categories Pie Chart =====
const catCtx = document.createElement("canvas");
document.querySelector(".charts .card:nth-child(2) .chart-placeholder").replaceWith(catCtx);

new Chart(catCtx, {
  type: 'pie',
  data: {
    labels: ['Headphones', 'Mobiles', 'Laptops', 'Accessories'],
    datasets: [{
      label: 'Top Categories',
      data: [40, 25, 20, 15],
      backgroundColor: ['#059669', '#f59e0b', '#3b82f6', '#ef4444']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});
app.use(express.static("public"));