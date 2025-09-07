import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Comics from './pages/Comics';
import Characters from './pages/Characters';
import ComicsCharacter from './pages/ComicsCharacter';
import Header from './components/Header';
import { useState } from 'react';
import Cookies from "js-cookie";
import ModalConnect from './components/ModalConnect';
import Character from './pages/Character';
import Comic from './pages/Comic';

function App() {
  const [token, setToken] = useState(Cookies.get("token") || null)
  const [user, setUser] = useState({
    userID: Cookies.get('userID') || '',
    username: Cookies.get('username') || '',
    avatar:''
  })
  const [visibleModalLog, setVisibleModalLog] = useState(false) // visibilité modale
  const [isLogin, setIsLogin] = useState(false); // card login or register
  const [formDataSearch, setFormDataSearch] = useState("")
  const [localFavorites, setLocalFavorites] = useState([]);

  return (
    <>
      <Router>
        <ModalConnect setVisibleModalLog={setVisibleModalLog} visibleModalLog={visibleModalLog} setToken={setToken} setUser={setUser} setIsLogin={setIsLogin} isLogin={isLogin} setLocalFavorites={setLocalFavorites} />
        <Header token={token} setToken={setToken} user={user}  setVisibleModalLog={setVisibleModalLog} setIsLogin={setIsLogin} setFormDataSearch={setFormDataSearch} />
        <Routes>
          <Route path='/' element={<Characters formDataSearch={formDataSearch} token={token} setVisibleModalLog={setVisibleModalLog} setLocalFavorites={setLocalFavorites} localFavorites={localFavorites} />} />
          <Route path='/comics_character/:character_id' element={<ComicsCharacter />} />
          <Route path='/comics' element={<Comics formDataSearch={formDataSearch} token={token}  setVisibleModalLog={setVisibleModalLog}setLocalFavorites={setLocalFavorites} localFavorites={localFavorites} />} />
          <Route path='/character/:character_id' element={ <Character /> } />
          <Route path='/comic/:comic_id' element={<Comic />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
