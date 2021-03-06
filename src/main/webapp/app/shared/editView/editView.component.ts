import { Component, OnInit, AfterViewInit, Renderer, ElementRef, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { JhiLanguageService, EventManager } from 'ng-jhipster';

import { EditViewService } from '../editView/editView.service';
import { StateStorageService } from '../auth/state-storage.service';
import { SocialService } from '../social/social.service';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'jhi-editView-modal',
    templateUrl: './editView.component.html',
    styleUrls: [
        'editView.scss'
    ]
})
export class JhiEditViewModalComponent implements OnInit, AfterViewInit {
    @Input() _editComponent: string;
    @Input() _componentId: number;
    @Input() _student: any;



    eventSubscriber: Subscription;
    editComponent: string;
    componentId: number;
    student: any;
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    credentials: any;

    constructor(

        private eventManager: EventManager,
        private languageService: JhiLanguageService,
        private editViewService: EditViewService,
        private stateStorageService: StateStorageService,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private socialService: SocialService,
        private router: Router,
        public activeModal: NgbActiveModal
    ) {
        this.credentials = {};
    }

    ngOnInit() {
        this.languageService.addLocation('editView');
        this.editComponent = this._editComponent;
        console.log("choose: " + this.editComponent);
        this.componentId = this._componentId;
        this.student = this._student;
        this.registerChangeInEditForms();
    }

    ngAfterViewInit() {
/*        this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []);
*/    }

    cancel () {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true
        };
        this.authenticationError = false;
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.editViewService.login({
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
        }).then(() => {
            this.authenticationError = false;
            this.activeModal.dismiss('login success');
            if (this.router.url === '/register' || (/activate/.test(this.router.url)) ||
                this.router.url === '/finishReset' || this.router.url === '/requestReset') {
                this.router.navigate(['']);
            }

            // In case of router.url = ' ' site must be reloaded
            if (this.router.url === '/')
            {
                location.reload();
            }

            this.eventManager.broadcast({
                name: 'authenticationSuccess',
                content: 'Sending Authentication Success'
            });

            // // previousState was set in the authExpiredInterceptor before being redirected to login modal.
            // // since login is successful, go to stored previousState and clear previousState
            let previousState = this.stateStorageService.getPreviousState();
            if (previousState) {
                this.stateStorageService.resetPreviousState();
                this.router.navigate([previousState.name], { queryParams:  previousState.params });
            }
        }).catch(() => {
            this.authenticationError = true;
        });
    }

    register () {
        this.activeModal.dismiss('to state register');
        this.router.navigate(['/register']);
    }

    requestResetPassword () {
        this.activeModal.dismiss('to state requestReset');
        this.router.navigate(['/reset', 'request']);
    }

    registerChangeInEditForms() {
        this.eventSubscriber = this.eventManager.subscribe('EditFormsFinished', (response) => this.close());
        this.eventSubscriber = this.eventManager.subscribe('JobApplyFinished', (response) => this.close());
    }

    private close()
    {
        this.activeModal.dismiss("saved");
    }
}
