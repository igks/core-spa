import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Department } from "app/models/department.model";

declare var Stimulsoft: any;

@Component({
    selector: "app-department-report",
    templateUrl: "./department-report.component.html",
    styleUrls: ["./department-report.component.css"],
})
export class DepartmentReportComponent implements OnInit {
    departments: Department[];

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.departments = data.departments;
        });

        // Stimulsoft.Base.StiLicense.loadFromFile('../assets/reports/license.key');
        const report = Stimulsoft.Report.StiReport.createNewReport();
        const options = new Stimulsoft.Viewer.StiViewerOptions();

        report.loadFile("../../../../../assets/reports/Department.mrt");
        report.dictionary.variables.getByName("title").valueObject =
            "Department List";
        report.reportName = "Department Report";
        report.regData("Department", "Department", this.departments);

        options.width = "100%";
        options.height = "750px";
        options.appearance.scrollbarsMode = true;
        // options.appearance.fullScreenMode = true;

        const viewer = new Stimulsoft.Viewer.StiViewer(
            options,
            "StiViewer",
            false
        );
        viewer.report = report;
        viewer.renderHtml("departmentReport");
    }
}
