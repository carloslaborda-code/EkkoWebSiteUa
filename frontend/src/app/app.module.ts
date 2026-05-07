import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { DetailComponent } from './pages/detail/detail.component';
import { HomeComponent } from './pages/home/home.component';
import { LibraryComponent } from './pages/library/library.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PublishComponent } from './pages/publish/publish.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileOverviewCompactComponent } from './pages/profile/overviews/profile-overview-compact.component';
import { ProfileOverviewInstagramComponent } from './pages/profile/overviews/profile-overview-instagram.component';
import { ProfileOverviewOriginalComponent } from './pages/profile/overviews/profile-overview-original.component';
import { RegisterComponent } from './pages/register/register.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    DiscoverComponent,
    DetailComponent,
    HomeComponent,
    LibraryComponent,
    LoginComponent,
    PublishComponent,
    RegisterComponent,
    ProfileComponent,
    ProfileOverviewCompactComponent,
    ProfileOverviewInstagramComponent,
    ProfileOverviewOriginalComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks();
  }
}
