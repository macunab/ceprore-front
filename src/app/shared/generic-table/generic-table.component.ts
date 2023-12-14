import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonConfig, Column } from '../interfaces/genericTable.interface';
import { TableModule } from 'primeng/table';
import { TitleCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [ TableModule, ButtonModule, TooltipModule, ToolbarModule, InputTextModule, TitleCasePipe ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css'
})
export class GenericTableComponent<T> {

  @Input() headers: Array<Column<T>> = [];
  @Input() rows: Array<T> = [];
  @Input() buttons: Array<ButtonConfig> = [];
  @Input() filters: Array<string> = [];
  @Input() tableTitle: string = '';
  @Output('onAction') emitter = new EventEmitter();

}
