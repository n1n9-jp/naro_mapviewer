var drawLegendBar = function() {



    /* Bar */
    var _legendGradient = legendGroup.append("rect")
        .attr("y", legendYPos[1])
        .attr("width", columnWidth)
        .attr("height", legendHeight)
        // .style("fill", "#FF0000");
        .style("fill", `url(#${legendGradientId})`);



    /* Title */
    var legendTitlePre = "Selected value: ";
    var _legendTitle = legendGroup.selectAll(".legend-title")
    .data([0]);

    _legendTitle.exit()
        .transition()
        .duration(1000)
        .style("font-size", "0rem")
        .remove();

    _legendTitle.enter()
        .append("text")
        .attr("class", "legend-title")
        .attr("x", function(){
            return columnWidth / 2 - 20;
        })
        .attr("y", legendYPos[0])
        .attr("text-anchor", "middle")
        .style("font-size", "0.8rem")
        .style("font-weight", "bold")
        .style("fill", "#FFFFFF")
        .merge(_legendTitle)
        .transition()
        .duration(2000)
        .attr("x", function(){
            return columnWidth / 2 - 20;
        })
        .attr("y", legendYPos[0])
        .text(function(d) {
            return legendTitlePre + probLabelArray[probIndex];
        });



    /* Legend Min Value */
    let _legendValueMin = legendGroup.selectAll(".legendMinText")
        .data([dataScaleArray[scaleIndex].minData]);

    _legendValueMin.exit()
        .transition()
        .duration(1000)
        .style("font-size", "0rem")
        .remove();

    _legendValueMin.enter()
        .append("text")
        .attr("class", "legendMinText")
        .attr("x", 0)
        .attr("y", legendYPos[2])
        .attr("text-anchor", "start")
        .style("font-weight", "bold")
        .style("font-size", "0.8rem")
        .merge(_legendValueMin)
        .transition()
        .duration(2000)
        .attr("x", 0)
        .attr("y", legendYPos[2])
        .text(function(d) {
            return d;
        });



    /* Legend Max Value */
    let _legendValueMax = legendGroup.selectAll(".legendMaxText")
        .data([dataScaleArray[scaleIndex].maxData]);

    _legendValueMax.exit()
        .transition()
        .duration(1000)
        .style("font-size", "0rem")
        .remove();

    _legendValueMax.enter()
        .append("text")
        .attr("class", "legendMaxText")
        .attr("x", function(d){
            return columnWidth;
        })
        .attr("y", legendYPos[2])
        .attr("text-anchor", "end")
        .style("font-weight", "bold")
        .style("font-size", "0.8rem")
        .merge(_legendValueMax)
        .transition()
        .duration(2000)
        .attr("x", function(d){
            return columnWidth;
        })
        .attr("y", legendYPos[2])
        .text(function(d) {
            return d;
        });

}