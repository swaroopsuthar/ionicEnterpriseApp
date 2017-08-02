import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// services
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
      public navCtrl: NavController,
      public auth: AuthService) {
      
      this.auth.LoadingControllerDismiss();
  }

}
