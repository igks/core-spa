import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { User } from "app/models/user.model";
import { ActivatedRoute } from "@angular/router";
import { environment } from "environments/environment";

@Component({
    selector: "app-user-detail",
    templateUrl: "./user-detail.component.html",
    styleUrls: ["./user-detail.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserDetailComponent implements OnInit {
    user: User;
    rootUrl: any = environment.rootUrl;
    imgUrl: any;

    constructor(private route: ActivatedRoute) {}
    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.user = data.user;
            this.imgUrl = `${this.rootUrl}${data.user.photo}`;
        });
    }
}
