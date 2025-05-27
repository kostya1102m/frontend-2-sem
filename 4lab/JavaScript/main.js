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


    d3.select("#cleanDraw").on("click", function () {
        d3.select("svg").selectAll("*").remove();
    })

    function clearError() {
        d3.select("#error-message").text("").style("color", "");
        d3.selectAll("#check1, #check2").each(function () {
            d3.select(this.parentNode).style("color", "");
        });
    }

    d3.select("#draw").on("click", function () {
        const check1 = d3.select("#check1").property("checked");
        const check2 = d3.select("#check2").property("checked");

        if (!check1 && !check2) {
            d3.select("#error-message")
                .text("Выберите хотя бы один чекбокс")
                .style("color", "red");
            d3.selectAll("#check1, #check2")
                .each(function () {
                    d3.select(this.parentNode).style("color", "red");
                })
        } else {
            clearError();
            drawGraph(buildings);
        }
    });

    d3.selectAll("#check1, #check2").on("change", function () {
        if (d3.select("#check1").property("checked") || d3.select("#check2").property("checked")) {
            clearError();
        }
    });
});
