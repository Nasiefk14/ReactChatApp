import React , { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyCYQvb3n72gdocP2LNvUUZYw95z42kumF8",
    authDomain: "chatapp-d3259.firebaseapp.com",
    projectId: "chatapp-d3259",
    storageBucket: "chatapp-d3259.appspot.com",
    messagingSenderId: "990386778560",
    appId: "1:990386778560:web:4548d2a75f1faa5e731825",
    measurementId: "G-4D4P27N8G9"});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
          <title>McNuggs Forum</title>
                <h1>McNuggets Forum🍗</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>  
    )
}

function SignOut() {
  return auth.currentUser && (
        <button  onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({behavior : 'smooth'});
  }

  return(
    <>
    <main>
    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    <div ref ={dummy}></div>
    </main>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter Message Here..." />
      <button type='submit'>✉Send</button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL} = props.message;
  
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(<>
    <div className={`message ${messageClass}`}>
      <img alt='Profile' src={photoURL}/>
      <p>{text}</p>
    </div>
  </>)
  }
export default App;
