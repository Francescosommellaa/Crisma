export const exportToCsv = <T extends Record<string, unknown>>(data: T[], filename: string) => {
    if (!data.length) return;
  
    const headers = Object.keys(data[0]);
    const csvContent =
      headers.join(',') + '\n' +
      data.map(row =>
        headers.map(header =>
          JSON.stringify(row[header] ?? '')
        ).join(',')
      ).join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  