document.addEventListener("DOMContentLoaded", function () {
    showTable('build', buildings);

    // Кнопка для скрытия/показа таблицы
    let button = d3.select("#start");
    let clicked = false;
    button.on("click", function () {
        if (clicked) {
            d3.select("#build").style("visibility", "visible");
            button.text("Скрыть таблицу");
        }
        if (!clicked) {
            d3.select("#build").style("visibility", "collapse");
            button.text("Показать таблицу");
        }
        clicked = !clicked;
    });


    d3.select("#cleanDraw").on("click", function() {
        d3.select("svg").selectAll("*").remove(); 
    })

    // Кнопка для построения графика
    let button2 = d3.select("#draw");
    button2.on("click", function () {
        let check1 = d3.select("#check1").node().checked;
        let check2 = d3.select("#check2").node().checked;

        if (!check1 && !check2) {
            // Ни один чекбокс не выбран
            d3.select("#error-message")
                .text("Выберите хотя бы один график для отображения!")
                .style("color", "red");
            d3.select("#check1").node().parentElement.style.color = "red";
            d3.select("#check2").node().parentElement.style.color = "red";
        } else {
            // Хотя бы один чекбокс выбран
            d3.select("#error-message").text(""); // Убираем сообщение об ошибке
            d3.select("#check1").node().parentElement.style.color = ""; // Убираем красный цвет
            d3.select("#check2").node().parentElement.style.color = ""; // Убираем красный цвет
            drawGraph(buildings); // Строим график
        }
    });

    // обработчики событий для автоматического снятия ошибок
    d3.select("#check1").on("change", function () {
        if (d3.select("#check1").node().checked || d3.select("#check2").node().checked) {
            d3.select("#error-message").text("");
            d3.select("#check1").node().parentElement.style.color = "";
            d3.select("#check2").node().parentElement.style.color = "";
        }
    });

    d3.select("#check2").on("change", function () {
        if (d3.select("#check1").node().checked || d3.select("#check2").node().checked) {
            d3.select("#error-message").text("");
            d3.select("#check1").node().parentElement.style.color = "";
            d3.select("#check2").node().parentElement.style.color = "";
        }
    });
});
