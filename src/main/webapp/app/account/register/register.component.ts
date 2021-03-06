import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';

import { Register } from './register.service';
import { LoginModalService, AccountService } from '../../shared';

@Component({
    selector: 'jhi-register',
    templateUrl: './register.component.html',
    styleUrls: [
        'register.scss'
    ]
})
export class RegisterComponent implements OnInit, AfterViewInit {

    confirmPassword: string;
    doNotMatch: string;
    error: string;
    errorEmailExists: string;
    errorUserExists: string;
    registerAccount: any;
    success: boolean;
    modalRef: NgbModalRef;
    role: any;
    url: string;

    constructor(
        private languageService: JhiLanguageService,
        private loginModalService: LoginModalService,
        private registerService: Register,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private accountService: AccountService
    ) {
        this.languageService.setLocations(['register']);
        this.role = "student";
    }

    ngOnInit() {
        this.success = false;
        this.registerAccount = {};
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#login'), 'focus', []);
    }

    register() {
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.error = null;
            this.errorUserExists = null;
            this.errorEmailExists = null;
            this.languageService.getCurrent().then(key => {
                this.registerAccount.langKey = key;
                if(this.role == "student"){
                    this.registerService.saveStudent(this.registerAccount).subscribe(() => {
                    this.success = true;
                    this.displayActivationKey();
                }, (response) => this.processError(response));
                }
                else if(this.role == "company-admin"){
                     this.registerService.saveCompanyAdmin(this.registerAccount).subscribe(() => {
                    this.success = true;
                    this.displayActivationKey();
                }, (response) => this.processError(response));
                }
            });
        }
    }

    displayActivationKey()
    {
        this.accountService.getActivationKey(this.registerAccount.email).toPromise().then(key => {
            this.url= "/#/activate?key=" + key.activationkey;
        });
    }


    openLogin() {
        this.modalRef = this.loginModalService.open();
    }

    private processError(response) {
        this.success = null;
        if (response.status === 400 && response._body === 'login already in use') {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response._body === 'e-mail address already in use') {
            this.errorEmailExists = 'ERROR';
        } else {
            this.error = 'ERROR';
        }
    }
}
