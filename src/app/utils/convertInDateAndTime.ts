export const convertDateAndTime = (dateStr: string) => {
  // Parse the input string into a Date object
  const localDate = new Date(dateStr.replace(' ', 'T') + ':00');

  // Format the Date object as UTC
  const utcYear = localDate.getUTCFullYear();
  const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const utcDay = String(localDate.getUTCDate()).padStart(2, '0');
  const utcHours = String(localDate.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, '0');

  return `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}`;
};
