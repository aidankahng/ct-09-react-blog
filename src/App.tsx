import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Home from "./views/Home";
import SignUp from "./views/SignUp";
import Login from "./views/Login";
import EditPost from "./views/EditPost";
import { Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import AlertMessage from "./components/AlertMessage";
import { CategoryType, UserType } from "./types";
import { getMe } from "./lib/apiWrapper";


function App() {

    // Hook (setup using useState)
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') && new Date(localStorage.getItem('tokenExp')||0) > new Date() ? true : false);
    const [loggedInUser, setLoggedInUser] = useState<UserType|null>(null)
    
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<CategoryType | undefined>(undefined);


    useEffect(() => {
        console.log('this is the App effect')
        async function getLoggedInUser() {
            if (isLoggedIn) {
                const token = localStorage.getItem('token') || ''
                const response = await getMe(token)
                if (response.data) {
                    setLoggedInUser(response.data)
                    localStorage.setItem('currentUser', JSON.stringify(response.data))
                } else {
                    setIsLoggedIn(false)
                    console.log(response.error)
                }
            }
        }
        getLoggedInUser();     
    },[isLoggedIn])


    // Want to store the token on the BROWSER, not on a state
    // can use localstorage or cookies
    // localStorage.setItem('key', value)
    

    const flashMessage = (newMessage:string | undefined, newCategory: CategoryType | undefined) => {
        setMessage(newMessage);
        setCategory(newCategory);
        setTimeout(() => {
            if (newMessage && newCategory) {
                flashMessage(undefined, undefined)
            }
        }, 20000)
    }

    const logUserIn = () => {
        setIsLoggedIn(true)
    }

    const logUserOut = () => {
        setIsLoggedIn(false);
        setLoggedInUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExp');
        localStorage.removeItem('currentUser');
    }

    return (
        <div>
            <Navigation isLoggedIn={isLoggedIn} logUserOut={logUserOut} />

            <br />

            <Container>
                {message && <AlertMessage message={message} category={category} flashMessage={flashMessage} />}
                <Routes>
                    <Route path='/' element={<Home isLoggedIn={isLoggedIn} currentUser={loggedInUser!} flashMessage={flashMessage} />}/>
                    <Route path='/signup' element={<SignUp flashMessage={flashMessage} />}/>
                    <Route path='/login' element={<Login flashMessage={flashMessage} logUserIn={logUserIn} />}/>
                    <Route path="/edit/:postId" element={<EditPost flashMessage={flashMessage} />} />
                </Routes>

                
            </Container>
        </div>
    );
}

export default App;
