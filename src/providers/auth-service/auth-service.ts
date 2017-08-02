import { Injectable } from '@angular/core';

import { LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';


@Injectable()
export class AuthService {
  
  private authState;
  private userauth;
  private userdata;
  private profilepicdata;
  private loading: any;
  
  public user;
  public storageLang: string;
  public storageTouchid: boolean = false;
  public storageEmail: string;
  public storagePwd: string;
  public referrer: string;
  public pwdNotes: string;

  constructor(
    public storage: Storage,
    public authFire: AngularFireAuth, 
    public authFireDB: AngularFireDatabase,
    public loadingCtrl: LoadingController) {
    
    this.authState = authFire.authState;

    this.userdata = firebase.database().ref('/users/');
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  signInWithEmail(credentials): firebase.Promise<any> {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this.authFire.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
      .then((authData) => {
        this.userauth = authData;
        this.getUserData();
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  signUpWithEmail(credentials): firebase.Promise<any> {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this.authFire.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then((authData) => {
        this.userauth = authData;
        this.user = credentials;
        this.createInitialSetup();
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  signOut(): void {
    this.authState = null;
    this.user = null;
    this.userauth = null;
    this.userdata = null;
  }

  displayName(): string {
    if (this.authState != null) {
      return this.authState.facebook.displayName;
    } else {
      return '';
    }
  }

  getUserEmail(): string {
    let user = firebase.auth().currentUser;
    return user.email;
  }

  LoadingControllerShow() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...',
    });
    this.loading.present();
  }

  LoadingControllerDismiss() {
    this.loading.dismiss();
  }

  storageSetLanguage(lang) {
    this.storageLang = lang;
    this.storage.set('option0', lang);
  }
  storageSet(isenabled, pwd, email) {
    this.storageTouchid = isenabled;
    this.storagePwd = pwd;
    this.storageEmail = email;
    this.storage.set('ml1', isenabled);
    this.storage.set('ml2', pwd);
    this.storage.set('ml3', email);
  }
  storageSetEmail(email) {
    this.storageEmail = email;
    this.storage.set('ml3', email);
  }
  storageClean() {
    this.storageTouchid = false;
    this.storagePwd = '';
    this.storageEmail = '';
    this.storage.set('ml1', false);
    this.storage.set('ml2', '');
    this.storage.set('ml3', '');
  }

  //
  // SING IN - CREATE USER
  //-----------------------------------------------------------------------
  createInitialSetup() {
    this.createUserProfile();
  }

  createUserProfile() {

   // Set basic user profile defaults
    var profile = {
      datecreated: firebase.database['ServerValue']['TIMESTAMP'],
      defaultdate: 'None',
      email: this.user.email,
      enabletouchid: 'false',
      fullname: this.user.fullname,
      nickname: this.user.fullname,
      profilepic: 'http://www.gravatar.com/avatar?d=mm&s=140'
    };
    this.user.defaultdate = profile.defaultdate;
    this.user.enabletouchid = profile.enabletouchid;
    this.user.profilepic = profile.profilepic;

    
    // Save user profile
    this.userdata.child(this.userauth.uid).update(profile);
  }


  //
  // PERSONAL PROFILE
  //-----------------------------------------------------------------------

  getUserData() { 
    const thisuser$ : FirebaseObjectObservable<any> = this.authFireDB.object('/users/' + this.userauth.uid); 
    thisuser$.subscribe((val) => {
      this.user = val;
    });
  }

  updateName(newname: string) {
    this.userdata.child(this.userauth.uid).update({'fullname' : newname});
  }

  updateEmail(newEmail: string) {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      let user = firebase.auth().currentUser;
      user.updateEmail(newEmail)
      .then(function() {
        this.user.email = newEmail;
        this.updateEmailNode(newEmail);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }

  updatePassword(newPassword: string) {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      let user = firebase.auth().currentUser;
      user.updatePassword(newPassword)
      .then(function() {
        resolve();
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  deleteData() {
    //
    // Delete ALL user data
    this.userdata.child(firebase.auth().currentUser.uid).remove();
  }

  deleteUser() {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      let user = firebase.auth().currentUser;
      user.delete()
      .then(function() {
        resolve();
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  saveProfilePicture(pic) {
    this.profilepicdata.child(firebase.auth().currentUser.uid).child('profilepicture.png')
    .putString(pic, 'base64', {contentType: 'image/png'}).then((savedpicture) => {
      this.userdata.child(firebase.auth().currentUser.uid).update({'profilepic' : savedpicture.downloadURL});
    });
  }

  updateEmailNode(newemail) {
    this.userdata.child(this.userauth.uid).update({'email' : newemail});
  }
  
  updateDefaultDate(newdefaultdate: string) {
    this.userdata.child(this.userauth.uid).update({'defaultdate' : newdefaultdate});
  }

  //
  // MISCELANEOUS
  //-----------------------------------------------------------------------

  handleData(snapshot)
  {
    try {
      // Firebase stores everything as an object, but we want an array.
      var keys = Object.keys(snapshot.val);
      console.log('keys: ', keys, snapshot.val);
      // variable to store the todos added
      var data = [];
      // Loop through the keys and push the todos into an array
      for( var i = 0; i < keys.length; ++i)
      {
        data.push(snapshot.val()[keys[i]]);
      }
      console.log(data);
    }
    catch (error) {
      console.log('catching', error);
    }
  }


  /*
  // Find an item in the array
  //http://stackoverflow.com/questions/2713599/how-do-i-select-an-item-out-of-a-javascript-array-when-i-only-know-a-value-for-o
  find_in_array(arr, name, value) {
    for (var i = 0, len = arr.length; i<len; i++) {
        if (name in arr[i] && arr[i][name] == value) return i;
    };
    return false;
  }
  var id = find_in_array(measurements.page[0].line, 'lineid', 22);
  */


  //
  // DATA MAINTENANCE
  //-----------------------------------------------------------------------

  upgradeData() {
    this.LoadingControllerDismiss();
  }
  

  // Move or copy a Firebase path to a new location
  // https://gist.github.com/katowulf/6099042
  copyFbRecord(oldRef, newRef) {
    oldRef.once('value', function(snap) {
      newRef.set( snap.val(), function(error) {
        if( error && typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
      });
    });
  }
  moveFbRecord(oldRef, newRef) {
    oldRef.once('value', function(snap) {
      newRef.set( snap.val(), function(error) {
        if( !error ) {  oldRef.remove(); }
        else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
      });
    });
  }


}