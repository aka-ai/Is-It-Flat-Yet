import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'


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
    firebase.initializeApp(config);
    firebase.analytics()
    this.db = firebase.firestore()
  }

  getData = async () => {
    const data = await Promise.all([
      this.db.collection('Summary').doc('jhu').get(),
      this.db.collection('Summary').doc('ctp').get(),
    ])
    return { globalData: data[0].data(), usData: data[1].data() }
  }

  getHistoryData = async (key) => {
    const history = await this.db.collection('History').doc(key).get()
    return history.data()
  }
}


export default Firebase