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

  // Contenedores para mostrar los pasos y la tabla
  const stepsContainer = document.getElementById('steps');
  const tableBody = document.querySelector('#results-table tbody');
  stepsContainer.innerHTML = ''; // Limpiar pasos anteriores
  tableBody.innerHTML = ''; // Limpiar tabla anterior

  // Aplicar el Método de Euler Mejorado
  for (let i = 0; i < n; i++) {
    const xn = xValues[i];
    const yn = yValues[i];

    // Paso de predicción
    const fxnyn = f(xn, yn); // f(xn, yn)
    const yPred = yn + h * fxnyn; // y_pred = yn + h * f(xn, yn)

    // Paso de corrección
    const fxn1ypred = f(xn + h, yPred); // f(xn + h, y_pred)
    const yn1 = yn + (h / 2) * (fxnyn + fxn1ypred); // yn1 = yn + (h/2) * [f(xn, yn) + f(xn + h, y_pred)]

    // Guardar los nuevos valores
    xValues.push(xn + h);
    yValues.push(yn1);

    // Mostrar los pasos con MathJax y valores intermedios
    const stepText = `
      <div class="math">
        <strong>Iteración ${i + 1}:</strong><br>
        - Valores actuales: \\( x_{${i}} = ${xn.toFixed(2)}, \\quad y_{${i}} = ${yn.toFixed(2)} \\)<br>
        - Cálculo de la predicción:<br>
          \\[
          y_{\\text{pred}} = y_{${i}} + h \\cdot f(x_{${i}}, y_{${i}}) = ${yn.toFixed(2)} + ${h.toFixed(2)} \\cdot ${fxnyn.toFixed(2)} = ${yPred.toFixed(2)}
          \\]
        - Cálculo de la corrección:<br>
          \\[
          y_{${i + 1}} = y_{${i}} + \\frac{h}{2} \\left[ f(x_{${i}}, y_{${i}}) + f(x_{${i + 1}}, y_{\\text{pred}}) \\right] = ${yn.toFixed(2)} + \\frac{${h.toFixed(2)}}{2} \\left[ ${fxnyn.toFixed(2)} + ${fxn1ypred.toFixed(2)} \\right] = ${yn1.toFixed(2)}
          \\]
      </div>
    `;
    stepsContainer.innerHTML += stepText;

    // Agregar fila a la tabla
    const row = `
      <tr>
        <td>${i + 1}</td>
        <td>${xn.toFixed(2)}</td>
        <td>${yn.toFixed(2)}</td>
        <td>${yPred.toFixed(2)}</td>
        <td>${yn1.toFixed(2)}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
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