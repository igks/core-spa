import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FilesService } from "app/services/files.service";
import { ProgressStatus, ProgressStatusEnum } from "app/models/progress.model";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-files",
    templateUrl: "./files.component.html",
    styleUrls: ["./files.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class FilesComponent implements OnInit {
    public files: string[];
    public fileList: any = [];
    public fileInDownload: string;
    public percentage: number;
    public showProgress: boolean;
    public showDownloadError: boolean;
    public showUploadError: boolean;

    displayedColumns: string[] = ["name", "buttons"];

    constructor(private service: FilesService) {}

    ngOnInit() {
        this.getFiles();
    }

    private getFiles() {
        this.fileList.length = 0;
        this.service.getFiles().subscribe((data) => {
            this.files = data;
            this.files.map((file) => {
                let fileName = file.split("\\");
                this.fileList.push({
                    link: file,
                    name: fileName[fileName.length - 1],
                });
            });
        });
    }

    public downloadStatus(event: ProgressStatus) {
        switch (event.status) {
            case ProgressStatusEnum.START:
                this.showDownloadError = false;
                break;
            case ProgressStatusEnum.IN_PROGRESS:
                this.showProgress = false;
                this.percentage = event.percentage;
                break;
            case ProgressStatusEnum.COMPLETE:
                this.showProgress = false;
                this.getFiles();
                break;
            case ProgressStatusEnum.ERROR:
                this.showProgress = false;
                this.showDownloadError = true;
                break;
        }
    }

    public uploadStatus(event: ProgressStatus) {
        switch (event.status) {
            case ProgressStatusEnum.START:
                this.showUploadError = false;
                break;
            case ProgressStatusEnum.IN_PROGRESS:
                this.showProgress = true;
                this.percentage = event.percentage;
                break;
            case ProgressStatusEnum.COMPLETE:
                this.showProgress = false;
                this.getFiles();
                break;
            case ProgressStatusEnum.ERROR:
                this.showProgress = false;
                this.showUploadError = true;
                break;
        }
    }
}
