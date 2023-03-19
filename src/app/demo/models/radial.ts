import * as d3 from "d3";

export interface config {
    id: string;
    rawData: any[];
}
export class RadialGauge {
    settings: any = {
        value: 0,
        upperLimit: 6000,
        lowerLimit: 0,
        valueUnit: "",
        precision: 0,
        data: [
            {
                min: 0,
                max: 1200,
                color: "#DEDEDE",
            },
            {
                min: 1200,
                max: 2400,
                color: "#8DCA2F",
            },
            {
                min: 2400,
                max: 3600,
                color: "#FDC702",
            },
            {
                min: 3600,
                max: 4800,
                color: "#FF7700",
            },
            {
                min: 4800,
                max: 6000,
                color: "#C50200",
            },
        ],
        innerRadius: 135,
        outerRadius: 150,
        width: 500,
        height: 500,
        radius: 500 / 2,
        thicknessInPercentage: 20,
        majorGraduationColor: "#B0B0B0",
        minorGraduationColor: "#D0D0D0",
        majorGraduationTextColor: "#6C6C6C",
        needleColor: "#416094",
        valueVerticalOffset: 30,
        strokeWidth: 2,
        strokeColor: "#000000",
        background: "#ffffff",
        border: true,
    };
    parent;
    initialized = false;
    renderTimeout;
    oldValue = 0;
    unactiveColor = "#D7D7D7";
    width;
    height;
    radius;
    timeout;
    innerRadius;
    outerRadius;
    majorGraduations;
    minorGraduations;
    majorGraduationLenght;
    minorGraduationLenght;
    majorGraduationMarginTop;
    majorGraduationColor;
    minorGraduationColor;
    majorGraduationTextColor;
    needleColor;
    valueVerticalOffset;
    majorGraduationTextSize;
    needleValueTextSize;
    maxLimit;
    minLimit;
    svg;
    svgCircleG;
    mapper = {
        scope_value: "value",
        scope_upperLimit: "upperLimit",
        scope_lowerLimit: "lowerLimit",
        scope_units: "valueUnit",
        scope_precision: "precision",
        scope_ranges: "data",
    };
    constructor(public config: config) {
        this.parent = document.getElementById(this.config.id);
        this.svg = d3.select("#" + this.config.id).append("svg");
        this.svgCircleG = this.svg.append("g");
        this.initVariable();
        this.render();
        this.getData();
        // d3.interval(this.getData, 5000);
    }

    getData() {
        d3.json(
            "http://ec2-52-55-236-86.compute-1.amazonaws.com/clean/getRadialPercentageValue/?format=json"
        ).then((results: any) => {
            if (results) {
                results.forEach((data) => {
                    Object.keys(data).forEach((value) => {
                        this.settings[this.mapper[value]] = data[value];
                    });
                });
                this.initVariable();
                this.render();
            }
        });
    }
    initVariable() {
        this.width = Math.min(
            this.parent.clientWidth,
            this.parent.clientHeight
        );
        // console.log(width, "width");
        this.innerRadius =
            Math.round(this.width / 2 - this.settings.strokeWidth * 2) -
            (Math.round(this.width / 2 - this.settings.strokeWidth * 2) *
                this.settings.thicknessInPercentage) /
                100;
        this.outerRadius = Math.round(
            this.width / 2 - this.settings.strokeWidth * 2
        );
        this.majorGraduations =
            parseInt(this.settings["majorGraduations"]) - 1 || 5;
        this.minorGraduations =
            parseInt(this.settings["minorGraduations"]) || 10;
        this.majorGraduationLenght = Math.round((this.width * 5.33) / 100);
        this.minorGraduationLenght = Math.round((this.width * 3.33) / 100);
        this.majorGraduationMarginTop = Math.round((this.width * 2.33) / 100);
        this.majorGraduationColor =
            this.settings.majorGraduationColor || "#B0B0B0";
        this.minorGraduationColor =
            this.settings.minorGraduationColor || "#D0D0D0";
        this.majorGraduationTextColor =
            this.settings.majorGraduationTextColor || "#6C6C6C";
        this.needleColor = this.settings.needleColor || "#416094";
        this.valueVerticalOffset =
            this.settings.valueVerticalOffset ||
            Math.round((this.width * 10) / 100);
        this.majorGraduationTextSize = parseInt(
            this.settings.majorGraduationTextSize
        );
        this.needleValueTextSize = parseInt(this.settings.needleValueTextSize);
        this.maxLimit = this.settings.upperLimit
            ? this.settings.upperLimit
            : 100;
        this.minLimit = this.settings.lowerLimit ? this.settings.lowerLimit : 0;

        this.render();
    }

