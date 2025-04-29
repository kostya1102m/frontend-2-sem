const sumUniqueTwoDigitNumbers = (...strings) => {
 
    if (strings.length === 0) return 0;
  
    const wordArrays = strings.map(str => str.split(' '));
  
    const [firstArray, ...restArrays] = wordArrays;
  
   
    const getTwoDigitNumbers = arr =>
      arr
        .map(word => parseInt(word, 10)) 
        .filter(num => !isNaN(num) && num >= 10 && num <= 99);
  
    // Получаем двухзначные числа из первой строки
    const firstTwoDigits = new Set(getTwoDigitNumbers(firstArray));
  
    const restTwoDigits = new Set(
      restArrays
        .flatMap(getTwoDigitNumbers) 
    );
  
    const uniqueTwoDigits = [...firstTwoDigits]
      .filter(num => !restTwoDigits.has(num));
  

    return uniqueTwoDigits.reduce((sum, num) => sum + num, 0);
  };
  
  // Примеры использования
  console.log(sumUniqueTwoDigitNumbers("12 23 45 12 67", "23 45 89")); // 12 + 67 = 79
  console.log(sumUniqueTwoDigitNumbers("10 20 30", "20", "30")); // 10
  console.log(sumUniqueTwoDigitNumbers("11 22 33 11", "44 55")); // 11 + 22 + 33 = 66
  console.log(sumUniqueTwoDigitNumbers("1 2 3")); // 0 (нет двухзначных)
  console.log(sumUniqueTwoDigitNumbers()); // 0 (нет строк)