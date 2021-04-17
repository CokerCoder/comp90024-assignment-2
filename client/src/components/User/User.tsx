import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import axios from "axios";

const User = () => {

    const [users, setUsers] = useState<any[]>([]);
    const [diaplay, setDiaplay] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                '/users',
            );
            setUsers(result.data);
        };
        fetchData();
    }, []);

    return (
        <div className="User">
            <h2>CCC Project2</h2>
            <h3>Click the button to load the users</h3>
            <Button
                variant="contained"
                color="primary"
                onClick={()=>{
                setDiaplay(true)
                console.log(users)}
                }
            >
                load
            </Button>

            {diaplay===true?(<div>
                {users.map(user => (
                    <li key={user.id}>
                        {user.studentID} {user.firstName} {user.lastName}
                    </li>
                ))}
            </div>):null}
        </div>
    );
}


export default User;
