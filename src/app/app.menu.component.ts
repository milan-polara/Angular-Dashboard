import { Component, OnInit } from "@angular/core";
import { AppComponent } from "./app.component";
import { TranslateService } from "@ngx-translate/core";
@Component({
    selector: "app-menu",
    template: `
        <ul class="layout-menu">
            <li
                app-menuitem
                *ngFor="let item of model; let i = index"
                [item]="item"
                [index]="i"
                [root]="true"
            ></li>
        </ul>
    `,
})
export class AppMenuComponent implements OnInit {
    model: any[];
    labelData: any = {};

    constructor(public app: AppComponent, public translate: TranslateService) {
        this.ngOnInit();
        translate.onLangChange.subscribe((event: any) => {
            this.setmenutranslate();
        });
        // this.setmenutranslate();
    }
    setmenutranslate() {
        this.translate
            .get([
                "HOME.TITLE",
                "HOME.HIGHCHART",
                "HOME.D3CHART",
                "HOME.CRUD",
                "HOME.CRUDWITHJSON",
                "HOME.FAVOURITES",
            ])
            .subscribe((translations) => {
                this.labelData = translations;
                this.ngOnInit();
            });
    }
    changeLang(lang: string) {
        lang === this.translate.currentLang;
    }
    ngOnInit() {
        this.model = [
            {
                label: this.labelData["HOME.FAVOURITES"],
                icon: "pi pi-fw pi-home",
                items: [
                    {
                        label: this.labelData["HOME.HIGHCHART"],
                        icon: "pi pi-fw pi-chart-line",
                        routerLink: ["/components/dashboard"],
                    },
                    {
                        label: this.labelData["HOME.D3CHART"],
                        icon: "pi pi-fw pi-chart-bar",
                        routerLink: ["/components/dashboard/d3charts"],
                    },
                    {
                        label: this.labelData["HOME.CRUD"],
                        icon: "pi pi-fw pi-users",
                        routerLink: ["/components/dashboard/crud"],
                    },
                    // {
                    //     label: this.labelData["HOME.CRUDWITHJSON"],
                    //     icon: "pi pi-fw pi-shopping-bag",
                    //     routerLink: ["/components/dashboard/jsoncrud"],
                    // },
                ],
            },
        ];
    }
}
