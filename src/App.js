import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './components/auth/LoginButton';
import Home from './components/home/Home';

function App() {
  const { isAuthenticated } = useAuth0();
  console.log(isAuthenticated)
  return (
    <div className="App">
     {isAuthenticated ? <Home/> : <LoginButton/>}
    </div>
  );
}

export default App;
