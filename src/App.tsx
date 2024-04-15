import React, { useState } from "react";

function App() {
    // return React.createElement('h1', {}, 'This is a title');
    //Without using JSX
    // return React.createElement('div', {}, React.createElement('h1', {}, 'Hello World'), React.createElement('h2', {}, 'This is some useless text'))
    // Using JSX below
    // return (
    //   <div>
    //     <h1>Hello There</h1>
    //     <h2>This is some useless text</h2>
    //   </div>
    // )

    // Hook (setup using useState)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const toggleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
    }


    const posts = [
        { id: 1, title: 'Happy'},
        { id: 2, title: 'Meh'},
        { id: 3, title: 'Sad'},
    ]



    const firstName:string = 'Johnathan';
    
    return (
        <div>
            <h2>
                The name is: {firstName.toUpperCase()}
            </h2>
            <p>{isLoggedIn ? 'Welcome Back' : 'Please Log In'}</p>
            <button onClick={toggleLogin}>LOGIN BTN</button>
            <br />
            <input type="text" name="TestingInput" id="" placeholder="input random shit here" autoFocus/>
            {posts.map((post) => <p>{`${post.id} -- ${post.title}`}</p> )}
        </div>
    )



}

export default App;
