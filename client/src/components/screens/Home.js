import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

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

    const createComment = (text, postId) => {
        fetch('/comment', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
            body: JSON.stringify({
                text: text,
                postId: postId,
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

    const deletePost = (postId) => {
        fetch(`/deletePost/${postId}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                const newData = data.filter((item) => {
                    return item._id !== result.data._id;
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
                        <h5>
                            <Link
                                to={
                                    item.postedBy._id !== state._id
                                        ? '/profile/' + item.postedBy._id
                                        : '/profile/'
                                }
                            >
                                {item.postedBy.name}
                            </Link>
                            {item.postedBy._id === state._id && (
                                <i
                                    className="material-icons"
                                    style={{ float: 'right' }}
                                    onClick={() => deletePost(item._id)}
                                >
                                    delete
                                </i>
                            )}
                        </h5>
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
                            {item.comments.map((comment) => {
                                return (
                                    <h6 key={comment._id}>
                                        <span>{comment.postedBy.name}</span>
                                        <p>{comment.text}</p>
                                    </h6>
                                );
                            })}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    createComment(e.target[0].value, item._id);
                                }}
                            >
                                <input type="text" placeholder="add comment" />
                            </form>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Home;
