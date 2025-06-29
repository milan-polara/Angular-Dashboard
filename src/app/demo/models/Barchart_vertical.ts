import * as d3 from "d3";

export interface config {
    id: string;
    rawData: any[];
}
export class barChartVertical {
    id;
    rawData;
    width;
    Data;
    height;
    margin = { top: 10, right: 10, bottom: 50, left: 50 };
    svg;
    color = d3
        .scaleOrdinal()
        .range([
            "#4DE17C",
            "#4DE18F",
            "#4DE1A3",
            "#4DE1B7",
            "#4DE1CB",
            "#4DE1DE",
            "#4DD0E1",
            "#4DA9E1",
            "#4D95E1",
            "#4D81E1",
            "#4D6DE1",
        ]);
    xAxisEle: any;
    yAXisEle: any;
    mainEle: any;
    tooltipEle: any;
    x: any = d3.scaleBand();
    y: any = d3.scaleLinear();
    chartData: any;

    constructor(public config: config) {
        this.id = this.config.id;
        this.rawData = this.config.rawData;
        this.loadData();
    }

    loadData() {
        this.chartData = [];
        if (this.rawData) {
            this.rawData.forEach((element, index) => {
                let obj = {
                    name: element.name,
                    value: element.salary,
                };
                this.chartData.push(obj);
            });
        }
        this.createEle();
        this.drawChart();
    }

    createEle() {
        this.width = d3.select("#" + this.id).node()["clientWidth"];
        this.height = d3.select("#" + this.id).node()["clientHeight"];
        d3.select("#" + this.id)
            .selectAll("svg")
            .remove();
        this.svg = d3
            .select("#" + this.id)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            );
        this.xAxisEle = this.svg
            .append("g")
            .attr("class", "axis axisX")
            .attr(
                "transform",
                "translate(0," +
                    (this.height - (this.margin.top + this.margin.bottom)) +
                    ")"
            );

        this.yAXisEle = this.svg
            .append("g")
            .attr("class", "axis axisY")
            .attr("transform", "translate(0,0)");

        this.mainEle = this.svg.append("g").attr("class", "mainEle");
        this.tooltipEle = d3
            .select("#" + this.id)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .attr("id", "tooltip")
            .style("text-align", "center")
            .style("position", "absolute")
            .style("font", "12px sans-serif")
            .style("pointer-events", "none")
            .style("background-color", "rgba(0,0,0,0.6)")
            .style("color", "#FFF")
            .style("border-radius", "5px")
            .style("padding", "5px");

        this.drawAxis();
    }

    drawAxis() {
        const newWidth = this.width - (this.margin.left + this.margin.right);
        const newHeight = this.height - (this.margin.top + this.margin.bottom);
        const minValue = d3.min(this.chartData, (e) => e["value"]);
        const maxvalue = d3.max(this.chartData, (e) => e["value"]);

        this.x
            .range([0, newWidth])
            .domain(this.chartData.map((d) => d.name))
            .padding(0.4);
        this.y.range([newHeight, 0]).domain([0, maxvalue]);

        this.xAxisEle.call(d3.axisBottom(this.x));
        this.yAXisEle.call(d3.axisLeft(this.y).tickSizeOuter(0).ticks(10));
    }

    drawChart() {
        this.Data = d3.group(this.chartData, (d) => d["name"]);
        const selectParent = this.mainEle
            .selectAll("g.parentG")
            .data(this.Data.keys());
        const enterParent = selectParent.enter().append("g");
        enterParent.merge(selectParent).attr("class", (e) => "parentG " + e);
        selectParent.exit().remove();
        this.drawRect(enterParent);
    }
    drawRect(enterRectG) {
        const selectChild = enterRectG.selectAll("g.BarRect").data((e) => {
            return this.Data.get(e);
        });
        selectChild
            .enter()
            .append("rect")
            .merge(selectChild)
            .attr("x", (d) => this.x(d.name))
            .attr("y", (d) => this.y(d.value))
            .attr("class", "BarRect")
            .attr(
                "height",
                (d) =>
                    this.height -
                    (this.margin.top + this.margin.bottom) -
                    this.y(d.value)
            )
            .attr("width", this.x.bandwidth())
            .style("fill", (d) => this.color(d))
            .on("mouseover", (event, d) => {
                this.mousOver(event, d);
            })
            .on("mouseout", (d) => {
                this.mouseout();
            });
        selectChild.exit().remove();
    }

    mousOver(event, d) {
        this.tooltipEle
            .style("opacity", 1)
            .html(d.name + ": " + d.value)
            .style("left", event.clientX + "px")
            .style("top", event.clientY - 28 + "px");
    }

    mouseout() {
        this.tooltipEle.style("opacity", 0);
    }

    resizeChart() {
        this.width = d3.select("#" + this.id).node()["clientWidth"];
        this.height = d3.select("#" + this.id).node()["clientHeight"];
        d3.select("#" + this.id)
            .select("svg")
            .attr("width", this.width)
            .attr("height", this.height);
        this.svg.attr(
            "transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")"
        );
        const newWidth = this.width - (this.margin.left + this.margin.right);
        const newHeight = this.height - (this.margin.top + this.margin.bottom);
        this.xAxisEle.attr("transform", "translate(0," + newHeight + ")");
        this.x.range([0, newWidth]);
        this.y.range([newHeight, 0]);
        this.xAxisEle.call(d3.axisBottom(this.x));
        this.xAxisEle
            .selectAll(".tick")
            .select("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-50)");
        this.yAXisEle.call(
            d3
                .axisLeft(this.y)
                .tickSizeOuter(0)
                .ticks(d3.min([this.width / 60, 12]))
        );
        this.mainEle
            .selectAll("g.parentG")
            .selectAll("rect.BarRect")
            .attr("x", (d) => this.x(d.name))
            .attr("y", (d) => this.y(d.value))
            .attr(
                "height",
                (d) =>
                    this.height -
                    (this.margin.top + this.margin.bottom) -
                    this.y(d.value)
            )
            .attr("width", this.x.bandwidth());
    }
}
