import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { SchoolComponent } from './school.component';
import { SchoolDetailComponent } from './school-detail.component';
import { SchoolPopupComponent } from './school-dialog.component';
import { SchoolDeletePopupComponent } from './school-delete-dialog.component';

import { Principal } from '../../shared';


export const schoolRoute: Routes = [
  {
    path: 'school',
    component: SchoolComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'workstarterApp.school.home.title'
    }
  }, {
    path: 'school/:id',
    component: SchoolDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'workstarterApp.school.home.title'
    }
  }
];

export const schoolPopupRoute: Routes = [
  {
    path: 'school-new',
    component: SchoolPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'workstarterApp.school.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'school/:id/edit',
    component: SchoolPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'workstarterApp.school.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'school/:id/delete',
    component: SchoolDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'workstarterApp.school.home.title'
    },
    outlet: 'popup'
  }
];
