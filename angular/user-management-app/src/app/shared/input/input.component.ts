import {Component, forwardRef, Injector, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: false,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() disabled: boolean = false;

  value: string = '';
  isFocused: boolean = false;

  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  ngControl: NgControl | null = null;

  constructor(private injector: Injector) {
  }

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(val: string): void {
    this.value = val || '';
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

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  hasError(): boolean {
    const control = this.ngControl?.control;
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getErrorMessage(): string | null {
    const control = this.ngControl?.control;
    if (!control || !control.errors || !(control.touched || control.dirty)) return null;

    if (control.errors['required']) {
      return 'A mező megadása kötelező.';
    }
    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimum ${requiredLength} karakter szükséges.`;
    }
    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Legfeljebb ${maxLength} karakter lehet.`;
    }
    if (control.errors['pattern']) {
      return 'Érvénytelen formátum. Kérlek, ellenőrizd a mező tartalmát.';
    }

    return null;
  }
}
