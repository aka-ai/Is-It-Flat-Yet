import app from 'firebase/app'
import 'firebase/firestore'

const config = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_DATABASE_URL,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,

  apiKey: "AIzaSyBsN5O713Cqeyu4VaPCM4gqy3QcR6kCOmg",
  authDomain: "coronavirus-show.firebaseapp.com",
  databaseURL: "https://coronavirus-show.firebaseio.com",
  projectId: "coronavirus-show",
  storageBucket: "coronavirus-show.appspot.com",
  messagingSenderId: "460174667977",
}

class Firebase {
  constructor() {
    app.initializeApp(config)
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