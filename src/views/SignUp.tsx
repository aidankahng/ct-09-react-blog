import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/esm/Form";
import { CategoryType, UserFormDataType } from "../types";
import { register } from "../lib/apiWrapper";
import { useNavigate } from "react-router-dom";

type SignUpProps = {
    flashMessage: (
        newMessage: string | undefined,
        newCategory: CategoryType | undefined
    ) => void;
};

export default function SignUp({ flashMessage }: SignUpProps) {
    const navigate = useNavigate();

    const [userFormData, setUserFormData] = useState<UserFormDataType>({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
    };

    // Added async as it will use a promise and await to get the promise
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(userFormData);

        let response = await register(userFormData);
        if (response.error) {
            flashMessage(response.error, "danger");
        } else {
            let newUser = response.data!;
            flashMessage(
                `Congrats ${newUser.firstName} ${newUser.lastName}! Your account ${newUser.username} has been created.`,
                "success"
            );
            navigate("/");
        }
    };

    const disableSubmit: boolean =
        !userFormData.email.includes("@") ||
        userFormData.firstName.length < 1 ||
        userFormData.lastName.length < 1 ||
        userFormData.username.length < 1 ||
        userFormData.password.length < 6 ||
        userFormData.password !== userFormData.confirmPassword;
    // To use regex, !/pattern/.test(string) like:  !/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*\!\?])(?=.*[a-zA-Z]).{8,16}$/.test(userFormData.password)

    return (
        <>
            <h1 className="text-center">Sign Up Here</h1>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Label htmlFor="firstName">First Name</Form.Label>
                        <Form.Control
                            id="firstName"
                            name="firstName"
                            placeholder="Enter First Name"
                            value={userFormData.firstName}
                            onChange={handleInputChange}
                        />

                        <Form.Label htmlFor="lastName">Last Name</Form.Label>
                        <Form.Control
                            id="lastName"
                            name="lastName"
                            placeholder="Enter Last Name"
                            value={userFormData.lastName}
                            onChange={handleInputChange}
                        />

                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter Email"
                            value={userFormData.email}
                            onChange={handleInputChange}
                        />

                        <Form.Label htmlFor="username">Username</Form.Label>
                        <Form.Control
                            id="username"
                            name="username"
                            placeholder="Enter username"
                            value={userFormData.username}
                            onChange={handleInputChange}
                        />

                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            value={userFormData.password}
                            onChange={handleInputChange}
                        />

                        <Form.Label htmlFor="confirmPassword">
                            Confirm Password
                        </Form.Label>
                        <Form.Control
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={userFormData.confirmPassword}
                            onChange={handleInputChange}
                        />

                        <Button
                            type="submit"
                            variant="outline-primary"
                            className="w-100 mt-3"
                            disabled={disableSubmit}
                        >
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
