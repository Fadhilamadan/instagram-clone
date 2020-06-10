import React, { useEffect, useState } from 'react';

const Home = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/allPost', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt-token'),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                setData(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

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
