import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Timer from './Timer';
import TodoList from './TodoList';
import './Home.css';

function Home() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTasks(currentUser.uid);
      } else {
        setUser(null);
        setTasks([]);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchTasks = async (userId) => {
    const q = query(collection(db, "tasks"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const fetchedTasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTasks(fetchedTasks);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PomoBeats</h1>
        <div className="header-buttons">
          <button onClick={() => auth.signOut()}>Sign Out</button>
        </div>
      </header>
      <main>
        <div className="timer">
          <Timer onSessionComplete={() => console.log("Session complete!")} />
        </div>
        <TodoList tasks={tasks} setTasks={setTasks} user={user} />
      </main>
    </div>
  );
}

export default Home;