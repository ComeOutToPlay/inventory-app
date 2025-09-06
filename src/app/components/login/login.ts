import { Component, OnInit } from '@angular/core';

/* PrimeNG imports */
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';

/* Reactive Forms imports */
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 
/* Routing: To allow navigation to home page */
import { Router } from '@angular/router';
 
/* Localization */
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

/* Authentication */
import { AuthService } from '../../core/services/auth.service';

import { UserData } from '../../models/user-data.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    ReactiveFormsModule,
    TranslocoModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
 
  hide: boolean = true;
  loginFormGroup!: FormGroup;
 
  constructor (
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translocoService: TranslocoService,
    private messageService: MessageService
  ) {
  }
 
  ngOnInit() {
 
    this.authService.removeUserData();
 
    // Initialize loginFormGroup form group for Reactive Forms
    this.loginFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
   });
  }
 
  login() {  
 
    var loginForm = this.loginFormGroup.value;
 
    this.authService.login(loginForm.username, loginForm.password).subscribe(
      {
        next: (data: any) => {

          if (data != null && data.code == 0) {

            var userData = new UserData();
            userData.token = data.data.token;
            userData.username = loginForm.username;

            this.authService.setUserData(userData);
           
            this.router.navigate(['home']);
 
            // Notify success
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate('page.login.message.authentication'),
              detail: this.translocoService.translate('page.login.message.success')
            });


          } else {
            // Notify error
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate('page.login.message.authentication'),
              detail: this.translocoService.translate('page.login.message.error')
            });
          }
        },
        error: (err: any) => {
         
          // Notify error
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('page.login.message.authentication'),
            detail: this.translocoService.translate('page.login.message.error')
          });

          console.log(err);
        },
        complete: () => {}
      }
    );
  }
}
