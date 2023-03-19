import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class UnAuthGuard implements CanActivate {
    constructor(private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (localStorage.getItem("User") || localStorage.getItem("Admin")) {
            this.router.navigate(["components/dashboard"]);
            return false;
        } else {
            return true;
        }
    }
}
