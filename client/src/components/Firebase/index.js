import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'

const config = {
  apiKey: "AIzaSyBsN5O713Cqeyu4VaPCM4gqy3QcR6kCOmg",
  authDomain: "coronavirus-show.firebaseapp.com",
  databaseURL: "https://coronavirus-show.firebaseio.com",
  projectId: "coronavirus-show",
  storageBucket: "coronavirus-show.appspot.com",
  messagingSenderId: "460174667977",
  appId: "1:460174667977:web:9bd81df6fee0f3eafb9d18",
  measurementId: "G-DHC9TFD5C1"
}

class Firebase {
  constructor() {
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