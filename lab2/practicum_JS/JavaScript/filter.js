// Mapping between table columns and form fields
let correspond = {
    "Название": "structure",
    "Тип": "category",
    "Страна": "country",
    "Город": "city",
    "Год": ["yearFrom", "yearTo"],
    "Высота": ["heightFrom", "heightTo"]
};

// Function to extract filter data from the form
let dataFilter = (dataForm) => {
    let dictFilter = {};
    
    for (let j = 0; j < dataForm.elements.length; j++) {
        let item = dataForm.elements[j];
        let valInput = item.value;

        if (item.type == "text") {
            valInput = valInput.toLowerCase();
        }
        else if (item.type == "number") {
            if (valInput === "") {
                if (item.id.includes("From")) {
                    valInput = -Infinity;
                } else if (item.id.includes("To")) {
                    valInput = Infinity;
                }
            } else {
                valInput = Number(valInput);
            }
        }

        dictFilter[item.id] = valInput;
    }
    return dictFilter;
};

// Function to filter the table based on form inputs
let filterTable = (data, idTable, dataForm) => {
    let datafilter = dataFilter(dataForm);

    let tableFilter = data.filter(item => {
        let result = true;

        for (let key in item) {
            let val = item[key];

            if (typeof val == 'string') {
                val = val.toLowerCase();
                result &&= val.indexOf(datafilter[correspond[key]]) !== -1;
            }
            else if (typeof val == 'number') {
                let [fromId, toId] = correspond[key];
                let fromVal = datafilter[fromId];
                let toVal = datafilter[toId];
                result &&= val >= fromVal && val <= toVal;
            }
        }
        return result;
    });

    clearTable(idTable);
    createTable(tableFilter, idTable);
};

// Function to clear filters and reset the table
let clearFilter = (idTable, originalData, dataForm) => {
    for (let j = 0; j < dataForm.elements.length; j++) {
        let item = dataForm.elements[j];
        if (item.type === "text" || item.type === "number") {
            item.value = "";
        }
    }

    clearTable(idTable);
    createTable(originalData, idTable);
};