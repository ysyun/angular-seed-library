import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StubAPIComponent } from './stub-api.component';
import { StubAPIRoutingModule } from './stub-api-routing.module';

@NgModule({
  imports: [CommonModule, StubAPIRoutingModule],
  declarations: [StubAPIComponent],
  exports: [StubAPIComponent]
})
export class StubAPIModule { }
