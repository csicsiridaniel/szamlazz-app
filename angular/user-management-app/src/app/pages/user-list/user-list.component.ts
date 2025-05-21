import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  columns = [
    {
      key: 'fullname',
      label: 'Név',
      valueFn: (row: User) => {
        return row.lastname + ' ' + row.firstname
      },
    },
    {key: 'job', label: 'Foglalkozás'},
    {
      key: 'active',
      label: 'Aktív',
      valueFn: (row: User) => {
        return row.active ? 'Igen' : 'Nem'
      },
    }
  ];

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  onDeleteUser(user: User) {
    const confirmed = confirm('Biztosan törölni szeretnéd ezt a felhasználót?');
    if (confirmed) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  onEditUser(user: User) {
    this.router.navigate(['/users/edit', user.id]);
  }

  createUser() {
    this.router.navigate(['/users/create']);
  }
}
