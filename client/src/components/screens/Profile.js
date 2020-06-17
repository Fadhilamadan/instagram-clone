import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
    const [myPhotos, setPhotos] = useState([]);
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
                        src="https://images.unsplash.com/photo-1506919258185-6078bba55d2a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1115&q=80"
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
