import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/esm/Form";
import { CategoryType, UserFormDataType } from "../types";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/apiWrapper";

type LoginProps = {
    flashMessage: (
        newMessage: string | undefined,
        newCategory: CategoryType | undefined
    ) => void;
    logUserIn: () => void;
};

export default function Login({ flashMessage, logUserIn }: LoginProps) {
    const navigate = useNavigate();

    const [loginFormData, setLoginFormData] = useState<Partial<UserFormDataType>>({
        username: "",
        password: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
    };

    // Added async as it will use a promise and await to get the promise
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(loginFormData);

        let response = await login(loginFormData.username!, loginFormData.password!)
        if (response.error) {
            flashMessage(response.error, "danger");
        } else {
            let tokenData = response.data!;
            localStorage.setItem('token', tokenData.token);
            localStorage.setItem('tokenExp', tokenData.tokenExpiration);
            logUserIn();
            flashMessage(
                `You have successfully logged in as ${loginFormData.username}`,
                "success"
            );
            navigate("/");
        }
    };


    return (
        <>
            <h1 className="text-center">Log In Here</h1>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Label htmlFor="username">Username</Form.Label>
                        <Form.Control
                            id="username"
                            name="username"
                            placeholder="Enter username"
                            value={loginFormData.username}
                            onChange={handleInputChange}
                        />

                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            value={loginFormData.password}
                            onChange={handleInputChange}
                        />

                        <Button
                            type="submit"
                            variant="outline-primary"
                            className="w-100 mt-3"
                        >
                            Log In
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
