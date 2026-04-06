import React from 'react'
import { FaUser } from "react-icons/fa";
import { useState, useEffect } from 'react';
import './best.css'


const Best = () => {

    const [maxUser, setMaxUser] = useState(null);
    const [maxUserT, setMaxUserT] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch("http://localhost:8000/api/auth/users/",
                   {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },}
                );
                const response2 = await fetch("http://localhost:8000/api/members/",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },}
                );
                if (!response.ok || !response2.ok) {
                    throw new Error("Failed to fetch users or members");
                }

                const users = await response.json();
                const members = await response2.json();

                if (users.length > 0) {
                    const userWithMaxBonnes = users.reduce((max, current) =>
                        current.bonnes > max.bonnes ? current : max
                    );
                    setMaxUser(userWithMaxBonnes);
                }

                if (members.length > 0) {
                    const memberWithMaxBonnes = members.reduce((max, current) =>
                        current.bonnes > max.bonnes ? current : max
                    );
                    setMaxUserT(memberWithMaxBonnes);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <div className='best-cnt'>
                <div className='best-box'>
                    <FaUser />
                    <h2>Top Client</h2>
                    <h1>{maxUser.username}</h1>
                </div>
                <div className='best-box'>
                    <FaUser />
                    <h2>Top Member</h2>
                    <h1>{maxUserT.name}</h1>
                </div>
            </div>
        </div>
    )
}

export default Best