import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../components/shared/shared.module';
import * as $ from 'jquery';

@Component({
    selector: 'app-spreadsheet',
    standalone: true,
    imports: [CommonModule, SharedModule],
    template: `
        <div class="spreadsheet-container">

        </div>
    `,
    styles: [`
        .spreadsheet-container {
            padding: 1rem;
        }
        p {
            color: red;
            font-size: 1.2rem;
        }
    `]
})
export class SpreadsheetComponent implements OnInit {
    constructor() { }
    ngOnInit(): void {
        const container = $(".spreadsheet-container");
    }
}