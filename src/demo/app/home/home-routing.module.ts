import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { StubApiGuard } from '../app-stubapi.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: HomeComponent, canActivate: [StubApiGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
