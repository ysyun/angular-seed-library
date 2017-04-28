import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StubAPIComponent } from './stub-api.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'stubapi', component: StubAPIComponent }
    ])
  ],
  exports: [RouterModule]
})
export class StubAPIRoutingModule { }
