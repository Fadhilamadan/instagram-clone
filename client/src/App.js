import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';

import NavBar from './components/Navbar';
import Login from './components/screens/Login';
import Register from './components/screens/Register';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import FollowingPost from './components/screens/FollowingPost';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';
import { reducers, initialState } from './reducers/userReducer';

export const UserContext = createContext();

const Routing = () => {
    const history = useHistory();
    const { dispatch } = useContext(UserContext);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            dispatch({
                type: 'USER',
                payload: user,
            });
        } else {
            if (!history.location.pathname.startsWith('/reset-password')) {
                history.push('/login');
            }
        }
    }, []);

    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/profile">
                <Profile />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
            <Route path="/create">
                <CreatePost />
            </Route>
            <Route path="/profile/:userId">
                <UserProfile />
            </Route>
            <Route path="/myFollowing">
                <FollowingPost />
            </Route>
            <Route exact path="/reset-password">
                <Reset />
            </Route>
            <Route path="/reset-password/:token">
                <NewPassword />
            </Route>
        </Switch>
    );
};

function App() {
    const [state, dispatch] = useReducer(reducers, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <BrowserRouter>
                <NavBar />
                <Routing />
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
