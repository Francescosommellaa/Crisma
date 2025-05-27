export const generateCSV = (data: any[]): string => {
  if (!data.length) return '';

  const delimiter = ';'; // <-- Cambia qui il separatore

  const headers = Object.keys(data[0]);
  const rows = data.map(obj =>
    headers.map(h => JSON.stringify(obj[h] ?? '')).join(delimiter)
  );

  return [headers.join(delimiter), ...rows].join('\n');
};
  