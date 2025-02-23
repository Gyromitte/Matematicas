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
  
    // Contenedor para mostrar los pasos
    const stepsContainer = document.getElementById('steps');
    stepsContainer.innerHTML = ''; // Limpiar pasos anteriores
  
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
  
      // Mostrar los pasos con MathJax
      const stepText = `
        <div class="math">
          <strong>Iteración ${i + 1}:</strong><br>
          - \\( x_{${i}} = ${xn.toFixed(2)}, \\quad y_{${i}} = ${yn.toFixed(2)} \\)<br>
          - Predicción: \\( y_{\\text{pred}} = y_{${i}} + h \\cdot f(x_{${i}}, y_{${i}}) = ${yPred.toFixed(2)} \\)<br>
          - Corrección: \\( y_{${i + 1}} = y_{${i}} + \\frac{h}{2} \\left[ f(x_{${i}}, y_{${i}}) + f(x_{${i + 1}}, y_{\\text{pred}}) \\right] = ${yn1.toFixed(2)} \\)
        </div>
      `;
      stepsContainer.innerHTML += stepText;
    }
  
    // Forzar a MathJax a reprocesar el contenido
    if (MathJax.typeset) {
      MathJax.typeset();
    }
  
    // Graficar los resultados
    graficarResultados(xValues, yValues);
  }
  
  function graficarResultados(xValues, yValues) {
    const ctx = document.getElementById('grafica').getContext('2d');
  
    // Si ya existe una gráfica, destruirla
    if (window.myChart) {
      window.myChart.destroy();
    }
  
    // Crear la gráfica
    window.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: xValues.map(x => x.toFixed(2)),
        datasets: [{
          label: 'Aproximación (Euler Mejorado)',
          data: yValues,
          borderColor: 'var(--green)',
          fill: false,
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'x'
            }
          },
          y: {
            title: {
              display: true,
              text: 'y'
            }
          }
        }
      }
    });
  }