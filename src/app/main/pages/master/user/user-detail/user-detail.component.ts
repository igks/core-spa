import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { User } from "app/models/user.model";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-user-detail",
    templateUrl: "./user-detail.component.html",
    styleUrls: ["./user-detail.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserDetailComponent implements OnInit {
    user: User;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {}
    ngOnInit() {
        this.route.data.subscribe((data) => {
                this.user = data.user;
            });
    }
}