    render() {
        var d3DataSource = [];
        this.svg.attr("width", this.width).attr("height", this.width);
        if (typeof this.settings.data === "undefined") {
            d3DataSource.push([
                this.minLimit,
                this.maxLimit,
                this.unactiveColor,
            ]);
        } else {
            //Data Generation
            this.settings.data.forEach(function (value, index) {
                d3DataSource.push([value.min, value.max, value.color]);
            });
        }

        //Render Gauge Color Area
        var translate =
            "translate(" + this.width / 2 + "," + this.width / 2 + ")";
        var cScale = d3
            .scaleLinear()
            .domain([this.minLimit, this.maxLimit])
            .range([-120 * (Math.PI / 180), 120 * (Math.PI / 180)]);
        var arc = d3
            .arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius)
            .startAngle((d) => {
                return cScale(d[0]);
            })
            .endAngle((d) => {
                return cScale(d[1]);
            });
        var pathSelection = this.svg
            .selectAll("path.pp-path")
            .data(d3DataSource);
        pathSelection
            .enter()
            .append("path")
            .merge(pathSelection)
            .attr("class", "pp-path")
            .attr("d", arc)
            .style("fill", (d) => {
                return d[2];
            })
            .attr("transform", translate);
        pathSelection.selectAll("path.pp-path").attr("d", arc);
        pathSelection.exit().remove();

        var borderPathSelection = this.svgCircleG
            .selectAll("circle.border-circle")
            .data(this.settings.border ? [0] : []);
        borderPathSelection
            .enter()
            .append("circle")
            .merge(borderPathSelection)
            .attr("class", "border-circle")
            .attr("cx", this.width / 2)
            .attr("cy", this.width / 2)
            .attr("r", (this.width - this.settings.strokeWidth) / 2)
            .attr("fill", this.settings.background)
            .attr("stroke", this.settings.strokeColor)
            .attr("stroke-width", this.settings.strokeWidth);
        borderPathSelection.exit().remove();

