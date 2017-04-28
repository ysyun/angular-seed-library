import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';

@Injectable()
export class StubApiGuard implements CanActivate {
  canActivate() {
    return true;
  }
}
