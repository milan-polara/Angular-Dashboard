import { Component } from "@angular/core";
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AuthenticationService } from "../../service/authentication.service";

@Component({
    selector: "app-login",
    templateUrl: "./app.login.component.html",
})
export class AppLoginComponent {
    loginForm: FormGroup;
    get password(): AbstractControl {
        return this.loginForm.get("password") as AbstractControl;
    }

    get email(): AbstractControl {
        return this.loginForm.get("email") as AbstractControl;
    }
    constructor(
        private _builder: FormBuilder,
        private authentication: AuthenticationService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.loginForm = this._builder.group({
            password: [
                "",
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(64),
                ],
            ],
            email: [
                "",
                [
                    Validators.required,
                    Validators.pattern(
                        "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"
                    ),
                ],
            ],
        });
    }

    login() {
        const email = "admin@gmail.com";
        const pass = "admin@123";
        if (
            this.loginForm.value.email == email &&
            this.loginForm.value.password == pass
        ) {
            console.log("valaid");

            this.router.navigate(["components/dashboard"]);
            localStorage.setItem("isAdmin", JSON.stringify(true));
            localStorage.setItem(
                "Admin",
                JSON.stringify({
                    username: "admin",
                    password: "admin@123",
                    email: "admin@gmail.com",
                    id: 0,
                })
            );
        } else {
            this.authentication
                .authentication(this.loginForm)
                .subscribe((user) => {
                    if (user) {
                        localStorage.setItem("User", JSON.stringify(user));
                        this.router.navigate(["components/dashboard"]);
                    } else {
                        this.messageService.add({
                            severity: "error",
                            summary: "Something went wrong",
                            detail: "user not found",
                        });
                    }
                });
        }
    }

    onClick() {
        this.router.navigate(["components/signUp"]);
    }
}
