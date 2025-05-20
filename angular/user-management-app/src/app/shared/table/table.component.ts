import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnChanges {
  @Input() columns: { key: string, label: string, valueFn?: (row: any) => string }[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  currentPage = 1;
  pageSize = 5;
  pagedData: any[] = [];
  pageSizeOptions = [2, 5, 10, 25, 50];

  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = '';
  private originalData: any[] = [];
  filteredData: any[] = [];

  private _data: any[] = [];

  @Input() set data(value: any[]) {
    this._data = value || [];
    this.originalData = [...this._data];
    this.filterData();
  }

  filterData() {
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      this.filteredData = this.originalData.filter(row =>
        this.columns.some(col => {
          const raw = col.valueFn ? col.valueFn(row) : row[col.key];
          return raw?.toString().toLowerCase().includes(term);
        })
      );
    } else {
      this.filteredData = [...this.originalData];
    }

    this.currentPage = 1;
    this.recalculateVisibleRows();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.currentPage = 1;
      this.recalculateVisibleRows();
    }
  }

  toggleSortByKey(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.recalculateVisibleRows();
  }

  recalculateVisibleRows() {
    let sortedData = [...this.filteredData];

    if (this.sortKey) {
      const sortCol = this.columns.find(c => c.key === this.sortKey);
      if (sortCol) {
        sortedData.sort((a, b) => {
          const aValue = sortCol.valueFn ? sortCol.valueFn(a) : a[this.sortKey!];
          const bValue = sortCol.valueFn ? sortCol.valueFn(b) : b[this.sortKey!];

          if (aValue == null) return 1;
          if (bValue == null) return -1;

          if (typeof aValue === 'string') {
            return this.sortDirection === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          } else {
            return this.sortDirection === 'asc'
              ? aValue - bValue
              : bValue - aValue;
          }
        });
      }
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = sortedData.slice(start, end);
  }


  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }

  // --- Paginator ----
  onPageSizeChange() {
    this.currentPage = 1;
    this.recalculateVisibleRows();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get pageRange(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;

    const range: number[] = [];

    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }

    return range;
  }

  get fromItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get toItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredData.length);
  }

  get totalItems(): number {
    return this.filteredData.length;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.recalculateVisibleRows();
    }
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToLastPage() {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage() {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage() {
    this.goToPage(this.currentPage + 1);
  }
}

