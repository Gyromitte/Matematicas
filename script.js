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
  // Obtener la función f(x, y) del usuario
  const fString = document.getElementById('fxy').value;
  if (!/^[0-9xy+\-*\/().\s^]+$/.test(fString)) {
      alert("La función ingresada no es válida.");
      return;
  }
  const f = (x, y) => eval(fString); // Evaluar función ingresada

  // Obtener valores de los inputs
  const x0 = parseFloat(document.getElementById('x0').value);
  const y0 = parseFloat(document.getElementById('y0').value);
  const h = parseFloat(document.getElementById('h').value);
  const xn = parseFloat(document.getElementById('xn').value);

  // Validar entradas
  if (isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xn)) {
      alert("Por favor, ingresa valores numéricos válidos.");
      return;
  }
  if (h <= 0) {
      alert("El valor de h debe ser mayor que cero.");
      return;
  }
  if (xn <= x0) {
      alert("El valor final xn debe ser mayor que x0.");
      return;
  }

  // Calcular el número de iteraciones
  const n = Math.ceil((xn - x0) / h);

  // Arrays para almacenar los resultados
  const xValues = [x0];
  const yValues = [y0];

  // Limpiar tabla y pasos anteriores
  document.getElementById('steps').innerHTML = '';
  document.querySelector('#results-table tbody').innerHTML = '';

  // Aplicar el Método de Euler Mejorado
  for (let i = 0; i < n; i++) {
      const xnCurrent = xValues[i];
      const yn = yValues[i];
      const xnNext = xnCurrent + h;

      // Paso de predicción
      const fxnyn = f(xnCurrent, yn);
      const yPred = yn + h * fxnyn;

      // Paso de corrección
      const fxn1ypred = f(xnNext, yPred);
      const yn1 = yn + (h / 2) * (fxnyn + fxn1ypred);

      // Guardar los nuevos valores
      xValues.push(xnNext);
      yValues.push(yn1);

      // Mostrar los pasos con MathJax
      const stepText = `
      <div class="math">
          <strong>Iteración ${i + 1}:</strong><br>
          - \\( x_{${i}} = ${xnCurrent.toFixed(5)}, \\quad y_{${i}} = ${yn.toFixed(5)} \\) <br>
          - \\( x_{${i+1}} = x_{${i}} + h = ${xnCurrent.toFixed(5)} + ${h.toFixed(5)} = ${xnNext.toFixed(5)} \\) <br>
          - \\( y_{\\text{pred}} = y_{${i}} + h \\cdot f(x_{${i}}, y_{${i}}) = ${yn.toFixed(5)} + ${h.toFixed(5)} \\cdot f(${xnCurrent.toFixed(5)}, ${yn.toFixed(5)}) = ${yPred.toFixed(5)} \\) <br>
          - \\( y_{${i+1}} = y_{${i}} + \\frac{h}{2} \\left[ f(x_{${i}}, y_{${i}}) + f(x_{${i+1}}, y_{\\text{pred}}) \\right] = ${yn.toFixed(5)} + \\frac{${h.toFixed(5)}}{2} \\left[ f(${xnCurrent.toFixed(5)}, ${yn.toFixed(5)}) + f(${xnNext.toFixed(5)}, ${yPred.toFixed(5)}) \\right] = ${yn1.toFixed(5)} \\)
      </div>
    `;
      document.getElementById('steps').innerHTML += stepText;

      // Agregar fila a la tabla
      document.querySelector('#results-table tbody').innerHTML += `
          <tr>
              <td>${i + 1}</td>
              <td>${xnCurrent.toFixed(5)}</td>
              <td>${yn.toFixed(5)}</td>
              <td>${yPred.toFixed(5)}</td>
              <td>${yn1.toFixed(5)}</td>
              <td>${xnNext.toFixed(5)}</td>
          </tr>
      `;
  }

  // Esperar un pequeño tiempo y luego procesar MathJax
  setTimeout(() => {
      if (window.MathJax) {
          MathJax.typesetPromise();
      }
  }, 100);
}

