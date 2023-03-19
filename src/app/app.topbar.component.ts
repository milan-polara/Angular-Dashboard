import {
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import {
    trigger,
    style,
    transition,
    animate,
    AnimationEvent,
} from "@angular/animations";
import { MegaMenuItem } from "primeng/api";
import { AppComponent } from "./app.component";
import { AppMainComponent } from "./app.main.component";
import { TranslateService } from "@ngx-translate/core";
@Component({
    selector: "app-topbar",
    templateUrl: "./app.topbar.component.html",
    styles: [".p-dropdown{ background-color: #add8e6; } "],
    // encapsulation: ViewEncapsulation.None,
    animations: [
        trigger("topbarActionPanelAnimation", [
            transition(":enter", [
                style({ opacity: 0, transform: "scaleY(0.8)" }),
                animate(
                    ".12s cubic-bezier(0, 0, 0.2, 1)",
                    style({ opacity: 1, transform: "*" })
                ),
            ]),
            transition(":leave", [
                animate(".1s linear", style({ opacity: 0 })),
            ]),
        ]),
    ],
})
export class AppTopBarComponent {
    labelData: any = {};
    language: { name: string; value: string }[];
    lang: string;
    selectedLanguage;
    isInputBackgroundChanged = false;
    constructor(
        public appMain: AppMainComponent,
        public app: AppComponent,
        public translate: TranslateService
    ) {
        this.language = [
            { name: "english", value: "english" },
            { name: "arabic", value: "arabic" },
            { name: "french", value: "french" },
            { name: "japanese", value: "japanese" },
            { name: "spanish", value: "spanish" },
        ];

        // translate.addLangs([
        //     "english",
        //     "عربى",
        //     "française",
        //     "日本",
        //     "española",
        // ]);
        // this.setmenu();
        // translate.setDefaultLang("english");

        const browserLang = translate.getBrowserLang();
        translate.use(
            browserLang.match(/arabic|arabic/) ? "arabic" : "english"
        );
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
                // "HOME.DESKTOPAPP",
            ])
            .subscribe((translations) => {
                this.labelData = translations;
                this.setmenu();
            });
    }
    changeLang() {
        this.translate.use(this.selectedLanguage.name);
        // console.log(
        //     this.selectedLanguage,
        //     "original",
        //     this.translate.currentLang
        // );

        // console.log(lang.target.innerText, "lang");
        // lang.name === this.translate.currentLang;

        // console.log(lang, "57");
    }

    activeItem: number;
    model: MegaMenuItem[];
    setmenu() {
        this.model = [
            {
                label: this.labelData["HOME.TITLE"],
                items: [
                    [
                        {
                            label: this.labelData["HOME.TITLE"],
                            items: [
                                {
                                    label: this.labelData["HOME.HIGHCHART"],
                                    icon: "pi pi-fw pi-chart-line",
                                    routerLink: ["/components/dashboard"],
                                },
                                {
                                    label: this.labelData["HOME.D3CHART"],
                                    icon: "pi pi-fw pi-chart-bar",
                                    routerLink: [
                                        "/components/dashboard/d3charts",
                                    ],
                                },
                                {
                                    label: this.labelData["HOME.CRUD"],
                                    icon: "pi pi-fw pi-users",
                                    routerLink: ["/components/dashboard/crud"],
                                },
                                // {
                                //     label: this.labelData["HOME.CRUDWITHJSON"],
                                //     icon: "pi pi-fw pi-shopping-bag",
                                //     routerLink: [
                                //         "/components/dashboard/jsoncrud",
                                //     ],
                                // },
                            ],
                        },
                    ],
                ],
            },
        ];
    }

    @ViewChild("searchInput") searchInputViewChild: ElementRef;

    onSearchAnimationEnd(event: AnimationEvent) {
        switch (event.toState) {
            case "visible":
                this.searchInputViewChild.nativeElement.focus();
                break;
        }
    }

    // onLayoutModeChange(event, mode) {
    //     console.log(event, "event");

    //     const appLogoLink: HTMLImageElement = document.getElementById(
    //         "app-logo"
    //     ) as HTMLImageElement;
    //     this.app.layoutMode = mode;

    //     if (!this.isInputBackgroundChanged) {
    //         this.app.inputStyle = mode === "dark" ? "filled" : "outlined";
    //     }

    //     if (mode === "dark") {
    //         this.app.menuTheme = "dark";
    //         this.app.topbarTheme = "dark";
    //         this.app.footer = "dark";
    //         appLogoLink.src = "assets/images/llion-logo-white.png";
    //     } else {
    //         this.app.menuTheme = "light";
    //         this.app.topbarTheme = "blue";
    //         // appLogoLink.src = "assets/layout/images/logo-light.svg";
    //     }

    //     const layoutLink: HTMLLinkElement = document.getElementById(
    //         "layout-css"
    //     ) as HTMLLinkElement;
    //     const layoutHref =
    //         "assets/layout/css/layout-" + this.app.layoutMode + ".css";
    //     // this.replaceLink(layoutLink, layoutHref);

    //     const themeLink = document.getElementById("theme-css");
    //     // const urlTokens = themeLink.getAttribute("href").split("/");
    //     // urlTokens[urlTokens.length - 1] =
    //     //     "theme-" + this.app.layoutMode + ".css";
    //     // const newURL = urlTokens.join("/");

    //     // this.replaceLink(themeLink, newURL, this.appMain["refreshChart"]);
    // }
}
