import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: false,
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
  form!: FormGroup;
  userId!: number;
  jobOptions = ['KERTESZ', 'HENTES', 'PEK'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadUser();
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [{value: '', disabled: true}],
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(64)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(64)]],
      address: ['', [Validators.maxLength(128)]],
      telephone: ['', [
        Validators.maxLength(128),
        Validators.pattern(/^(\+36|06)?[ -]?(\d{1,2})[ -]?\d{3}[ -]?\d{3,4}$/)
      ]],
      active: [false],
      job: ['', [Validators.required]]
    });
  }

  loadUser(): void {
    this.userService.getUser(this.userId).subscribe((user: User) => {
      this.form.patchValue(user);
    });
  }

  editUser(): void {
    if (this.form.valid) {
      const updatedUser: User = {
        ...(this.form.getRawValue() as User)
      };
      this.userService.updateUser(updatedUser).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  deleteUser() {
    const confirmed = confirm('Biztosan törölni szeretnéd ezt a felhasználót?');
    if (confirmed) {
      this.userService.deleteUser(this.userId).subscribe(() => {
        this.cancelEdit();
      });
    }
  }

  cancelEdit() {
    this.router.navigate(['/users']);
  }
}
