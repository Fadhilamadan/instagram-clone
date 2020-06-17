import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
    const [myPhotos, setPhotos] = useState([]);
    const [image, setImage] = useState('');
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        fetch('/myPost', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setPhotos(result.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (image) {
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
                    fetch('/updatePhoto', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:
                                'Bearer ' + localStorage.getItem('jwt-token'),
                        },
                        body: JSON.stringify({
                            photo: data.url,
                        }),
                    })
                        .then((res) => res.json())
                        .then((result) => {
                            setPhotos(result.data);

                            localStorage.setItem(
                                'user',
                                JSON.stringify({
                                    ...state,
                                    photo: result.data.photo,
                                })
                            );

                            dispatch({
                                type: 'UPDATE-PIC',
                                payload: result.data.photo,
                            });
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [image]);

    const updatePhoto = (photo) => {
        setImage(photo);
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0px auto' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    margin: '18px 0px',
                    borderBottom: '1px solid',
                }}
            >
                <div>
                    <img
                        style={{
                            width: '160px',
                            height: '160px',
                            borderRadius: '80px',
                        }}
                        src={state ? state.photo : null}
                        alt="Image"
                    />
                </div>
                <div>
                    <h4>{state ? state.name : 'loading...'}</h4>
                    <h6>{state ? state.email : 'loading...'}</h6>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <h6>{myPhotos.length} Posts</h6>
                        <h6 style={{ margin: '10px' }}>
                            {state ? state.followers.length : '0'} Followers
                        </h6>
                        <h6 style={{ margin: '10px' }}>
                            {state ? state.following.length : '0'} Following
                        </h6>
                    </div>
                    <div className="file-field input-field">
                        <div className="btn blue">
                            <span>Update Picture</span>
                            <input
                                type="file"
                                onChange={(e) => updatePhoto(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="gallery">
                {myPhotos.map((item) => {
                    return (
                        <img
                            className="item"
                            key={item._id}
                            src={item.photo}
                            alt={item.title}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Profile;