/* RUNGE KUTTA 4TO ORDEN */
function calculateRungeKutta() {
  // Obtener la función f(x, y) ingresada por el usuario
  const fString = document.getElementById('rk-function').value;

  // Asegurar que la función usa `Math.pow` en lugar de `^`
  const safeFString = fString.replace(/\^/g, "**");

  // Crear función segura usando `Math`
  const f = new Function("x", "y", `with (Math) { return ${safeFString}; }`);

  // Obtener valores de los inputs
  const x0 = parseFloat(document.getElementById('rk-x0').value);
  const y0 = parseFloat(document.getElementById('rk-y0').value);
  const h = parseFloat(document.getElementById('rk-h').value);
  const xnFinal = parseFloat(document.getElementById('rk-xn').value);

  // Validar entradas
  if (isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xnFinal)) {
      alert("Por favor, ingresa valores numéricos válidos en todos los campos.");
      return;
  }
  if (h <= 0) {
      alert("El valor de h debe ser mayor que cero.");
      return;
  }
  if (xnFinal <= x0) {
      alert("El valor final xn debe ser mayor que x0.");
      return;
  }

  // Mostrar valores iniciales en la consola
  console.log("Valores iniciales:");
  console.log(`x0 = ${x0}, y0 = ${y0}, h = ${h}, xnFinal = ${xnFinal}`);

  // Calcular el número de iteraciones
  const n = Math.ceil((xnFinal - x0) / h);

  // Arrays para almacenar los resultados
  const xValues = [x0];
  const yValues = [y0];

  // Limpiar contenido previo
  document.getElementById('rk-steps').innerHTML = '';
  document.querySelector('#rk-results-table tbody').innerHTML = '';

  // Aplicar el Método de Runge-Kutta de 4to orden
  for (let i = 0; i < n; i++) {
    const xi = xValues[i];
    const yi = yValues[i];

    // Cálculo de los coeficientes
    const k1 = f(xi, yi);
    const k2 = f(xi + h / 2, yi + (h / 2) * k1);
    const k3 = f(xi + h / 2, yi + (h / 2) * k2);
    const k4 = f(xi + h, yi + h * k3);

    // Mostrar coeficientes en la consola
    console.log(`Iteración ${i + 1}:`);
    console.log(`k1 = ${k1}, k2 = ${k2}, k3 = ${k3}, k4 = ${k4}`);

    // Actualización de yₙ₊₁
    const yiNext = yi + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    const xiNext = xi + h;

    // Guardar valores calculados
    xValues.push(xiNext);
    yValues.push(yiNext);

    // Mostrar pasos en MathJax
    const stepText = `
        <div class="math">
            <strong>Iteración ${i + 1}:</strong><br>
            - \\( x_{${i}} = ${xi.toFixed(5)}, \\quad y_{${i}} = ${yi.toFixed(5)} \\) <br>
            - \\( k_1 = f(x_{${i}}, y_{${i}}) = f(${xi.toFixed(5)}, ${yi.toFixed(5)}) = ${k1.toFixed(5)} \\) <br>
            - \\( k_2 = f\\left(x_{${i}} + \\frac{h}{2}, y_{${i}} + \\frac{h}{2} k_1\\right) = f\\left(${(xi + h / 2).toFixed(5)}, ${(yi + (h / 2) * k1).toFixed(5)}\\right) = ${k2.toFixed(5)} \\) <br>
            - \\( k_3 = f\\left(x_{${i}} + \\frac{h}{2}, y_{${i}} + \\frac{h}{2} k_2\\right) = f\\left(${(xi + h / 2).toFixed(5)}, ${(yi + (h / 2) * k2).toFixed(5)}\\right) = ${k3.toFixed(5)} \\) <br>
            - \\( k_4 = f\\left(x_{${i}} + h, y_{${i}} + h k_3\\right) = f\\left(${(xi + h).toFixed(5)}, ${(yi + h * k3).toFixed(5)}\\right) = ${k4.toFixed(5)} \\) <br>
            - \\( y_{${i+1}} = y_{${i}} + \\frac{h}{6} (k_1 + 2k_2 + 2k_3 + k_4) = ${yi.toFixed(5)} + \\frac{${h.toFixed(5)}}{6} (${k1.toFixed(5)} + 2 \\cdot ${k2.toFixed(5)} + 2 \\cdot ${k3.toFixed(5)} + ${k4.toFixed(5)}) = ${yiNext.toFixed(5)} \\)
        </div>
    `;
    document.getElementById('rk-steps').innerHTML += stepText;

    // Agregar fila a la tabla
    document.querySelector('#rk-results-table tbody').innerHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${xi.toFixed(5)}</td>
            <td>${yi.toFixed(5)}</td>
            <td>${k1.toFixed(5)}</td>
            <td>${k2.toFixed(5)}</td>
            <td>${k3.toFixed(5)}</td>
            <td>${k4.toFixed(5)}</td>
            <td>${yiNext.toFixed(5)}</td>
            <td>${xiNext.toFixed(5)}</td>
        </tr>
    `;
  }

  // Actualizar MathJax
  setTimeout(() => {
      if (window.MathJax) {
          MathJax.typesetPromise();
      }
  }, 100);
}

/* NEWTWON RAPHSON */
function calculateNewtonRaphson() {
  // Obtener valores de los inputs
  let funcion = document.getElementById('nr-funcion').value;
  const x0 = parseFloat(document.getElementById('nr-x0').value);
  const tolerancia = parseFloat(document.getElementById('nr-tolerancia').value);
  const maxIter = 100; // Valor predeterminado para el número máximo de iteraciones

  // Reemplazar ** por ^ para que math.js lo entienda
  funcion = funcion.replace(/\*\*/g, '^');

  // Validaciones
  if (isNaN(x0) || isNaN(tolerancia)) {
    alert("Por favor, ingresa valores numéricos válidos en los campos de x0 y tolerancia.");
    return;
  }

  if (tolerancia <= 0) {
    alert("La tolerancia debe ser mayor que cero.");
    return;
  }

  if (funcion.trim() === "") {
    alert("Por favor, ingresa una función válida.");
    return;
  }

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