import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import { Store, select } from "@ngrx/store";
import * as fromEmploye from "../../state/employe.reducer";
import * as employeAction from "../../state/employe.action";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
@Component({
    selector: "app-dashboard",
    templateUrl: "dynamicCrud.component.html",
    styles: [
        `
            :host ::ng-deep .p-dialog .product-image {
                width: 150px;
                margin: 0 auto 2rem auto;
                display: block;
            }
        `,
    ],
})
export class DynamicCrudComponent implements OnInit {
    productDialog: boolean | undefined;
    product: any;
    products: any;
    selectedProducts: any;
    submitted: boolean | undefined;
    tableColumn: any;
    productImageBase64: any;
    editMode: any;
    base64Image: any;
    FormData: any;
    updateData: any;
    employes$: any;
    subscrpition: Subscription;
    labelData: any = {};
    isAdmin: any;
    constructor(
        private messageService: MessageService,
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private store: Store<fromEmploye.AppState>,
        public translate: TranslateService,
        private breadcrumbService: AppBreadcrumbService
    ) {
        this.http.get(`./assets/demodata.json`).subscribe((data) => {
            this.FormData = data;
        });
        // this.breadcrumbService.setItems([
        //     { label: this.labelData["HOME.PAGE"] },
        //     {
        //         label: this.labelData["HOME.JSONCRUD"],
        //         // routerLink: ["/pages/JSON-crud"],
        //     },
        // ]);
        translate.onLangChange.subscribe((event: any) => {
            // do something
            this.setmenutranslate();
        });
        this.setmenutranslate();
    }
    setmenutranslate() {
        this.translate
            .get(["HOME.PAGE", "HOME.JSONCRUD"])
            .subscribe((translations) => {
                // console.log(translations);
                this.labelData = translations;
                this.breadcrumbService.setItems([
                    { label: this.labelData["HOME.PAGE"] },
                    {
                        label: this.labelData["HOME.JSONCRUD"],
                        // routerLink: ["/pages/JSON-crud"],
                    },
                ]);
            });
    }
    changeLang(lang: string) {
        lang === this.translate.currentLang;
    }
    createOrUpdateFrom(data?) {
        if (data) {
            this.FormData.fields.map((e, i) => {
                e.value = data[e.name];
            });
        }
    }
    ngOnInit() {
        this.isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
        this.getAllRecord();
    }

    openEditMode(data) {
        this.createOrUpdateFrom(data);
        this.productDialog = true;
    }

    getAllRecord() {
        this.employes$ = this.store.pipe(select(fromEmploye.getEmploye));
        this.subscrpition = this.employes$.subscribe(
            (loadEmp) => {
                this.products = loadEmp;
                this.tableColumn = loadEmp.length
                    ? Object.keys(loadEmp[0])
                    : [];
                this.tableColumn.push("Action");
            },
            (error) => {
                this.messageService.add({
                    severity: "error",
                    summary: "error",
                    detail: error,
                    life: 3000,
                });
            }
        );
    }
    openNew() {
        this.FormData.fields.map((v, i) => {
            v.value = "";
        });
        this.submitted = false;
        this.productDialog = true;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product) {
        this.confirmationService.confirm({
            message: "Are you sure you want to delete " + product.name + "?",
            header: "Confirm",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.store.dispatch(
                    new employeAction.DeleteEmploye(product.id)
                );
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Deleted",
                    life: 3000,
                });
            },
        });
    }

    saveProduct(inventoryForm) {
        console.log(inventoryForm.value, "152");

        const formData = { ...inventoryForm.value };
        if (formData.id !== 0 && formData.id) {
            this.store.dispatch(new employeAction.UpdateEmploye(formData));
            this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Product Updated",
                life: 3000,
            });
        } else {
            this.store.dispatch(new employeAction.CreateEmploye(formData));
            this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: "Product Created",
                life: 3000,
            });
        }
        this.productDialog = false;
    }
}
