import { AfterViewInit, Component, ViewChild, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TableDataSource, TableItem, EXAMPLE_DATA } from './table-datasource';
import { FormsModule }   from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'viev-table',
  templateUrl: './viev-table.component.html',
  styleUrl: './viev-table.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VievTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, {static: true}) table!: MatTable<TableItem>;
  dataSource = new MatTableDataSource(EXAMPLE_DATA);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'description', 'dateComplete'];
  columnsToDisplay: string[] = this.displayedColumns.slice();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  };

  constructor() { }
  
  ngOnInit() {
  }

  dialog = inject(MatDialog);

  infoDialog(ev: Event) {
    this.dialog.open(VievDialogElementsExampleDialog);
    const editBtn = document.querySelector('.add-item');
    (editBtn as HTMLInputElement).style.display = "none";
    (document.querySelector('.add-form') as HTMLInputElement).style.display = 'none';
    (document.querySelector('.dialog-txt-cont') as HTMLInputElement).style.display = 'block';
    
    const check: any = ev.target;
    const elem = document.querySelectorAll('.table-row');

    elem.forEach((el,index) => {
      if (el === check ) {
        (document.querySelector('.dialog-txt-cont-h3') as HTMLInputElement).textContent = `${EXAMPLE_DATA[index].name}`;
        (document.querySelector('.dialog-txt-cont-p') as HTMLInputElement).textContent = `${EXAMPLE_DATA[index].description}`;
      }
    });



  }
}

@Component({
  selector: 'dialog-elements-add-dialog',
  templateUrl: './modal/dialog-add.html',
  styleUrl: './table.component.css',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, VievTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

class VievDialogElementsExampleDialog {
}