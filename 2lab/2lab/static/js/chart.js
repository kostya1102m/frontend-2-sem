// Функция создает массив данных для графика
function createArrGraph(data, key) {
    groupObj = d3.group(data, d => d[key]);

    let arrGraph = [];
    // Перебираем каждую группу
    for (let entry of groupObj) {
        let minMax = d3.extent(entry[1].map(d => d['Стоимость чистых активов (млрд USD)']));
        arrGraph.push({ labelX: entry[0], values: minMax });
    }
    console.table(arrGraph);
    return arrGraph;
}

// Основная функция отрисовки графика
function draw(data) {
    let keyX = d3.select('input[name="ox"]:checked').property("value");

    const arrGraph = createArrGraph(data, keyX);

    let svg = d3.select("svg")
    svg.selectAll('*').remove();

    attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 100,
        marginY: 100
    }

    // Создаем оси и получаем шкалы преобразования
    const [scX, scY] = createAxis(svg, arrGraph, attr_area);

    // Определяем тип графика (гистограмма или точки)
    let sel = d3.select("#visualizationType").property("value");
    if (sel == "scatter")
        createChartDot(svg, arrGraph, scX, scY, attr_area, "red");
    else if (sel == "bar")
        createChartGist(svg, arrGraph, scX, scY, attr_area, "red");
    else
        createChartLine(svg, arrGraph, scX, scY, attr_area, "red");
}

// Функция создания осей и шкал преобразования
function createAxis(svg, data, attr_area) {
    // Определяем минимальное и максимальное значение по оси Y
    let [min, max] = d3.extent(data.map(d => d.values[1]));

    // Получаем ключ по оси X
    let keyX = d3.select('input[name="ox"]:checked').property("value");

    // Шкала для оси X
    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX]);

    // Шкала для оси Y
    let scaleY = d3.scaleLinear()
        .domain([min * 0.85, max * 1.1])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    // Создание и отрисовка осей
    let axisX = d3.axisBottom(scaleX);
    let axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);

    return [scaleX, scaleY];
}

// Функция создания гистограммы
function createChartGist(svg, data, scaleX, scaleY, attr_area, color) {
    let check1 = d3.select("#resMax").property("checked");
    let check2 = d3.select("#resMin").property("checked");

    // Если оба чекбокса включены, рисуем оба столбца
    if (check1 && check2) {
        createGist(svg, data, scaleX, scaleY, attr_area, "red", d => scaleY(d.values[1]), 1);
        createGist(svg, data, scaleX, scaleY, attr_area, "blue", d => scaleY(d.values[0]), 4);
    }
    else if (check1) {
        createGist(svg, data, scaleX, scaleY, attr_area, "red", d => scaleY(d.values[1]));
    }
    else if (check2) {
        createGist(svg, data, scaleX, scaleY, attr_area, "blue", d => scaleY(d.values[0]));
    }
}

// Функция создания точечной диаграммы
function createChartDot(svg, data, scaleX, scaleY, attr_area, color) {
    let check1 = d3.select("#resMax").property("checked");
    let check2 = d3.select("#resMin").property("checked");

    if (check1 && check2) {
        createDot(svg, data, scaleX, attr_area, "red", d => scaleY(d.values[1]), 1);
        createDot(svg, data, scaleX, attr_area, "blue", d => scaleY(d.values[0]), -1);
    }
    else if (check1) {
        createDot(svg, data, scaleX, attr_area, "red", d => scaleY(d.values[1]));
    }
    else if (check2) {
        createDot(svg, data, scaleX, attr_area, "blue", d => scaleY(d.values[0]));
    }
}

// Функция создания линейного графика
function createChartLine(svg, data, scaleX, scaleY, attr_area, color) {
    let check1 = d3.select("#resMax").property("checked");
    let check2 = d3.select("#resMin").property("checked");

    if (check1 && check2) {
        createCurve(svg, data, scaleX, scaleY, attr_area, "red", d => scaleY(d.values[1]), 1);
        createCurve(svg, data, scaleX, scaleY, attr_area, "blue", d => scaleY(d.values[0]), 1);
    } else if (check1) {
        createCurve(svg, data, scaleX, scaleY, attr_area, "red", d => scaleY(d.values[1]), 1);
    } else if (check2) {
        createCurve(svg, data, scaleX, scaleY, attr_area, "blue", d => scaleY(d.values[0]), 1);
    }
}

// Функция рисует точки
function createDot(svg, data, scaleX, attr_area, color, value, shift = 0) {
    const r = 4;
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", r)
        .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + shift)
        .attr("cy", value)
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", color);
}

// Функция рисует столбцы гистограммы
function createGist(svg, data, scaleX, scaleY, attr_area, color, value, shift = 0) {
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + shift)
        .attr("y1", value)
        .attr("x2", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + shift)
        .attr("y2", scaleY.range()[0]) // основание линии
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .attr("stroke", color)
        .attr("stroke-width", 10);
}

// Функция рисует кривую линию
function createCurve(svg, data, scaleX, scaleY, attr_area, color, value, shift = 0) {
    const lineGenerator = d3.line()
        .x(d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + shift)
        .y(value)
        .defined(d => value(d) !== undefined)
        .curve(d3.curveBasis);

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", "none")
        .style("stroke", color)
        .style("stroke-width", 2);
}

