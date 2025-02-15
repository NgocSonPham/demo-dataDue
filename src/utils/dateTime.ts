function formatDateTime(isoString: string, sortTime: boolean = false): [string, string] {
  const date = new Date(isoString);

  // Extract day, month, and year
  const day: string = date.getUTCDate().toString().padStart(2, "0");
  const month: string = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year: number = date.getUTCFullYear();

  // Format time in Vietnam timezone
  const timeString: string = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const dateString = sortTime ? `${day}/${month}/${year}` : `${day} Tháng ${month}, ${year}`;

  return [dateString, timeString];
}

export default formatDateTime;
