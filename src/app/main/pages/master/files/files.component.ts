import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { FilesService } from "app/services/files.service";
import { ProgressStatus, ProgressStatusEnum } from "app/models/progress.model";
import { fuseAnimations } from "@fuse/animations";
import { PaginatedResult, Pagination } from "app/models/pagination.model";
import { MatPaginator } from "@angular/material/paginator";

@Component({
    selector: "app-files",
    templateUrl: "./files.component.html",
    styleUrls: ["./files.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class FilesComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    public fileInDownload: string;
    public percentage: number;
    public showProgress: boolean;
    public showDownloadError: boolean;
    public showUploadError: boolean;

    displayedColumns: string[] = ["name", "buttons"];

    public fileList: FileList[];
    private pagination: Pagination;
    private filesParams: any = {};

    isFiltered: boolean = false;
    showFilterForm: boolean = false;

    constructor(private service: FilesService) {}

    ngOnInit() {
        this.getFiles();
    }

    private getFiles() {
        this.service.getFiles().subscribe(
            (res: PaginatedResult<FileList[]>) => {
                this.fileList = res.result;
                this.pagination = res.pagination;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    private createFile() {
        this.service.createFile().subscribe(() => {
            this.getFiles();
        });
    }

    private deleteFile(file: string) {
        this.service.deleteFile(file).subscribe(() => {
            this.getFiles();
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
