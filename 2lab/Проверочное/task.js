const sumUniqueTwoDigitNumbers = (...strings) =>
    strings.length > 0
      ?
        strings[0]
          .split(' ')
          .map(elem => parseInt(elem))
          .filter(num => !isNaN(num) && Math.abs(num) >= 10 && Math.abs(num) <= 99)
          .filter(num => 
            strings.slice(1)
              .flatMap(str => str.split(' ').map(elem => parseInt(elem)))
              .every(otherNum => isNaN(otherNum) || otherNum !== num)
          )
          .filter((num, index, arr) => arr.indexOf(num) === index)
          .reduce((sum, num) => sum + num, 0): 0;

console.log(sumUniqueTwoDigitNumbers("12 12 12 12 20 -12 -12", "50 20", "12")); 