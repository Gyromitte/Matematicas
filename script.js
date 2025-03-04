/* TABS BEHAVIOR */
function switchTab(tabId) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.add('hidden');
    });

    // Mostrar la pestaña seleccionada
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
      selectedTab.classList.remove('hidden');
    }

    // Resaltar la pestaña activa en el navbar
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active'); // Remover la clase activa de todas las pestañas
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active'); // Agregar la clase activa solo al tab seleccionado
      }
    });
  }

  // Escuchar clics en los enlaces del navbar
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Evitar que el enlace recargue la página
      const tabId = link.getAttribute('data-tab'); // Obtener el ID de la pestaña
      switchTab(tabId); // Cambiar a la pestaña seleccionada
    });
  });

  // Mostrar la pestaña inicial al cargar la página y resaltar su tab
  window.addEventListener('load', () => {
    switchTab('euler-mejorado');
});

/* EULER MEJORADO */
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

/* RUNGE KUTTA 4TO ORDEN */
function calculateRungeKutta() {
  // Obtener valores de los inputs
  const x0 = parseFloat(document.getElementById('rk-x0').value);
  const y0 = parseFloat(document.getElementById('rk-y0').value);
  const h = parseFloat(document.getElementById('rk-h').value);
  const n = parseInt(document.getElementById('rk-n').value);

  // Definir la EDO: dy/dx = f(x, y)
  function f(x, y) {
    return x + y; // Ejemplo: dy/dx = x + y
  }

  // Arrays para almacenar los resultados
  const xValues = [x0];
  const yValues = [y0];

  // Contenedores para mostrar los pasos y la tabla
  const stepsContainer = document.getElementById('rk-steps');
  const tableBody = document.querySelector('#rk-results-table tbody');
  stepsContainer.innerHTML = ''; // Limpiar pasos anteriores
  tableBody.innerHTML = ''; // Limpiar tabla anterior

  // Aplicar el Método de Runge Kutta de 4to orden
  for (let i = 0; i < n; i++) {
    const xn = xValues[i];
    const yn = yValues[i];

    // Paso 1: k₁
    const k1 = h * f(xn, yn);

    // Paso 2: k₂
    const k2 = h * f(xn + h / 2, yn + k1 / 2);

    // Paso 3: k₃
    const k3 = h * f(xn + h / 2, yn + k2 / 2);

    // Paso 4: k₄
    const k4 = h * f(xn + h, yn + k3);

    // Actualización: yₙ₊₁
    const yn1 = yn + (1 / 6) * (k1 + 2 * k2 + 2 * k3 + k4);

    // Guardar los nuevos valores
    xValues.push(xn + h);
    yValues.push(yn1);

    // Mostrar los pasos con MathJax y valores intermedios
    const stepText = `
      <div class="math">
        <strong>Iteración ${i + 1}:</strong><br>
        - Valores actuales: \\( x_{${i}} = ${xn.toFixed(2)}, \\quad y_{${i}} = ${yn.toFixed(2)} \\)<br>
        - Cálculo de \( k_1 \):<br>
          \\[
          k_1 = h \\cdot f(x_{${i}}, y_{${i}}) = ${h.toFixed(2)} \\cdot ${f(xn, yn).toFixed(2)} = ${k1.toFixed(2)}
          \\]
        - Cálculo de \( k_2 \):<br>
          \\[
          k_2 = h \\cdot f\\left(x_{${i}} + \\frac{h}{2}, y_{${i}} + \\frac{k_1}{2}\\right) = ${h.toFixed(2)} \\cdot ${f(xn + h / 2, yn + k1 / 2).toFixed(2)} = ${k2.toFixed(2)}
          \\]
        - Cálculo de \( k_3 \):<br>
          \\[
          k_3 = h \\cdot f\\left(x_{${i}} + \\frac{h}{2}, y_{${i}} + \\frac{k_2}{2}\\right) = ${h.toFixed(2)} \\cdot ${f(xn + h / 2, yn + k2 / 2).toFixed(2)} = ${k3.toFixed(2)}
          \\]
        - Cálculo de \( k_4 \):<br>
          \\[
          k_4 = h \\cdot f\\left(x_{${i}} + h, y_{${i}} + k_3\\right) = ${h.toFixed(2)} \\cdot ${f(xn + h, yn + k3).toFixed(2)} = ${k4.toFixed(2)}
          \\]
        - Actualización de \( y_{${i + 1}} \):<br>
          \\[
          y_{${i + 1}} = y_{${i}} + \\frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4) = ${yn.toFixed(2)} + \\frac{1}{6}(${k1.toFixed(2)} + 2 \\cdot ${k2.toFixed(2)} + 2 \\cdot ${k3.toFixed(2)} + ${k4.toFixed(2)}) = ${yn1.toFixed(2)}
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
        <td>${k1.toFixed(2)}</td>
        <td>${k2.toFixed(2)}</td>
        <td>${k3.toFixed(2)}</td>
        <td>${k4.toFixed(2)}</td>
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
  graficarResultadosRungeKutta(xValues, yValues);
}

function graficarResultadosRungeKutta(xValues, yValues) {
  const ctx = document.getElementById('rk-grafica').getContext('2d');

  // Si ya existe una gráfica, destruirla
  if (window.rkChart) {
    window.rkChart.destroy();
  }

  // Crear la gráfica
  window.rkChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xValues.map(x => x.toFixed(2)),
      datasets: [{
        label: 'Aproximación (Runge Kutta 4to Orden)',
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

/* NEWTWON RAPHSON */
function calculateNewtonRaphson() {
  // Obtener valores de los inputs
  const funcion = document.getElementById('nr-funcion').value;
  const x0 = parseFloat(document.getElementById('nr-x0').value);
  const tolerancia = parseFloat(document.getElementById('nr-tolerancia').value);
  const maxIter = 100; // Valor predeterminado para el número máximo de iteraciones

  // Calcular la derivada automáticamente usando math.js
  let df;
  try {
    df = math.derivative(funcion, 'x').toString(); // Derivada simbólica
    document.getElementById('nr-derivada-texto').textContent = df; // Mostrar la derivada
  } catch (error) {
    alert("Error al calcular la derivada. Asegúrate de que la función sea válida.");
    return;
  }

  // Definir las funciones f(x) y f'(x) usando math.js
  const f = (x) => math.evaluate(funcion, { x });
  const dfn = (x) => math.evaluate(df, { x });

  // Contenedores para mostrar los pasos y la tabla
  const stepsContainer = document.getElementById('nr-steps');
  const tableBody = document.querySelector('#nr-results-table tbody');
  stepsContainer.innerHTML = ''; // Limpiar pasos anteriores
  tableBody.innerHTML = ''; // Limpiar tabla anterior

  // Aplicar el Método de Newton-Raphson
  let xn = x0;
  let iteracion = 0;
  let resultadoHTML = '';

  while (iteracion < maxIter) {
    const fxn = f(xn);
    const dfxn = dfn(xn);

    // Verificar si la derivada es cero para evitar división por cero
    if (dfxn === 0) {
      resultadoHTML = "Error: La derivada es cero. No se puede continuar.";
      break;
    }

    const xn1 = xn - fxn / dfxn;

    // Mostrar los pasos con MathJax y valores intermedios
    const stepText = `
      <div class="math">
        <strong>Iteración ${iteracion + 1}:</strong><br>
        - \\( x_{${iteracion}} = ${xn.toFixed(4)} \\)<br>
        - \\( f(x_{${iteracion}}) = ${fxn.toFixed(4)} \\)<br>
        - \\( f'(x_{${iteracion}}) = ${dfxn.toFixed(4)} \\)<br>
        - \\( x_{${iteracion + 1}} = x_{${iteracion}} - \\frac{f(x_{${iteracion}})}{f'(x_{${iteracion}})} = ${xn.toFixed(4)} - \\frac{${fxn.toFixed(4)}}{${dfxn.toFixed(4)}} = ${xn1.toFixed(4)} \\)
      </div>
    `;
    stepsContainer.innerHTML += stepText;
  

    // Agregar fila a la tabla
    const row = `
      <tr>
        <td>${iteracion + 1}</td>
        <td>${xn.toFixed(4)}</td>
        <td>${fxn.toFixed(4)}</td>
        <td>${dfxn.toFixed(4)}</td>
        <td>${xn1.toFixed(4)}</td>
      </tr>
    `;
    tableBody.innerHTML += row;

    // Verificar convergencia
    if (Math.abs(xn1 - xn) < tolerancia) {
      resultadoHTML += `<br>Convergencia alcanzada: \( x = ${xn1.toFixed(4)} \)`;
      break;
    }

    xn = xn1;
    iteracion++;
  }

  if (iteracion === maxIter) {
    resultadoHTML += "<br>El método no converge después de " + maxIter + " iteraciones.";
  }

  // Forzar a MathJax a reprocesar el contenido
  if (window.MathJax) {
    MathJax.typesetPromise([stepsContainer]).then(() => {
      console.log("MathJax renderizado correctamente.");
    }).catch((err) => console.log("Error en MathJax:", err));
  }
}