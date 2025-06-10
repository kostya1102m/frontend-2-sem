
function createArrGraph(data, key) {  
    
    groupObj = d3.group(data, d => d[key]);
    let arrGraph =[];

    for(let entry of groupObj) {
        let minMax = d3.extent(entry[1].map(d => d['Высота']));
        //console.log(entry[1], minMax);
        arrGraph.push({labelX : entry[0], values : minMax});
        //console.log(entry[0])
     }
     return arrGraph;
}

function drawGraph(data) {
    let keyX = d3.select('input[name="ox"]:checked').property("value");
    const arrGraph = createArrGraph(data, keyX);

    let svg = d3.select("svg").
        style("overflow", "visible");
    svg.selectAll('*').remove();

    attr_area = {
        width: 900,
        height: 600,
        marginX: 40,
        marginY: 40
   }

   // Создаем оси и получаем шкалы преобразования
   const [scX, scY] = createAxis(svg, arrGraph, attr_area);
   // Определяем тип графика (гистограмма или точки)
   let sel = d3.select("#type").node().value;
   sel=="first" ? createChartGist(svg, arrGraph, scX, scY, attr_area, "red"):
        createChartDot(svg, arrGraph, scX, scY, attr_area, "red");
}

function createAxis(svg, data, attr_area){
    // Определяем минимальное и максимальное значение по оси Y
    let  [min, max] = d3.extent(data.map(d => d.values[1]));

    // Получаем ключ по оси X
    let keyX = d3.select('input[name="ox"]:checked').property("value");

    // Шкала для оси X
    let scaleX = d3.scaleBand()
                   .domain(data.map(d => d.labelX))
                   .range([0, attr_area.width - 2 * attr_area.marginX]);

    // Сортировка шкалы X, если ключ — "Год"
    if(keyX === "Год"){
        scaleX = d3.scaleBand()
                   .domain(data.map(d => d.labelX).sort())
                   .range([0, attr_area.width - 2 * attr_area.marginX]);
    }
    
    // Шкала для оси Y
    let scaleY = d3.scaleLinear()
                   .domain([min * 0.85, max * 1.1 ])
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
    let check1 = d3.select("#check1").property("checked");
    let check2 = d3.select("#check2").property("checked");

    // Если оба чекбокса включены, рисуем оба столбца
    if(check1 && check2){
        createGist(svg, data, scaleX, scaleY, attr_area, "red", d => scaleY(d.values[1]), 1);
        createGist(svg, data, scaleX, scaleY, attr_area, "blue", d => scaleY(d.values[0]), 4);
    }
    else if(check1){
        createGist(svg, data, scaleX, scaleY, attr_area, "red", d => scaleY(d.values[1]), 1);
    }
    else if(check2){
        createGist(svg, data, scaleX, scaleY, attr_area, "blue", d => scaleY(d.values[0]), 1);
    }
}

// Функция создания точечной диаграммы
function createChartDot(svg, data, scaleX, scaleY, attr_area, color) {
    let check1 = d3.select("#check1").property("checked");
    let check2 = d3.select("#check2").property("checked");

    if(check1 && check2){
        createDot(svg, data, 4, scaleX,  attr_area, "red", d => scaleY(d.values[1]), 1);
        createDot(svg, data, 4, scaleX,  attr_area, "blue", d => scaleY(d.values[0]), -1);
    }
    else if(check1){
        createDot(svg, data, 4, scaleX,  attr_area, "red", d => scaleY(d.values[1]));
    }
    else if(check2){
        createDot(svg, data, 4, scaleX,  attr_area, "blue", d => scaleY(d.values[0]));
    }
}

function createDot(svg, data, r, scaleX, attr_area, color, value, shift = 0){
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

function createGist(svg, data, scaleX, scaleY, attr_area, color, value, shift){
    svg.selectAll(".dot")
       .data(data)
       .enter()
       .append("line")
       .attr("x1", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + shift)
       .attr("y1", value)
       .attr("x2", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + shift)
       .attr("y2", scaleY.range()[0])
       .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
       .attr("stroke", color)
       .attr("stroke-width", 20);
}
