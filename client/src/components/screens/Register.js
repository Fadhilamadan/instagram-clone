import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Register = () => {
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const Register = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            M.toast({
                html: 'Email not valid',
                classes: '#e53935 red darken-1',
            });

            return true;
        }

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    M.toast({
                        html: data.error,
                        classes: '#e53935 red darken-1',
                    });
                } else {
                    M.toast({
                        html: data.message,
                        classes: '#69f0ae green accent-2',
                    });
                    history.push('/login');
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
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    onClick={() => Register()}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Register;