        var majorGraduationsAngles = this.getMajorGraduationAngles();
        var majorGraduationValues = this.getMajorGraduationValues(
            this.minLimit,
            this.maxLimit
        );
        this.renderMajorGraduations(majorGraduationsAngles);
        this.renderMajorGraduationTexts(
            majorGraduationsAngles,
            majorGraduationValues
        );
        this.renderGraduationNeedle(this.minLimit, this.maxLimit);
        this.initialized = true;
    }

    renderMajorGraduations(majorGraduationsAngles) {
        var centerX = this.width / 2;
        var centerY = this.width / 2;
        //Render Major Graduations
        var majorLineData = [];
        var minorLineData = [];
        majorGraduationsAngles.forEach((value, index) => {
            var cos1Adj = Math.round(
                Math.cos(((90 - value) * Math.PI) / 180) *
                    (this.innerRadius -
                        this.majorGraduationMarginTop -
                        this.majorGraduationLenght)
            );
            var sin1Adj = Math.round(
                Math.sin(((90 - value) * Math.PI) / 180) *
                    (this.innerRadius -
                        this.majorGraduationMarginTop -
                        this.majorGraduationLenght)
            );
            var cos2Adj = Math.round(
                Math.cos(((90 - value) * Math.PI) / 180) *
                    (this.innerRadius - this.majorGraduationMarginTop)
            );
            var sin2Adj = Math.round(
                Math.sin(((90 - value) * Math.PI) / 180) *
                    (this.innerRadius - this.majorGraduationMarginTop)
            );
            var x1 = centerX + cos1Adj;
            var y1 = centerY + sin1Adj * -1;
            var x2 = centerX + cos2Adj;
            var y2 = centerY + sin2Adj * -1;
            majorLineData.push({
                x1,
                y1,
                x2,
                y2,
                color: this.majorGraduationColor,
            });
            this.renderMinorGraduations(
                majorGraduationsAngles,
                index,
                minorLineData
            );
        });
        const majorLinesSelection = this.svg
            .selectAll("line.major-line")
            .data(majorLineData, (d, i) => i);
        const newLinesSelection = majorLinesSelection.enter().append("line");
        newLinesSelection
            .merge(majorLinesSelection)
            .attr("class", "major-line")
            .attr("x1", (d) => d.x1)
            .attr("y1", (d) => d.y1)
            .attr("x2", (d) => d.x2)
            .attr("y2", (d) => d.y2)
            .style("stroke", (d) => d.color);
        majorLinesSelection.exit().remove();

        const minorLinesSelection = this.svg
            .selectAll("line.minor-line")
            .data(minorLineData, (d, i) => i);
        const minorNewLinesSelection = minorLinesSelection
            .enter()
            .append("line");
        minorNewLinesSelection
            .merge(minorLinesSelection)
            .attr("class", "minor-line")
            .attr("x1", (d) => d.x1)
            .attr("y1", (d) => d.y1)
            .attr("x2", (d) => d.x2)
            .attr("y2", (d) => d.y2)
            .style("stroke", (d) => d.color);
        minorLinesSelection.exit().remove();
    }

    renderMinorGraduations(majorGraduationsAngles, indexMajor, minorLineData) {
        var minorGraduationsAngles = [];

        if (indexMajor > 0) {
            var minScale = majorGraduationsAngles[indexMajor - 1];
            var maxScale = majorGraduationsAngles[indexMajor];
            var scaleRange = maxScale - minScale;

            for (var i = 1; i < this.minorGraduations; i++) {
                var scaleValue =
                    minScale + (i * scaleRange) / this.minorGraduations;
                minorGraduationsAngles.push(scaleValue);
            }

            var centerX = this.width / 2;
            var centerY = this.width / 2;
            //Render Minor Graduations
            minorGraduationsAngles.forEach((value, indexMinor) => {
                var cos1Adj = Math.round(
                    Math.cos(((90 - value) * Math.PI) / 180) *
                        (this.innerRadius -
                            this.majorGraduationMarginTop -
                            this.minorGraduationLenght)
                );
                var sin1Adj = Math.round(
                    Math.sin(((90 - value) * Math.PI) / 180) *
                        (this.innerRadius -
                            this.majorGraduationMarginTop -
                            this.minorGraduationLenght)
                );
                var cos2Adj = Math.round(
                    Math.cos(((90 - value) * Math.PI) / 180) *
                        (this.innerRadius - this.majorGraduationMarginTop)
                );
                var sin2Adj = Math.round(
                    Math.sin(((90 - value) * Math.PI) / 180) *
                        (this.innerRadius - this.majorGraduationMarginTop)
                );
                var x1 = centerX + cos1Adj;
                var y1 = centerY + sin1Adj * -1;
                var x2 = centerX + cos2Adj;
                var y2 = centerY + sin2Adj * -1;
                minorLineData.push({
                    x1,
                    y1,
                    x2,
                    y2,
                    color: this.minorGraduationColor,
                });
            });
        }
    }

    getMajorGraduationValues(minLimit, maxLimit) {
        var scaleRange = maxLimit - minLimit;
        var majorGraduationValues = [];
        for (var i = 0; i <= this.majorGraduations; i++) {
            var scaleValue =
                minLimit + (i * scaleRange) / this.majorGraduations;
            majorGraduationValues.push(
                scaleValue.toFixed(this.settings.precision)
            );
        }

        return majorGraduationValues;
    }

    getMajorGraduationAngles() {
        var scaleRange = 240;
        var minScale = -120;
        var graduationsAngles = [];
        for (var i = 0; i <= this.majorGraduations; i++) {
            var scaleValue =
                minScale + (i * scaleRange) / this.majorGraduations;
            graduationsAngles.push(scaleValue);
        }

        return graduationsAngles;
    }

    renderMajorGraduationTexts(majorGraduationsAngles, majorGraduationValues) {
        if (!this.settings.data) return;
        var centerX = this.width / 2;
        var centerY = this.width / 2;
        var textVerticalPadding = 5;
        var textHorizontalPadding = 5;

        var lastGraduationValue =
            majorGraduationValues[majorGraduationValues.length - 1];
        var textSize = isNaN(this.majorGraduationTextSize)
            ? (this.width * 12) / 300
            : this.majorGraduationTextSize;
        var fontStyle = textSize + "px Courier";

        var dummyTextSelection = this.svg
            .selectAll("text.dummyText")
            .data([lastGraduationValue + this.settings.valueUnit], (d, i) => i);

        var newDummyText = dummyTextSelection.enter().append("text");
        newDummyText
            .merge(dummyTextSelection)
            .attr("class", "dummyText")
            .attr("id", "dummyText")
            .attr("x", centerX)
            .attr("y", centerY)
            .attr("fill", "transparent")
            .attr("text-anchor", "middle")
            .style("font", fontStyle)
            .text((d) => d);
        dummyTextSelection.exit().remove();

        var textWidth = this.svg.select("#dummyText").node().getBBox().width;
        var arr = [];
        for (var i = 0; i < majorGraduationsAngles.length; i++) {
            var angle = majorGraduationsAngles[i];
            var cos1Adj = Math.round(
                Math.cos(((90 - angle) * Math.PI) / 180) *
                    (this.innerRadius -
                        this.majorGraduationMarginTop -
                        this.majorGraduationLenght -
                        textHorizontalPadding)
            );
            var sin1Adj = Math.round(
                Math.sin(((90 - angle) * Math.PI) / 180) *
                    (this.innerRadius -
                        this.majorGraduationMarginTop -
                        this.majorGraduationLenght -
                        textVerticalPadding)
            );

            var sin1Factor = 1;
            if (sin1Adj < 0) sin1Factor = 1.1;
            if (sin1Adj > 0) sin1Factor = 0.9;
            if (cos1Adj > 0) {
                if (angle > 0 && angle < 45) {
                    cos1Adj -= textWidth / 2;
                } else {
                    cos1Adj -= textWidth;
                }
            }
            if (cos1Adj < 0) {
                if (angle < 0 && angle > -45) {
                    cos1Adj -= textWidth / 2;
                }
            }
            if (cos1Adj == 0) {
                cos1Adj -= angle == 0 ? textWidth / 4 : textWidth / 2;
            }

            arr.push({
                x1: centerX + cos1Adj,
                y1: centerY + sin1Adj * sin1Factor * -1,
                text: majorGraduationValues[i] + this.settings.valueUnit,
                fill: this.majorGraduationTextColor,
            });
        }
        const textSelection = this.svg
            .selectAll("text.mtt-majorGraduationText")
            .data(arr, (d, i) => i);

        const newTextSelection = textSelection.enter().append("text");
        newTextSelection
            .merge(textSelection)
            .attr("class", "mtt-majorGraduationText")
            .style("font", fontStyle)
            .attr("text-align", "center")
            .attr("x", (d) => d.x1)
            .attr("dy", (d) => d.y1)
            .attr("fill", (d) => d.fill)
            .text((d) => d.text);

        textSelection.exit().remove();
    }

    renderGraduationNeedle(minLimit, maxLimit) {
        /*svg.selectAll('.mtt-graduation-needle').remove();
          svg.selectAll('.mtt-graduationValueText').remove();
          svg.selectAll('.mtt-graduation-needle-center').remove();*/
        var circleData = {};
        var centerX = this.width / 2;
        var centerY = this.width / 2;
        var centerColor;

        if (typeof this.settings.value === "undefined") {
            centerColor = this.unactiveColor;
        } else {
            centerColor = this.needleColor;
            var textSize = isNaN(this.needleValueTextSize)
                ? (this.width * 12) / 300
                : this.needleValueTextSize;
            var fontStyle = textSize + "px Courier";
            var pathObj = {
                value: this.settings.value,
                centerX,
                centerY,
            };

            if (
                this.settings.value >= minLimit &&
                this.settings.value <= maxLimit
            ) {
                var pathSelection = this.svg
                    .selectAll("path.mtt-graduation-needle")
                    .data([pathObj], (d, i) => i);
                pathSelection
                    .enter()
                    .append("path")
                    .merge(pathSelection)
                    .attr("class", "mtt-graduation-needle")
                    .style("stroke-width", 1)
                    .style("stroke", this.needleColor)
                    .style("fill", this.needleColor)
                    .transition()
                    .duration(1000)
                    .attrTween("d", this.lineTween(pathObj));
                pathSelection.exit().remove();
            }
            var grdTextData = {
                centerX: centerX,
                centerY: centerY + this.valueVerticalOffset,
                text:
                    this.settings.value.toFixed(this.settings.precision) +
                    this.settings.valueUnit,
                fontStyle,
                needleColor: this.needleColor,
            };
            var textSelection = this.svg
                .selectAll("text.mtt-graduationValueText")
                .data([grdTextData], (d, i) => i);
            textSelection
                .enter()
                .append("text")
                .merge(textSelection)
                .attr("x", (d) => d.centerX)
                .attr("y", (d) => d.centerY)
                .attr("class", "mtt-graduationValueText")
                .attr("fill", (d) => d.needleColor)
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .style("font", (d) => d.fontStyle)
                .text((d) => d.text);
            textSelection.exit().remove();
        }

        var circleRadius = (this.width * 6) / 300;
        circleData = { circleRadius, centerX, centerY, centerColor };
        var circleSelection = this.svg
            .selectAll("circle.mtt-graduation-needle-center")
            .data([circleData], (d, i) => i);
        circleSelection
            .enter()
            .append("circle")
            .merge(circleSelection)
            .attr("r", circleRadius)
            .attr("cy", centerX)
            .attr("cx", centerY)
            .attr("fill", centerColor)
            .attr("class", "mtt-graduation-needle-center");
        circleSelection.exit().remove();
    }

    lineTween({ value, centerX, centerY }) {
        console.log({ value, centerX, centerY }, "{ value, centerX, centerY }");

        return function (d) {
            var interpolate = d3.interpolate(this.oldValue, value);
            this.oldValue = value;
            return function (t) {
                var needleValue =
                    ((interpolate(t) - this.minLimit) * 240) /
                        (this.maxLimit - this.minLimit) -
                    30;
                var thetaRad = (needleValue * Math.PI) / 180;

                var needleLen =
                    this.innerRadius -
                    this.majorGraduationLenght -
                    this.majorGraduationMarginTop;
                var needleRadius = (this.width * 2.5) / 300;
                var topX = centerX - needleLen * Math.cos(thetaRad);
                var topY = centerY - needleLen * Math.sin(thetaRad);
                var leftX =
                    centerX - needleRadius * Math.cos(thetaRad - Math.PI / 2);
                var leftY =
                    centerY - needleRadius * Math.sin(thetaRad - Math.PI / 2);
                var rightX =
                    centerX - needleRadius * Math.cos(thetaRad + Math.PI / 2);
                var rightY =
                    centerY - needleRadius * Math.sin(thetaRad + Math.PI / 2);

                return (
                    d3.line()([
                        [topX, topY],
                        [leftX, leftY],
                        [rightX, rightY],
                    ]) + "Z"
                );
            };
        };
    }

    resizeChart() {}
}
