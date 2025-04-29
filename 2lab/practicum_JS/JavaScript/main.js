document.addEventListener("DOMContentLoaded", function() {
    // Initially display the full table
    createTable(buildings, 'list');

    // Get the forms and buttons
    const filterForm = document.getElementById('filter');
    const sortForm = document.getElementById('sort');
    const findBtn = document.getElementById('findBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sortBtn = document.getElementById('sortBtn');
    const resetSortBtn = document.getElementById('resetSortBtn');

    // Set up sorting selects
    setSortSelects(buildings[0], sortForm);

    // Event listener for the "Find" button
    findBtn.addEventListener('click', function() {
        filterTable(buildings, 'list', filterForm);
        resetSortForm(sortForm); // Reset sorting form after filtering
    });

    // Event listener for the "Clear Filters" button
    clearBtn.addEventListener('click', function() {
        clearFilter('list', buildings, filterForm);
        resetSortForm(sortForm); // Reset sorting form after clearing filters
    });

    // Event listener for the first sorting select
    document.getElementById('fieldsFirst').addEventListener('change', function() {
        changeNextSelect('fieldsSecond', this);
    });

    // Event listener for the second sorting select
    document.getElementById('fieldsSecond').addEventListener('change', function() {
        changeNextSelect('fieldsThird', this);
    })

    // Event listener for the "Sort" button
    sortBtn.addEventListener('click', function() {
        sortTable('list', sortForm);
    });

    // Event listener for the "Reset Sort" button
    resetSortBtn.addEventListener('click', function() {
        resetSort('list', buildings, sortForm);
        clearFilter('list', buildings, filterForm);
    });
});

// Function to create an option element
let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
};

// Function to populate a select element with options
let setSortSelect = (head, sortSelect) => {
    sortSelect.append(createOption('Нет', 0));
    for (let i in head) {
        sortSelect.append(createOption(head[i], Number(i) + 1));
    }
};

// Function to set up sorting selects
let setSortSelects = (data, dataForm) => {
    let head = Object.keys(data);
    let allSelect = dataForm.getElementsByTagName('select');

    for (let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
        if (j > 0) {
            allSelect[j].disabled = true; // Disable all selects except the first
        }
    }
};

// Function to adjust the next select based on the current selection
let changeNextSelect = (nextSelectId, curSelect) => {
    const filterForm = document.getElementById('filter');
    let nextSelect = document.getElementById(nextSelectId);
    nextSelect.disabled = false;
    nextSelect.innerHTML = curSelect.innerHTML;

    if (curSelect.value != 0) {
        nextSelect.remove(curSelect.value);
        console.log("dsahfjskh")
    } else {
        nextSelect.disabled = true;
        console.log("dsahfssssssssssssjskh")
        clearTable('list');
        createTable(buildings, 'list');
        clearFilter('list', buildings, filterForm)
    }
};

// Function to reset the sorting form
let resetSortForm = (dataForm) => {
    let allSelect = dataForm.getElementsByTagName('select');
    let allCheckboxes = dataForm.getElementsByTagName('input');

    for (let j = 0; j < allSelect.length; j++) {
        allSelect[j].innerHTML = ''; // Clear current options
        setSortSelect(Object.keys(buildings[0]), allSelect[j]); // Repopulate
        allSelect[j].value = 0; 
        if (j > 0) {
            allSelect[j].disabled = true; // Disable all except first
        }
    }

    for (let j = 0; j < allCheckboxes.length; j++) {
        if (allCheckboxes[j].type === 'checkbox') {
            allCheckboxes[j].checked = false; // Uncheck all checkboxes
        }
    }
};