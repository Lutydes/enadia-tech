export function printReport(elementId: string) {
  const content = document.getElementById(elementId);
  if (!content) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
    <head>
      <title>Relatório EnadIA</title>
      <style>
        body { font-family: 'Courier New', monospace; padding: 20px; color: #333; }
        h1 { color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
        h2 { color: #0066cc; border-bottom: 1px solid #0066cc; padding-bottom: 6px; margin-top: 24px; }
        h3 { color: #333; margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
        .score-good { color: #16a34a; }
        .score-medium { color: #ca8a04; }
        .score-bad { color: #dc2626; }
        .info-row { margin: 4px 0; }
        .info-label { font-weight: bold; color: #555; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin: 2px; }
        .badge-good { background-color: #dcfce7; color: #16a34a; }
        .badge-medium { background-color: #fef9c3; color: #ca8a04; }
        .badge-bad { background-color: #fee2e2; color: #dc2626; }
        .essay-block { border: 1px solid #ddd; padding: 12px; margin: 8px 0; border-radius: 4px; background: #fafafa; }
        .essay-score { font-weight: bold; font-size: 16px; }
        .feedback { white-space: pre-wrap; font-size: 13px; color: #444; line-height: 1.5; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>${content.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
