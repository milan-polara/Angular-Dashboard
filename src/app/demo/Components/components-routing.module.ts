import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppMainComponent } from "src/app/app.main.component";
import { AuthGuard } from "../guard/auth.guard";
import { UnAuthGuard } from "../guard/un-auth.guard";
import { AppCrudComponent } from "./crud/app.crud.component";
import { d3ChartsComponent } from "./d3-charts/d3Charts.component";
import { HighChartsComponent } from "./dashboard/highCharts.component";
import { DynamicCrudComponent } from "./dynamicCrud/dynamicCrud.component";
import { AppLoginComponent } from "./login/app.login.component";
import { AppNotfoundComponent } from "./notfound/app.notfound.component";
import { AppWizardComponent } from "./register/app.wizard.component";

@NgModule({
    imports: [
        RouterModule.forChild(
            [
                {
                    path: "",
                    redirectTo: "login",
                    pathMatch: "full",
                },
                {
                    path: "login",
                    canActivate: [UnAuthGuard],
                    component: AppLoginComponent,
                },

                { path: "signUp", component: AppWizardComponent },
                {
                    path: "dashboard",
                    canActivate: [AuthGuard],
                    component: AppMainComponent,
                    children: [
                        {
                            path: "",
                            redirectTo: "highcharts",
                            pathMatch: "full",
                        },
                        {
                            path: "highcharts",
                            component: HighChartsComponent,
                        },
                        {
                            path: "d3charts",
                            component: d3ChartsComponent,
                        },
                        { path: "crud", component: AppCrudComponent },
                        {
                            path: "jsoncrud",
                            component: DynamicCrudComponent,
                        },
                    ],
                },
                {
                    path: "**",
                    pathMatch: "full",
                    component: AppNotfoundComponent,
                },
            ]
            // { useHash: true }
        ),
    ],
    exports: [RouterModule],
})
export class ComponentsRoutingModule {}
