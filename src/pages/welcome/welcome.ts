import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, NavParams, Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';

/**
 * Generated class for the WelcomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export interface Slide {
  title: string;
  icon: string;
  color: string;
  class: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  slideData: Slide[];
   showSkip = true;

	@ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController, 
    public navParams: NavParams) {
      this.slideData = [
        {
          title: '<strong>ionicEnterpriseApp</strong>',
          description: 'This is my first repo.',
          icon: 'appstore',
          color: 'green',
          class: 'slide-title app-title',
          image: '',
        },
        {
          title: 'What is ionicEnterpriseApp?',
          description: '<b>ionicEnterpriseApp</b> is an open source and much much more!',
          icon: 'appstore',
          color: 'green',
          class: 'slide-title',
          image: '',
        },
        {
          title: ' Why Should I Use it?',
          description: 'This is starter-kit.',
          icon: 'appstore',
          color: 'green',
          class: 'slide-title',
          image: '',
        }
      ];
  }

  startApp() {
    this.navCtrl.push(LoginPage);
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

	ionViewWillEnter() {
		this.slides.update();
	}

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
