import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Injector,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: false,
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent<T = string> implements OnInit, ControlValueAccessor {
  @Input() enableFilter: boolean = true;
  @Input() disabled: boolean = false;
  @Input() showClear: boolean = false;
  @Input() label: string = '';

  private _options: T[] = [];
  @Input() set options(value: T[]) {
    this._options = [...(value || [])].sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      } else if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
      }
      return 0;
    });
    this.filteredOptions = [...this._options];
  }

  selected: T | null = null;

  @Output() selectedChange = new EventEmitter<T>();

  isOpen = false;
  filterText = '';
  filteredOptions: T[] = [];

  private onChange: (value: T | null) => void = () => {
  };
  private onTouched: () => void = () => {
  };

  constructor(private _eref: ElementRef, private injector: Injector) {
  }

  ngOnInit() {
    this.filteredOptions = [...this._options];
  }

  writeValue(value: T | null): void {
    this.selected = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      this.filterText = '';
      this.filteredOptions = [...this._options];
    }
  }

  selectOption(option: T) {
    this.selected = option;
    this.selectedChange.emit(option);
    this.onChange(option);
    this.onTouched();
    this.isOpen = false;
  }

  applyFilter() {
    const filter = this.filterText.toLowerCase();
    this.filteredOptions = this._options.filter(opt =>
      (opt + '').toLowerCase().includes(filter)
    );
  }

  clearSelection(event: MouseEvent) {
    event.stopPropagation();
    this.selected = null;
    this.selectedChange.emit(null as any);
    this.onChange(null);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.onTouched();
    }
  }
}
