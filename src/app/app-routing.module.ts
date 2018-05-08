import { DicomViewerComponent } from './components/dicom-viewer/dicom-viewer.component';
import { CaseViewComponent } from './components/case-view/case-view.component';
import { CasesComponent } from './components/cases/cases.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { LoginOptionsComponent } from './components/login-options/login-options.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: 'contact', component: ContactInfoComponent, canActivate: [AuthGuard] },
  { path: 'items', component: AddItemComponent, canActivate: [AuthGuard],  data: {isAdmin: true}},
  { path: 'cases', component: CasesComponent, canActivate: [AuthGuard],  data: {isAdmin: false}},
  { path: 'case_view', component: CaseViewComponent, canActivate: [AuthGuard],  data: {isAdmin: false}},
  { path: 'dicom_viewer', component: DicomViewerComponent, canActivate: [AuthGuard],  data: {isAdmin: false}},
  { path: '', redirectTo: '/contact', pathMatch: 'full' , canActivate: [AuthGuard] },
  { path: 'login', component: LoginOptionsComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
