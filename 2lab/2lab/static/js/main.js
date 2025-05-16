document.addEventListener("DOMContentLoaded", function () {
    createTable(billioners, 'list');

    const filterForm = document.getElementById('filter');
    const sortForm = document.getElementById('sort');
    const findBtn = document.getElementById('findBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sortBtn = document.getElementById('sortBtn');
    const resetSortBtn = document.getElementById('resetSortBtn');
    const firstSelect = document.getElementById('fieldsFirst');
    const secondSelect = document.getElementById('fieldsSecond');

    setSortSelects(billioners[0], sortForm);

    findBtn.addEventListener('click', function () {
        filterTable(billioners, 'list', filterForm);
        resetSortForm(sortForm);
    });

    clearBtn.addEventListener('click', function () {
        clearFilter('list', billioners, filterForm);
        resetSortForm(sortForm);
    });

    firstSelect.addEventListener('change', function () {
        changeNextSelect('fieldsSecond', [firstSelect]);
        changeNextSelect('fieldsThird', [firstSelect, secondSelect]);
    });

    secondSelect.addEventListener('change', function () {
        changeNextSelect('fieldsThird', [firstSelect, secondSelect]);
    });

    sortBtn.addEventListener('click', function () {
        sortTable('list', sortForm);
    });

    resetSortBtn.addEventListener('click', function () {
        resetSort('list', billioners, sortForm);
        clearFilter('list', billioners, filterForm);
    });

    let button = d3.select("#start");
    let clicked = false;
    button.on("click", function () {
        if (clicked) {
            d3.select("#list").style("visibility", "visible");
            button.text("Скрыть таблицу");
        }
        if (!clicked) {
            d3.select("#list").style("visibility", "collapse");
            button.text("Показать таблицу");
        }
        clicked = !clicked;
    });
    d3.select("#reset-graph").on("click", function () {
        d3.select("svg").selectAll("*").remove();
        d3.select("#chart-message").node().style.display = "";
    })

    // Кнопка для построения графика
    let button2 = d3.select("#build-graph");
    button2.on("click", function () {
        let check1 = d3.select("#resMax").node().checked;
        let check2 = d3.select("#resMin").node().checked;

        if (!check1 && !check2) {
            // Ни один чекбокс не выбран
            d3.select("#error-message")
                .text("Выберите хотя бы один график для отображения!")
                .style("color", "red");
            d3.select("#resMax").node().parentElement.style.color = "red";
            d3.select("#resMin").node().parentElement.style.color = "red";
        } else {
            // Хотя бы один чекбокс выбран
            d3.select("#error-message").text(""); // Убираем сообщение об ошибке
            d3.select("#resMax").node().parentElement.style.color = ""; // Убираем красный цвет
            d3.select("#resMin").node().parentElement.style.color = ""; // Убираем красный цвет
            d3.select("#chart-message").node().style.display = "none";
            draw(tableData); // Строим график
        }
    });

    // обработчики событий для автоматического снятия ошибок
    d3.select("#resMax").on("change", function () {
        if (d3.select("#resMax").node().checked || d3.select("#resMin").node().checked) {
            d3.select("#error-message").text("");
            d3.select("#resMax").node().parentElement.style.color = "";
            d3.select("#resMin").node().parentElement.style.color = "";
        }
    });

    d3.select("#resMin").on("change", function () {
        if (d3.select("#resMax").node().checked || d3.select("#resMin").node().checked) {
            d3.select("#error-message").text("");
            d3.select("#resMax").node().parentElement.style.color = "";
            d3.select("#resMin").node().parentElement.style.color = "";
        }
    });
});

let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
};


let setSortSelect = (head, sortSelect) => {
    sortSelect.append(createOption('Нет', 0));
    for (let i in head) {
        sortSelect.append(createOption(head[i], Number(i) + 1));
    }
};

let setSortSelects = (data, dataForm) => {
    let head = Object.keys(data);
    let allSelect = dataForm.getElementsByTagName('select');

    for (let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
        if (j > 0) {
            allSelect[j].disabled = true;
        }
    }
};

let changeNextSelect = (nextSelectId, prevSelects) => {
    let nextSelect = document.getElementById(nextSelectId);

    if (prevSelects.some(sel => sel.value == '0')) {
        nextSelect.disabled = true;
        nextSelect.value = '0';
        document.getElementById(nextSelectId + 'Desc').checked = false;
        return;
    }

    nextSelect.disabled = false;
    nextSelect.innerHTML = prevSelects[0].innerHTML;

    for (let sel of prevSelects) {
        if (sel.value != '0') {
            let opt = nextSelect.querySelector(`option[value="${sel.value}"]`);
            if (opt) {
                nextSelect.removeChild(opt);
            }
        }
    }

    nextSelect.value = '0';
    document.getElementById(nextSelectId + 'Desc').checked = false;
};

let resetSortForm = (dataForm) => {
    let allSelect = dataForm.getElementsByTagName('select');
    let allCheckboxes = dataForm.getElementsByTagName('input');

    for (let j = 0; j < allSelect.length; j++) {
        allSelect[j].innerHTML = '';
        setSortSelect(Object.keys(billioners[0]), allSelect[j]);
        allSelect[j].value = 0;
        if (j > 0) {
            allSelect[j].disabled = true;
        }
    }

    for (let j = 0; j < allCheckboxes.length; j++) {
        if (allCheckboxes[j].type === 'checkbox') {
            allCheckboxes[j].checked = false;
        }
    }
};


