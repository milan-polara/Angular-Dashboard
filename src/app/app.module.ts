import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import {
    CommonModule,
    HashLocationStrategy,
    LocationStrategy,
} from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { AppMainComponent } from "./app.main.component";

import { AppMenuComponent } from "./app.menu.component";
import { AppMenuitemComponent } from "./app.menuitem.component";
import { AppInlineMenuComponent } from "./app.inlinemenu.component";
import { AppBreadcrumbComponent } from "./app.breadcrumb.component";
import { AppTopBarComponent } from "./app.topbar.component";
import { AppFooterComponent } from "./app.footer.component";
import { HighChartsComponent } from "./demo/Components/dashboard/highCharts.component";
import { d3ChartsComponent } from "./demo/Components/d3-charts/d3Charts.component";
import { AppCrudComponent } from "./demo/Components/crud/app.crud.component";
import { AppNotfoundComponent } from "./demo/Components/notfound/app.notfound.component";
import { AppLoginComponent } from "./demo/Components/login/app.login.component";
import { AppWizardComponent } from "./demo/Components/register/app.wizard.component";
import { CountryService } from "./demo/service/countryservice";
import { SharedModule } from "./demo/shared/shared.module";
import { MenuService } from "./app.menu.service";
import { AppBreadcrumbService } from "./app.breadcrumb.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DynamicCrudComponent } from "./demo/Components/dynamicCrud/dynamicCrud.component";
import { ShowErrorsComponent } from "./demo/Components/dynamicCrud/dynamic form/show-errors/show-errors.component";
import { DynamicFormComponent } from "./demo/Components/dynamicCrud/dynamic form/dynamic-form/dynamic-form.component";
import { CrudService } from "./demo/service/crudservice.service";
import { OutputGraphComponent } from "./demo/Components/output-graph/output-graph.component";
import { HighchartsChartModule } from "highcharts-angular";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { employeReducer } from "./demo/state/employe.reducer";
import { EmployeEffect } from "./demo/state/employe.effects";
import { EffectsModule, Actions } from "@ngrx/effects";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "src/environments/environment";
import { AgePipe } from './age.pipe';


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    
        BrowserAnimationsModule,
        SharedModule,
        ReactiveFormsModule,
        HighchartsChartModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature("employe", employeReducer),
        EffectsModule.forFeature([EmployeEffect]),
        StoreDevtoolsModule.instrument(),
        ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: environment.production,
            registrationStrategy: "registerWhenStable:30000",
        }),
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppInlineMenuComponent,
        AppBreadcrumbComponent,
        AppTopBarComponent,
        AppFooterComponent,
        HighChartsComponent,
        d3ChartsComponent,
        AppCrudComponent,
        AppLoginComponent,
        AppNotfoundComponent,
        AppWizardComponent,
        DynamicCrudComponent,
        ShowErrorsComponent,
        DynamicFormComponent,
        OutputGraphComponent,
        AgePipe,
    ],
    providers: [
        CountryService,
        MenuService,
        AppBreadcrumbService,
        MessageService,
        CrudService,
        ConfirmationService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
