import app from 'firebase/app'
import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/analytics'
// import * as firebase from 'firebase';
// import fbcli from 'firebase-tools';
// import fs from 'fs'

// by default, uses the current project and logged in user
// fbcli.setup.web().then(config => {
//   fs.writeFileSync(
//     'build/initFirebase.js',
//     `firebase.initializeApp(${JSON.stringify(config)});`
//   );
// });
// alternative:
// fetch('/__/firebase/init.json').then(async response => {
//   app.initializeApp(await response.json());
// });

// fetch('/__/firebase/init.json').then(async response => {
//   app.initializeApp(await response.json());
// });


class Firebase {
  constructor() {
    let config = {}
    if (window.location.hostname === 'coronavirus.show') {
      config = {
        apiKey: "AIzaSyBsN5O713Cqeyu4VaPCM4gqy3QcR6kCOmg",
        authDomain: "coronavirus-show.firebaseapp.com",
        databaseURL: "https://coronavirus-show.firebaseio.com",
        projectId: "coronavirus-show",
        storageBucket: "coronavirus-show.appspot.com",
        messagingSenderId: "460174667977",
        appId: "1:460174667977:web:9bd81df6fee0f3eafb9d18",
        measurementId: "G-DHC9TFD5C1"
      }
    } else {
      config = {
        apiKey: "AIzaSyA773uJxQ_Sv0RRJG8fhh_mLV0STU0DKLE",
        authDomain: "coronavirus-show-staging.firebaseapp.com",
        databaseURL: "https://coronavirus-show-staging.firebaseio.com",
        projectId: "coronavirus-show-staging",
        storageBucket: "coronavirus-show-staging.appspot.com",
        messagingSenderId: "1092718831616",
        appId: "1:1092718831616:web:335d5d01414fb8d0e990e5",
        measurementId: "G-FD6RKX0PE2"
      };
    }
    app.initializeApp(config)
    app.analytics()
    this.db = app.firestore()
  }

  getData = async () => {
    const data = await Promise.all([
      this.db.collection('Summary').doc('all').get(),
      this.db.collection('Summary').doc('ctp').get()
    ])
    return { globalData: data[0].data(), usData: data[1].data() }
  }
}


export default Firebase