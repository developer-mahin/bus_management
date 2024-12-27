export const convertDateAndTime = (date: string) => {
  // date format: 2021-09-01 12:00

  const [datePart, timePart] = date.split(' ');
  const [day, month, year] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
  return formattedDate;
};
