import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';

const Login = () => {
    const { dispatch } = useContext(UserContext);

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const Login = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            M.toast({
                html: 'Email not valid',
                classes: '#e53935 red darken-1',
            });

            return true;
        }

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    M.toast({
                        html: data.message,
                        classes: '#e53935 red darken-1',
                    });
                } else {
                    M.toast({
                        html: data.message,
                        classes: '#69f0ae green accent-2',
                    });

                    dispatch({
                        type: 'USER',
                        payload: data.data.user,
                    });

                    localStorage.setItem('jwt-token', data.data.token);
                    localStorage.setItem(
                        'user',
                        JSON.stringify(data.data.user)
                    );

                    history.push('/');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input
                    type="text"
                    className="form-control"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="form-control"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="btn waves-effect wave-light"
                    onClick={() => Login()}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Login;
