import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { HomepageComponent } from "./demo/homepage/homepage.component";
import { environment } from "src/environments/environment";

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: "",
                    redirectTo: environment.isElectron
                        ? "components"
                        : "homepage",
                    pathMatch: "full",
                },
                { path: "homepage", component: HomepageComponent },
                {
                    path: "components",
                    loadChildren: () =>
                        import(
                            "./demo/Components/components-routing.module"
                        ).then((m) => m.ComponentsRoutingModule),
                },
            ],
            { useHash: true }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
