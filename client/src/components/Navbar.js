import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

const NavBar = () => {
    const { state, dispatch } = useContext(UserContext);
    const [search, setSearch] = useState('');
    const [userDetails, setUserDetails] = useState('');
    const searchModal = useRef(null);
    const history = useHistory();

    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, []);

    const logout = () => {
        localStorage.clear();

        dispatch({
            type: 'CLEAR',
        });

        history.push('/login');
    };

    const renderList = () => {
        if (state) {
            return [
                <li key="search">
                    <i
                        data-target="search"
                        className="large material-icons modal-trigger black-text"
                    >
                        search
                    </i>
                </li>,
                <li key="profile">
                    <Link to="/profile">Profile</Link>
                </li>,
                <li key="create">
                    <Link to="/create">Create</Link>
                </li>,
                <li key="myFollowing">
                    <Link to="/myFollowing">MyFollowing</Link>
                </li>,
                <li key="logout">
                    <button
                        className="btn waves-effect wave-light"
                        onClick={() => logout()}
                    >
                        Logout
                    </button>
                </li>,
            ];
        } else {
            return [
                <li key="login">
                    <Link to="/login">Login</Link>
                </li>,
                <li key="register">
                    <Link to="/register">Register</Link>
                </li>,
            ];
        }
    };

    const searchUsers = (query) => {
        setSearch(query);

        fetch('/search-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
            }),
        })
            .then((res) => res.json())
            .then((users) => {
                setUserDetails(users.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const closeModal = () => {
        M.Modal.getInstance(searchModal.current).close();

        setSearch('');
    };

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? '/' : '/login'} className="brand-logo left">
                    Instagram
                </Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>

            <div id="search" className="modal black-text" ref={searchModal}>
                <div className="modal-content">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search user..."
                        value={search}
                        onChange={(e) => searchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {userDetails ? (
                            userDetails.map((item) => {
                                return (
                                    <Link
                                        to={
                                            item._id !== state._id
                                                ? '/profile/' + item._id
                                                : '/profile'
                                        }
                                        onClick={() => closeModal()}
                                    >
                                        <li className="collection-item">
                                            {item.email}
                                        </li>
                                    </Link>
                                );
                            })
                        ) : (
                            <li className="collection-item">loading...</li>
                        )}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button
                        className="modal-close waves-effect waves-green btn-flat"
                        onClick={() => setSearch('')}
                    >
                        Close
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
