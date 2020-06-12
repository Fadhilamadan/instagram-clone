import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Home = () => {
    const [data, setData] = useState([]);
    const { state } = useContext(UserContext);

    useEffect(() => {
        fetch('/allPost', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setData(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const likePost = (id) => {
        fetch('/likePost', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });

                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const unlikePost = (id) => {
        fetch('/unlikePost', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });

                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="home">
            {data.map((item) => {
                return (
                    <div key={item._id} className="card home-card">
                        <h5>{item.postedBy.name}</h5>
                        <div className="card-image">
                            <img src={item.photo} alt="Picture" />
                        </div>
                        <div className="card-content">
                            <i
                                className="material-icons"
                                style={{ color: 'red' }}
                            >
                                favorite
                            </i>
                            {item.likes.includes(state._id) ? (
                                <i
                                    className="material-icons"
                                    onClick={() => unlikePost(item._id)}
                                >
                                    thumb_down
                                </i>
                            ) : (
                                <i
                                    className="material-icons"
                                    onClick={() => likePost(item._id)}
                                >
                                    thumb_up
                                </i>
                            )}
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            <input type="text" placeholder="add comment" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Home;
