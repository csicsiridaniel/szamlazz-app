import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent implements OnChanges {
  @Input() text: string = 'Gomb';
  @Input() backgroundColor: string = '#e0e0e0';
  @Input() iconClass: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() disabled: boolean = false;

  @Output() onButtonClick = new EventEmitter<any>();

  textColor: string = 'black';

  ngOnChanges(): void {
    this.textColor = this.getContrastColor(this.backgroundColor);
  }

  private getContrastColor(bgColor: string): string {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 150 ? 'black' : 'white';
  }

  onClick() {
    this.onButtonClick.emit();
  }
}
