import { Component, OnDestroy, OnInit } from "@angular/core";
import { ConfirmationService, SelectItem } from "primeng/api";
import { MessageService } from "primeng/api";
import { AppBreadcrumbService } from "../../../app.breadcrumb.service";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Employe } from "../../models/employe.model";
import { Store, select } from "@ngrx/store";
import * as fromEmploye from "../../state/employe.reducer";
import * as employeAction from "../../state/employe.action";
import { Observable, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
interface Skills {
    name: string;
    value: string;
}
@Component({
    templateUrl: "./app.crud.component.html",
    styleUrls: ["./app.crud.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class AppCrudComponent implements OnInit {
    selectedSkills: SelectItem[];
    skills: SelectItem[];

    employeDailog: boolean;

    selectedCategory: any = null;
    isAdmin: boolean;
    Categories: SelectItem[];

    item: string;

    employes$: Observable<Employe[]>;

    subscrpition: Subscription;

    EmployeData: any;

    submitted: boolean;

    sortOptions: SelectItem[];

    sortOrder: number;

    sortField: string;

    employeeForm: FormGroup;

    file: any;
    labelData: any = {};
    gender: string;
    date1: Date;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private breadcrumbService: AppBreadcrumbService,
        private store: Store<fromEmploye.AppState>,
        public translate: TranslateService
    ) {
        // this.breadcrumbService.setItems([
        //     { label: "Pages" },
        //     { label: "Crud", routerLink: ["/pages/crud"] },
        // ]);
        // console.log(translate);
        // this.breadcrumbService.setItems([
        //     { label: this.labelData["HOME.PAGE"] },
        //     {
        //         label: this.labelData["HOME.OPERATION"],
        //         // routerLink: ["/pages/crud"],
        //     },
        // ]);
        const browserLang = translate.getBrowserLang();
        translate.onLangChange.subscribe((event: any) => {
            this.setmenutranslate();
        });
        this.setmenutranslate();
    }

    setmenutranslate() {
        this.translate
            .get([
                "HOME.PAGE",
                "HOME.OPERATION",
                "HOME.PRICEHIGHTOLOW",
                "HOME.PRICELOWTOHIGH",
                "HOME.DATAANALYST",
                "HOME.FRONTEND",
                "HOME.BAKEND",
                "HOME.FULLSTACK",
                "HOME.ANDROID",
                "HOME.IOS",
                "HOME.ANGULAR",
                "HOME.FLUTTER",
                "HOME.REACT",
                "HOME.UIUX",
                "HOME.TESTER",
                "HOME.JAVASCRIPT",
                "HOME.JAVA",
                "HOME.HTML",
                "HOME.CSS",
                "HOME.REACTS",
                "HOME.ANGULARS",
                "HOME.PYTHON",
                "HOME.C##",
                "HOME.C++",
                "HOME.PHP",
                "HOME.MOBILE",
                "HOME.QUALITYANALYTICS",
                "HOME.TL",
                "HOME.HR",
                "HOME.SOFTWARE"
            ])
            .subscribe((translations) => {
                // console.log(translations);
                this.labelData = translations;
                // console.log(this.labelData,"this.labelData");
                
                this.sortOptions = [
                    {
                        label: this.labelData["HOME.PRICEHIGHTOLOW"],
                        value: "!salary",
                    },
                    {
                        label: this.labelData["HOME.PRICELOWTOHIGH"],
                        value: "salary",
                    },
                ];
                this.Categories = [
                  
                    // {
                    //     label: this.labelData["HOME.FRONTEND"],
                    //     value: "FrontEnd-Developer",
                    // },
                    // {
                    //     label: this.labelData["HOME.BAKEND"],
                    //     value: "Backend-Developer",
                    // },
                    // {
                    //     label: this.labelData["HOME.ANDROID"],
                    //     value: "Android-Developer",
                    // },
                    // {
                    //     label: this.labelData["HOME.IOS"],
                    //     value: "IOS-Developer",
                    // },
                    // {
                    //     label: this.labelData["HOME.ANGULAR"],
                    //     value: "Angular-Developer",
                    // },
                    // {
                    //     label: this.labelData["HOME.FLUTTER"],
                    //     value: "Flutter-Developer",
                    // },
                    // {
                    //     label: this.labelData["HOME.REACT"],
                    //     value: "React-Developer",
                    // },
                    {
                        label: this.labelData["HOME.DATAANALYST"],
                        value: "Data-Analyst",
                    },
                    {
                        label: this.labelData["HOME.FULLSTACK"],
                        value: "Fullstack-Developer",
                    },
                    
                    {
                        label: this.labelData["HOME.UIUX"],
                        value: "UI_UX-designer",
                    },
                    {
                        label: this.labelData["HOME.MOBILE"],
                        value: "Mobile app Development",
                    },
                    {
                        label: this.labelData["HOME.QUALITYANALYTICS"],
                        value: "Quality Analytics",
                    },
                    {
                        label: this.labelData["HOME.TL"],
                        value: "Team Leader",
                    },
                    {
                        label: this.labelData["HOME.HR"],
                        value: "Human Resource",
                    },
                    {
                        label: this.labelData["HOME.SOFTWARE"],
                        value: "Software Developer",
                    },
                    { label: this.labelData["HOME.TESTER"], value: "Tester" },
                ];
                this.skills = [
                    {
                        label: this.labelData["HOME.JAVASCRIPT"],
                        value: "Java Script",
                    },
                    { label: this.labelData["HOME.JAVA"], value: "Java" },
                    { label: this.labelData["HOME.HTML"], value: "HTML" },
                    { label: this.labelData["HOME.CSS"], value: "CSS" },
                    { label: this.labelData["HOME.REACTS"], value: "React" },
                    {
                        label: this.labelData["HOME.ANGULARS"],
                        value: "Angular",
                    },
                    { label: this.labelData["HOME.PYTHON"], value: "Python" },
                    { label: this.labelData["HOME.C##"], value: "C#" },
                    { label: this.labelData["HOME.C++"], value: "C++" },
                    { label: this.labelData["HOME.PHP"], value: "PHP" },
                ];
                // console.log(this.labelData, "110");
                this.breadcrumbService.setItems([
                    { label: this.labelData["HOME.PAGE"] },
                    {
                        label: this.labelData["HOME.OPERATION"],
                        // routerLink: ["/pages/crud"],
                    },
                ]);
            });
    }
    changeLang(lang: string) {
        lang === this.translate.currentLang;
    }
    ngOnInit() {
        this.employeeForm = new FormGroup({
            image: new FormControl("",[Validators.required]),
            name: new FormControl("", [Validators.required]),
            category: new FormControl("", [Validators.required]),
            description: new FormControl("", [Validators.required]),
            salary: new FormControl("", [Validators.required]),
            gender: new FormControl("", [Validators.required]),
            skills: new FormControl("", [Validators.required]),
            qualification: new FormControl("", [Validators.required]),
            experience: new FormControl("", [Validators.required]),
            dob: new FormControl("", [Validators.required]),
            id: new FormControl(),
            // skills: this.fb.array([], [Validators.required]),
        });
        this.isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
        this.getAllRecord();
    }
    getAllRecord() {
        this.employes$ = this.store.pipe(select(fromEmploye.getEmploye));
        this.employes$.subscribe((loadEmp) => {
            this.EmployeData = loadEmp;
        });
    }
    onChange(event) {
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.addEventListener("load", (result: any) => {
            this.file = reader.result;
            this.employeeForm.controls["image"].setValue(this.file);
        });
        reader.readAsDataURL(file);
    }
    onSortChange(event) {
        let value = event.value;
        if (value.indexOf("!") === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }
    openNew() {
        this.employeeForm.reset();
        this.submitted = false;
        this.employeDailog = true;
    }
    editemploye(employe: Employe) {
        this.employeDailog = true;
        this.employeeForm.controls["category"].setValue(employe.category);
        this.employeeForm.controls["name"].setValue(employe.name);
        this.employeeForm.controls["description"].setValue(employe.description);
        this.employeeForm.controls["id"].setValue(employe.id);
        this.employeeForm.controls["image"].setValue(employe.image);
        this.employeeForm.controls["salary"].setValue(employe.salary);
        this.employeeForm.controls["gender"].setValue(employe.gender);
        this.employeeForm.controls["skills"].setValue(employe.skills);
        this.employeeForm.controls["qualification"].setValue(employe.qualification);
        this.employeeForm.controls["experience"].setValue(employe.experience);
        this.employeeForm.controls["dob"].setValue(new Date(employe.dob));
    }
    deleteemploye(employe: Employe) {
        this.confirmationService.confirm({
            message: "Are you sure you want to delete " + employe.name + "?",
            header: "Confirm",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.EmployeData = this.EmployeData.filter(
                    (val) => val.id !== employe.id
                );
                this.store.dispatch(
                    new employeAction.DeleteEmploye(employe.id)
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
    CancelButton() {
        this.submitted = false;
        this.employeDailog = false;
    }
    saveProduct() {
        // console.log(this.employeeForm.value,"293");
        this.submitted = true;
        if (this.employeeForm.value.name.trim()) {
            if (this.employeeForm.value.id !== null) {
                this.EmployeData[
                    this.findIndexById(this.employeeForm.value.id)
                ] = this.employeeForm.value;
                // this.employeeForm.value.image = this.file;
                this.store.dispatch(
                    new employeAction.UpdateEmploye(this.employeeForm.value)
                );
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Updated",
                    life: 3000,
                });
            } else {
                this.employeeForm.value.image = this.file;
                this.store.dispatch(
                    new employeAction.CreateEmploye(this.employeeForm.value)
                );
                this.employeeForm.reset();
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Created",
                    life: 3000,
                });
            }
            this.employeDailog = false;
        }
    }
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.EmployeData.length; i++) {
            if (this.EmployeData[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }
}
