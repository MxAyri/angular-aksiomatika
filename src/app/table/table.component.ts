import { AfterViewInit, Component, ViewChild, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TableDataSource, TableItem, EXAMPLE_DATA } from './table-datasource';
import { FormsModule }   from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, {static: true}) table!: MatTable<TableItem>;
  dataSource = new MatTableDataSource(EXAMPLE_DATA);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'description', 'dateComplete', 'date', 'edit'];
  columnsToDisplay: string[] = this.displayedColumns.slice();

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  };

  constructor() { }
  
  ngOnInit() {
  }

  foods: Food[] = [
    {value: '1', viewValue: '1'},
  ];
  // text: string = "";
  addItem(text: string, valueDate:string, valueTime: string, description: string) {
    const id: number = EXAMPLE_DATA.length + 1;
    const now = new Date();
    const setDate = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
    const dateComplete = `${valueDate} ${valueTime}`
    const item = {id: id, name: text, description: description, dateComplete: dateComplete, date: setDate, edit: ''};
    const select = this.foods.length;
    const selectItem = {value: `${select + 1}`, viewValue: `${select + 1}`};
    EXAMPLE_DATA.push(item);
    this.foods.push(selectItem);

    const massive = this.dataSource.data;
    this.dataSource.data = massive;
    this.table.renderRows();
  };

  removeItem(ev: Event) {
    const check: any = ev.target;
    const elem = document.querySelectorAll('.mat-mdc-button-touch-target');
    const elemTxt = document.querySelectorAll('.mdc-button__label');

    elem.forEach((el,index) => {
      if (el === check || elemTxt[index] === check) {
        EXAMPLE_DATA.splice(index / 3, 1);
        EXAMPLE_DATA.forEach((id, index) => {
          id.id = index + 1;
        });
        const massive = this.dataSource.data;
        this.dataSource.data = massive;
        this.table.renderRows();
      }
    })
  }
  dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
    const add = document.querySelector('.add-item');
    
    add?.addEventListener('click', (e) => {
      const valueName = (document.querySelector('.add-value-name') as HTMLInputElement).value;
      const valueDate = (document.querySelector('.add-value-date') as HTMLInputElement).value;
      const valueTime = (document.querySelector('.add-value-time') as HTMLInputElement).value;
      const valueDescription = (document.querySelector('.add-value-description') as HTMLInputElement).value
      this.addItem(valueName, valueDate, valueTime, valueDescription);
    });
  }

  editDialog(ev: Event) {
    this.dialog.open(DialogElementsExampleDialog);
    const editBtn = document.querySelector('.add-item');
    (editBtn as HTMLInputElement).textContent = "Редактировать";
    (editBtn as HTMLInputElement).classList.remove('add-item');
    (editBtn as HTMLInputElement).classList.add('edit-item');

    const check: any = ev.target;
    const elem = document.querySelectorAll('.mat-mdc-button-touch-target');
    const elemTxt = document.querySelectorAll('.mdc-button__label');
    let id: number;
    elem.forEach((el,index) => {
      if(el === check || elemTxt[index] === check){
        id = index / 3;

        (document.querySelector('.add-value-name') as HTMLInputElement).value = `${EXAMPLE_DATA[id].name}`;
        (document.querySelector('.add-value-description') as HTMLInputElement).value = `${EXAMPLE_DATA[id].description}`;
        let dateComp: any = EXAMPLE_DATA[id].dateComplete.match(/\S+/g);
        (document.querySelector('.add-value-date') as HTMLInputElement).value = dateComp[0];
        (document.querySelector('.add-value-time') as HTMLInputElement).value = dateComp[1];
      }
    })

    const edit = document.querySelector('.edit-item');
    
    edit?.addEventListener('click', (e) => {
      const valueName = (document.querySelector('.add-value-name') as HTMLInputElement).value;
      const valueDate = (document.querySelector('.add-value-date') as HTMLInputElement).value;
      const valueTime = (document.querySelector('.add-value-time') as HTMLInputElement).value;
      const valueDescription = (document.querySelector('.add-value-description') as HTMLInputElement).value
      const dateComplete = `${valueDate} ${valueTime}`;
      EXAMPLE_DATA[id].name = valueName;
      EXAMPLE_DATA[id].dateComplete = dateComplete;
      EXAMPLE_DATA[id].description = valueDescription;

      const massive = this.dataSource.data;
      this.dataSource.data = massive;
      this.table.renderRows();
    });
  }

  infoDialog(ev: Event) {
    this.dialog.open(DialogElementsExampleDialog);
    const editBtn = document.querySelector('.add-item');
    (editBtn as HTMLInputElement).style.display = "none";
    (document.querySelector('.add-form') as HTMLInputElement).style.display = 'none';
    (document.querySelector('.dialog-txt-cont') as HTMLInputElement).style.display = 'block';
    
    const check: any = ev.target;
    const elem = document.querySelectorAll('.table-row');

    elem.forEach((el,index) => {
      if (el === check ) {
        (document.querySelector('.dialog-txt-cont-h3') as HTMLInputElement).textContent = `${EXAMPLE_DATA[index].name}`;
        (document.querySelector('.dialog-txt-cont-p') as HTMLInputElement).innerHTML = `${EXAMPLE_DATA[index].description} <br><br> ${EXAMPLE_DATA[index].dateComplete}`;
      }
    });
  }

  swipe(ev: Event){
    const check: any = ev.target;
    const elem = document.querySelectorAll('.mat-mdc-button-touch-target');
    const elemTxt = document.querySelectorAll('.mdc-button__label');

    elem.forEach((el,index) => {
      if (el === check || elemTxt[index] === check) {
        const valueId = Math.floor(index / 3);
        const valueSelect: any = (document.querySelectorAll('.mat-mdc-select-min-line')[valueId] as HTMLInputElement).textContent;

        if ((valueId + 1) != valueSelect){
          const firstSwipe = EXAMPLE_DATA[valueId].id;
          const secondSwipe = EXAMPLE_DATA[valueSelect - 1].id;
          
          EXAMPLE_DATA[valueId].id = secondSwipe;
          EXAMPLE_DATA[valueSelect - 1].id = firstSwipe;

          const massive = this.dataSource.data;
          this.dataSource.data = massive;
          this.table.renderRows();
        }
      }
    })
    
  }
}

@Component({
  selector: 'dialog-elements-add-dialog',
  templateUrl: './modal/dialog-add.html',
  styleUrl: './table.component.css',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

class DialogElementsExampleDialog {
}