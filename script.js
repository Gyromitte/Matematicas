// Función para calcular el Método de Euler Mejorado
function calculateEuler() {
    // Obtener valores de los inputs
    const x0 = parseFloat(document.getElementById('x0').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const h = parseFloat(document.getElementById('h').value);
    const n = parseInt(document.getElementById('n').value);

    // Definir la EDO: dy/dx = f(x, y)
    function f(x, y) {
      return x + y; // Ejemplo: dy/dx = x + y
    }

    // Arrays para almacenar los resultados
    const xValues = [x0];
    const yValues = [y0];

    // Aplicar el Método de Euler Mejorado
    for (let i = 0; i < n; i++) {
      const xn = xValues[i];
      const yn = yValues[i];

      // Paso de predicción
      const yPred = yn + h * f(xn, yn);

      // Paso de corrección
      const yn1 = yn + (h / 2) * (f(xn, yn) + f(xn + h, yPred));

      // Guardar los nuevos valores
      xValues.push(xn + h);
      yValues.push(yn1);
    }

    // Graficar los resultados
    graficarResultados(xValues, yValues);
  }

  // Función para graficar los resultados usando Chart.js
  function graficarResultados(xValues, yValues) {
    const ctx = document.getElementById('grafica').getContext('2d');

    // Si ya existe una gráfica, destruirla
    if (window.myChart) {
      window.myChart.destroy();
    }

    // Graphic
    const style = getComputedStyle(document.documentElement);

    window.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: xValues.map(x => x.toFixed(2)),
        datasets: [{
          label: 'Aproximación (Euler Mejorado)',
          data: yValues,
          borderColor: style.getPropertyValue('--green'),
          backgroundColor: style.getPropertyValue('--gray'),
          pointBackgroundColor: style.getPropertyValue('--text-color'),
          fill: true,
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'x',
              color: style.getPropertyValue('--text-color'),
            },
            grid: {
                color: style.getPropertyValue('--text-color'),
            },
            ticks: {
                color: style.getPropertyValue('--text-color'),
            },
          },
          y: {
            title: {
              display: true,
              text: 'y',
              color: style.getPropertyValue('--text-color'),
            },
            grid: {
                color: style.getPropertyValue('--text-color'),
            },
            ticks: {
                color: style.getPropertyValue('--text-color'),
            },
          },
        },
      },
    });
  }