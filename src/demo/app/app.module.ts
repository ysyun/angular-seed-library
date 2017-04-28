import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';

import { StubAPIModule } from './stub-api/stub-api.module';
import { StubApiGuard } from './app-stubapi.guard';


@NgModule({
  imports: [BrowserModule, HttpModule, AboutModule, HomeModule, StubAPIModule, SharedModule.forRoot(), AppRoutingModule],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  },
  StubApiGuard],
  bootstrap: [AppComponent]

})
export class AppModule { }
