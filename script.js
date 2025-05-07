function calculate() {
  const size = document.querySelector('input[name="size"]:checked').value;
  const heightInput = parseFloat(document.getElementById('height').value);
  const widthInput = parseFloat(document.getElementById('width').value);

  if (isNaN(heightInput) || isNaN(widthInput) || heightInput <= 0 || widthInput <= 0) {
    alert("Por favor, insira valores válidos.");
    return;
  }

  const height = heightInput > 30 ? heightInput : heightInput * 10;
  const width = widthInput > 30 ? widthInput : widthInput * 10;

  let paperWidth, paperHeight;

  if (size === 'A4') {
    paperWidth = 210;
    paperHeight = 297;
  } else {
    paperWidth = 297;
    paperHeight = 420;
  }

  const spacing = 2;

  // ───────────── Posição 1: vertical ─────────────
  const colsV = Math.floor((paperWidth + spacing) / (width + spacing));
  const rowsV = Math.floor((paperHeight + spacing) / (height + spacing));
  const totalV = colsV * rowsV;

  const usedWidthV = colsV * (width + spacing);
  const remainingWidthV = paperWidth - usedWidthV;

  let extraColsH = Math.floor((remainingWidthV + spacing) / (height + spacing));
  let extraRowsH = Math.floor((paperHeight + spacing) / (width + spacing));
  const extraTotalH = extraColsH * extraRowsH;

  const totalMixedV = totalV + extraTotalH;

  // ───────────── Posição 2: horizontal ─────────────
  const colsH = Math.floor((paperWidth + spacing) / (height + spacing));
  const rowsH = Math.floor((paperHeight + spacing) / (width + spacing));
  const totalH = colsH * rowsH;

  const usedWidthH = colsH * (height + spacing);
  const remainingWidthH = paperWidth - usedWidthH;

  let extraColsV = Math.floor((remainingWidthH + spacing) / (width + spacing));
  let extraRowsV = Math.floor((paperHeight + spacing) / (height + spacing));
  const extraTotalV = extraColsV * extraRowsV;

  const totalMixedH = totalH + extraTotalV;

  // ───────────── Escolher o melhor ─────────────
  let bestOption;

  if (totalMixedV > totalMixedH) {
    bestOption = {
      orientation: 'vertical + horizontal',
      total: totalMixedV,
      baseCols: colsV,
      baseRows: rowsV,
      rotatedCols: extraColsH,
      rotatedRows: extraRowsH,
      baseWidth: width,
      baseHeight: height,
      rotatedWidth: height,
      rotatedHeight: width
    };
  } else {
    bestOption = {
      orientation: 'horizontal + vertical',
      total: totalMixedH,
      baseCols: colsH,
      baseRows: rowsH,
      rotatedCols: extraColsV,
      rotatedRows: extraRowsV,
      baseWidth: height,
      baseHeight: width,
      rotatedWidth: width,
      rotatedHeight: height
    };
  }

  displayResult(bestOption, spacing);
  updatePreviewMixed(bestOption, spacing, paperWidth, paperHeight);
}

function displayResult(opt, spacing) {
  alert(`Melhor aproveitamento: ${opt.total} unidades
Orientação base: ${opt.orientation}
Base: ${opt.baseCols} colunas x ${opt.baseRows} linhas
Rotacionadas: ${opt.rotatedCols} colunas x ${opt.rotatedRows} linhas
Espaçamento: ${spacing}mm`);
}

function updatePreviewMixed(opt, spacing, paperWidth, paperHeight) {
  const canvas = document.getElementById('previewCanvas');
  canvas.innerHTML = '';
  canvas.style.position = 'relative';

  const scale = Math.min(canvas.clientWidth / paperWidth, canvas.clientHeight / paperHeight);

  // Base (original orientação)
  for (let r = 0; r < opt.baseRows; r++) {
    for (let c = 0; c < opt.baseCols; c++) {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.width = `${opt.baseWidth * scale}px`;
      div.style.height = `${opt.baseHeight * scale}px`;
      div.style.left = `${c * (opt.baseWidth + spacing) * scale}px`;
      div.style.top = `${r * (opt.baseHeight + spacing) * scale}px`;
      div.style.backgroundColor = '#4e72af';
      div.style.opacity = 0.75;
      div.style.border = '1px solid white';
      canvas.appendChild(div);
    }
  }

  // Rotacionadas (ocupando espaço restante)
  const baseUsedWidth = opt.baseCols * (opt.baseWidth + spacing);
  for (let r = 0; r < opt.rotatedRows; r++) {
    for (let c = 0; c < opt.rotatedCols; c++) {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.width = `${opt.rotatedWidth * scale}px`;
      div.style.height = `${opt.rotatedHeight * scale}px`;
      div.style.left = `${(baseUsedWidth + spacing + c * (opt.rotatedWidth + spacing)) * scale}px`;
      div.style.top = `${r * (opt.rotatedHeight + spacing) * scale}px`;
      div.style.backgroundColor = '#f39c12';
      div.style.opacity = 0.75;
      div.style.border = '1px solid white';
      canvas.appendChild(div);
    }
  }
}
