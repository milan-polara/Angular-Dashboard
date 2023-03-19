import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-homepage",
    templateUrl: "./homepage.component.html",
    styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit {
    isBottom: boolean;
    constructor(private router: Router) {}

    ngOnInit(): void {}
    downloadFile(type) {
        let downloadlink;
        if (type === "win") {
            downloadlink =
                "https://drive.google.com/u/0/uc?id=1Eg2aywZAUjf4TLZkJaY-LO3-NTxTuPua&export=download";
        } else if (type === "linux") {
            downloadlink =
                "https://drive.google.com/u/0/uc?id=1jHvZ8EOWCpkilZQBdpwak0NKDbU6DeJT&export=download";
        } else {
            downloadlink =
                "https://drive.google.com/u/0/uc?id=1JeCT_JRiQLptmV_o8tuU4h5Eu0wXXXhA&export=download";
        }
        let link = document.createElement("a");
        link.setAttribute("target", "_blank");
        link.setAttribute("href", downloadlink);
        link.setAttribute("download", `dashboard.exe`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    onClick() {
        this.router.navigate(["components/login"]);
    }
    scrollDown() {
        window.scroll({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }
}
