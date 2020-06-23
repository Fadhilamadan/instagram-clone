import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

const NewPassword = () => {
    const history = useHistory();
    const { token } = useParams();
    const [password, setPassword] = useState('');

    const NewPassword = () => {
        fetch('/new-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password,
                token,
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
                    type="password"
                    className="form-control"
                    placeholder="new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="btn waves-effect wave-light"
                    onClick={() => NewPassword()}
                >
                    Update Password
                </button>
            </div>
        </div>
    );
};

export default NewPassword;
