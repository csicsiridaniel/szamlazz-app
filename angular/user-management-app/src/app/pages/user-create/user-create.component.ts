import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';

@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  form: FormGroup;

  jobOptions = ['KERTESZ', 'HENTES', 'PEK'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(64)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(64)]],
      address: ['', [Validators.maxLength(128)]],
      telephone: ['', [
        Validators.maxLength(128),
        Validators.pattern(/^(\+36|06)?[ -]?(\d{1,2})[ -]?\d{3}[ -]?\d{3,4}$/)
      ]],
      active: [true],
      job: ['', [Validators.required]],
    });
  }

  createUser() {
    if (this.form.valid) {
      let user: User = this.form.value as User;
      console.log(user);
      this.userService.createUser(user).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  cancelCreation() {
    this.router.navigate(['/users']);
  }
}
