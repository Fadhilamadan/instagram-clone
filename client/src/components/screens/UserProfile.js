import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';

const Profile = () => {
    const { state, dispatch } = useContext(UserContext);
    const [userProfile, setProfile] = useState(null);
    const { userId } = useParams();

    const [buttonFollow, setButtonFollow] = useState(
        state ? !state.following.includes(userId) : true
    );

    useEffect(() => {
        fetch(`/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setProfile(result.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const followUser = () => {
        fetch('/follow', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
            body: JSON.stringify({
                followId: userId,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        following: result.data.following,
                        followers: result.data.followers,
                    },
                });

                localStorage.setItem('user', JSON.stringify(result.data));

                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [
                                ...prevState.user.followers,
                                result.data._id,
                            ],
                        },
                    };
                });

                setButtonFollow(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
            body: JSON.stringify({
                unfollowId: userId,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        following: result.data.following,
                        followers: result.data.followers,
                    },
                });

                localStorage.setItem('user', JSON.stringify(result.data));

                setProfile((prevState) => {
                    const deleteFollower = prevState.user.followers.filter(
                        (item) => item !== result.data._id
                    );

                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: deleteFollower,
                        },
                    };
                });

                setButtonFollow(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {userProfile ? (
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
                                src={userProfile.user.photo}
                                alt="Image"
                            />
                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h6>{userProfile.user.email}</h6>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                <h6>{userProfile.posts.length} Posts</h6>
                                <h6 style={{ margin: '10px' }}>
                                    {userProfile.user.followers.length}{' '}
                                    Followers
                                </h6>
                                <h6 style={{ margin: '10px' }}>
                                    {userProfile.user.following.length}{' '}
                                    Following
                                </h6>
                            </div>
                            {buttonFollow ? (
                                <button
                                    className="btn waves-effect wave-light"
                                    onClick={() => followUser()}
                                >
                                    Follow
                                </button>
                            ) : (
                                <button
                                    className="btn waves-effect wave-light"
                                    onClick={() => unfollowUser()}
                                >
                                    Unfollow
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="gallery">
                        {userProfile.posts.map((item) => {
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
            ) : (
                <h2>Loading...</h2>
            )}
        </>
    );
};

export default Profile;
