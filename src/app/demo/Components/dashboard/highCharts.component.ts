import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SelectItem } from "primeng/api";
import { AppBreadcrumbService } from "../../../app.breadcrumb.service";
import { AppMainComponent } from "src/app/app.main.component";
import { AppComponent } from "src/app/app.component";
import { TranslateService } from "@ngx-translate/core";
@Component({
    templateUrl: "./highCharts.component.html",
})
export class HighChartsComponent implements OnInit {
    @ViewChild("chatcontainer") chatContainerViewChild: ElementRef;
    labelData: any = {};
    shortCardChart = [
        {
            type: "pie",
            data: {
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
                        hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
                    },
                ],
            },
            width: "13vw",
            height: "100px",
            options: {
                responsive: true,
            },
            text: "Report",
        },
        {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
                        hoverBackgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
                    },
                ],
            },
            width: "13vw",
            height: "100px",
            options: {
                responsive: true,
            },
            text: "Report",
        },
        {
            type: "line",
            data: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                ],
                datasets: [
                    {
                        data: [50, 64, 32, 24, 18, 27, 20, 36, 30],
                        borderColor: ["#4DD0E1"],
                        backgroundColor: ["rgba(77, 208, 225, 0.8)"],
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        display: false,
                    },
                    x: {
                        display: false,
                    },
                },
                tooltips: {
                    enabled: false,
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
            },
            text: "Report",
            width: "13vw",
            height: "80px",
        },
        {
            type: "line",
            data: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                ],
                datasets: [
                    {
                        data: [11, 30, 52, 35, 39, 20, 14, 18, 29],
                        borderColor: ["#F4364C"],
                        // backgroundColor: ["rgba(77, 208, 225, 0.8)"],
                        borderWidth: 2,
                        // fill: true,
                        stepped: true,
                        tension: 0.4,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        display: false,
                    },
                    x: {
                        display: false,
                    },
                },
                tooltips: {
                    enabled: false,
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
            },
            text: "Report",
            width: "13vw",
            height: "80px",
        },
    ];
    constructor(
        public app: AppComponent,
        public appMain: AppMainComponent,
        private breadcrumbService: AppBreadcrumbService,
        public translate: TranslateService
    ) {
        this.breadcrumbService.setItems([
            { label: this.labelData["HOME.TITLE"], routerLink: ["/"] },
        ]);
        translate.onLangChange.subscribe((event: any) => {
            this.setmenutranslate();
        });
        this.setmenutranslate();
    }
    setmenutranslate() {
        this.translate.get(["HOME.TITLE"]).subscribe((translations) => {
            this.labelData = translations;
            this.breadcrumbService.setItems([
                { label: this.labelData["HOME.TITLE"] },
            ]);
        });
    }
    changeLang(lang: string) {
        lang === this.translate.currentLang;
    }

    ngOnInit() {}
}
