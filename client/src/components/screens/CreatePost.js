import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        if (photo) {
            // store to our serve
            fetch('/createPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:
                        'Bearer ' + localStorage.getItem('jwt-token'),
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo,
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
                        history.push('/');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [photo]);

    const storeImage = () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'instagram-clone');
        data.append('cloud_name', 'nukucode');

        // upload to cloudinary
        fetch('https://api.cloudinary.com/v1_1/nukucode/image/upload', {
            method: 'post',
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setPhoto(data.url);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div
            className="card input-field"
            style={{
                margin: '10px auto',
                maxWidth: '600px',
                padding: '20px',
                textAlign: 'center',
            }}
        >
            <input
                type="text"
                className="form-control"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                className="form-control"
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn blue">
                    <span>Upload Image</span>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button
                className="btn waves-effect wave-light"
                onClick={() => storeImage()}
            >
                Submit Post
            </button>
        </div>
    );
};

export default CreatePost;
