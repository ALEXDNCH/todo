interface FormatDateReturn {
  formatDate: (isoDate: string, includeTime?: boolean) => string
}

export function useFormatDate(): FormatDateReturn {
  const formatDate = (isoDate: string, includeTime: boolean = false): string => {
    const date = new Date(isoDate);
    // Извлекаем день, месяц и год
    const day = String(date.getDate()).padStart(2, '0'); // Двузначный день
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Двузначный месяц (getMonth возвращает от 0 до 11)
    const year = String(date.getFullYear()).slice(-2); // Две последние цифры года

    // Базовый формат даты
    let formattedDate = `${day}.${month}.${year}`;

    // Если флаг includeTime установлен в true, добавляем часы и минуты
    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, '0'); // Двузначный час
      const minutes = String(date.getMinutes()).padStart(2, '0'); // Двузначные минуты
      formattedDate += ` ${hours}:${minutes}`;
    }

    return formattedDate;
  }

  return { formatDate }
}
