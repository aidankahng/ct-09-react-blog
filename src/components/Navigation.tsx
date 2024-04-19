import { useState } from "react"
import Button from "react-bootstrap/esm/Button"
import Container from "react-bootstrap/esm/Container"
import Nav from "react-bootstrap/esm/Nav"
import Navbar from "react-bootstrap/esm/Navbar"

import { Link } from "react-router-dom"

type NavigationProps = {
    isLoggedIn: boolean,
    logUserOut: () => void;
}


export default function Navigation({ isLoggedIn, logUserOut }: NavigationProps) {
    const [backgroundTheme, setBackgroundTheme] = useState<string>('dark')

    return (
        <>
        <Navbar expand='lg' data-bs-theme={backgroundTheme} bg={backgroundTheme}>
            <Container fluid>
                <Navbar.Brand as={Link} to='/'>Kekambas Blog</Navbar.Brand>
                <Navbar.Toggle aria-controls='nav-collapse' />
                <Navbar.Collapse id='nav-collapse'>
                    <Nav className='me-auto'>
                        {isLoggedIn ? (
                            <>
                                <Nav.Link href='/'>Create Post</Nav.Link>
                                <Nav.Link href='/' onClick={logUserOut}>Log Out</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to='/signup'>Sign Up</Nav.Link>
                                <Nav.Link as={Link} to='/login'>Log In</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        <Button onClick={() => setBackgroundTheme(backgroundTheme === 'light' ? 'dark' : 'light')}>Change Nav Color</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}