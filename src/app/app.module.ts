import { AuthGuard } from './core/auth.guard';
import { ItemService } from './services/item.service';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { ItemsComponent } from './components/items/items.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { CoreModule } from './core/core.module';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { LoginOptionsComponent } from './components/login-options/login-options.component';
import { AppRoutingModule } from './/app-routing.module';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { CasesComponent } from './components/cases/cases.component';
import { CaseViewComponent } from './components/case-view/case-view.component';
import { RegisteredDoctorsService } from './services/registered-doctors.service';


@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    NavbarComponent,
    AddItemComponent,
    UserDetailComponent,
    LoginOptionsComponent,
    ContactInfoComponent,
    CasesComponent,
    CaseViewComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'angularfs'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    CoreModule,
    AppRoutingModule
  ],
  providers: [
    ItemService,
    RegisteredDoctorsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
