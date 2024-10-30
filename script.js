let points = [];
let chart;

document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");
});

// Fade-out effect when clicking on links
document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const target = this.href;
        document.body.classList.remove("fade-in");
        document.body.style.opacity = "0";
        setTimeout(() => {
            window.location.href = target;
        }, 500); // Match the duration with the CSS transition
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const xInput = document.getElementById("x");
    const yInput = document.getElementById("y");
    const addButton = document.getElementById("add-point-button"); // Ensure this ID matches your button

    // When Enter is pressed in the x-coordinate field, move to y-coordinate field
    xInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            yInput.focus();
        }
    });

    
    yInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addButton.click();
        }
    });
});

function addPoint() {
  const x = parseFloat(document.getElementById("x").value);
  const y = parseFloat(document.getElementById("y").value);

  if (!isNaN(x) && !isNaN(y)) {
    points.push({ x, y });
    updatePointList();
    updateChart();
    document.getElementById("x").value = '';
    document.getElementById("y").value = '';
    document.getElementById("x").focus();
  }
}

function updatePointList() {
  const list = document.getElementById("point-list");
  list.innerHTML = '';
  points.forEach((point, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Point ${index + 1}: (${point.x}, ${point.y})`;
    list.appendChild(listItem);
  });
}

function calculateBestFitLine() {
  const n = points.length;
  if (n < 2) return null;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  points.forEach(point => {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumX2 += point.x * point.x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function updateChart() {
  const ctx = document.getElementById("myChart").getContext("2d");

  if (!chart) {
    chart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [{
          label: "Points",
          data: points,
          backgroundColor: "blue",
        }, {
          label: "Best Fit Line",
          data: [],
          type: "line",
          fill: false,
          borderColor: "red",
          borderWidth: 2,
          pointRadius: 0,
        }]
      },
      options: {
        scales: {
          x: { type: 'linear', position: 'bottom', beginAtZero: true, border: { color: 'blue' } },
          y: { type: 'linear', beginAtZero: false }
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuad"
        }
      }
    });
  } else {
    chart.data.datasets[0].data = points;
    const line = calculateBestFitLine();

    if (line) {
      const xMin = Math.min(...points.map(p => p.x));
      const xMax = Math.max(...points.map(p => p.x));
      chart.data.datasets[1].data = [
        { x: xMin, y: line.slope * xMin + line.intercept },
        { x: xMax, y: line.slope * xMax + line.intercept }
      ];
    }

    chart.update();
  }
}

function updateChart() {
    const ctx = document.getElementById("myChart").getContext("2d");

    if (!chart) {
        chart = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: [{
                    label: "Points",
                    data: points,
                    backgroundColor: "blue",
                }, {
                    label: "Best Fit Line",
                    data: [],
                    type: "line",
                    fill: false,
                    borderColor: "red",
                    borderWidth: 2,
                    pointRadius: 0,
                }]
            },
            options: {
                scales: {
                    x: { type: 'linear', position: 'bottom' },
                    y: { type: 'linear' }
                },
                animation: {
                    duration: 1000,
                    easing: "easeOutQuad"
                }
            }
        });
    } else {
        chart.data.datasets[0].data = points;
        const line = calculateBestFitLine();

        if (line) {
            const xMin = Math.min(...points.map(p => p.x));
            const xMax = Math.max(...points.map(p => p.x));
            chart.data.datasets[1].data = [
                { x: xMin, y: line.slope * xMin + line.intercept },
                { x: xMax, y: line.slope * xMax + line.intercept }
            ];
            // Update the slope display
            document.getElementById("slope-value").textContent = line.slope.toFixed(2); // Display slope with 2 decimal places
        } else {
            document.getElementById("slope-value").textContent = "N/A"; // If no line is calculated
        }

        chart.update();
    }
}
