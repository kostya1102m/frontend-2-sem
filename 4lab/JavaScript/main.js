document.addEventListener("DOMContentLoaded", function () {
    showTable('build', buildings);

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
        d3.select("#error-message").text("");
        d3.select("#l1check").style("color", "");
        d3.select("#l2check").style("color", "");
    }

    d3.select("#draw").on("click", function () {
        const check1 = d3.select("#check1").property("checked");
        const check2 = d3.select("#check2").property("checked");

        if (!check1 && !check2) {
            d3.select("#error-message")
                .text("Выберите хотя бы один чекбокс")
                .style("color", "red");
            d3.select("#l1check").style("color", check1 ? "" : "red");
            d3.select("#l2check").style("color", check2 ? "" : "red");
            d3.select("svg").selectAll("*").remove();

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
