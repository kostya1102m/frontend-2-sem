// Function to create an array of sorting criteria
let createSortArr = (data) => {
    let sortArr = [];
    let sortSelects = data.getElementsByTagName('select');

    for (let i = 0; i < sortSelects.length; i++) {
        let keySort = sortSelects[i].value;
        if (keySort == 0) {
            break;
        }
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push({ column: keySort - 1, order: desc });
    }
    return sortArr;
};

// Function to sort the table
let sortTable = (idTable, data) => {
    let sortArr = createSortArr(data);

    if (sortArr.length === 0) {
        return false;
    }

    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
    let headerRow = rowData.shift(); // Remove and save the header row

    rowData.sort((first, second) => {
        for (let i in sortArr) {
            let key = sortArr[i].column;
            let order = sortArr[i].order;
            let val1 = first.cells[key].innerHTML;
            let val2 = second.cells[key].innerHTML;

            
            if (key === 4 || key === 5) { 
                val1 = Number(val1);
                val2 = Number(val2);
            }

            if (val1 > val2) {
                return order ? -1 : 1;
            } else if (val1 < val2) {
                return order ? 1 : -1;
            }
        }
        return 0;
    });

    // Rebuild the table
    table.innerHTML = '';
    table.append(headerRow);
    rowData.forEach(item => {
        table.append(item);
    });

    return true;
};

// Function to reset the sorting and restore the original table
let resetSort = (idTable, originalData, dataForm) => {
    resetSortForm(dataForm); // Reset the sorting form
    clearTable(idTable); // Clear the current table
    createTable(originalData, idTable); // Redisplay the original table
};