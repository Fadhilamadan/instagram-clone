import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Reset = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');

    const Reset = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            M.toast({
                html: 'Email not valid',
                classes: '#e53935 red darken-1',
            });

            return true;
        }

        fetch('/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
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
                    type="text"
                    className="form-control"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    className="btn waves-effect wave-light"
                    onClick={() => Reset()}
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default Reset;
