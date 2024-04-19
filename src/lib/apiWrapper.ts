import axios from "axios";
import { UserType, UserFormDataType, PostType, TokenType, PostFormDataType } from "../types";

// brian's: https://kekambas-142-flask-blog-api.onrender.com
// mine: https://ct-06-flask-blog-api.onrender.com

// use Brians:
const baseURL: string = "https://kekambas-142-flask-blog-api.onrender.com";

// Use mine:
// const baseURL:string = 'https://ct-06-flask-blog-api.onrender.com';

const userEndpoint: string = "/users";
const postEndpoint: string = "/posts";
const tokenEndpoint: string = "/token";

// create an axios instance with no auth token or login info
const apiClientNoAuth = () =>
    axios.create({
        baseURL: baseURL,
    });

const apiClientBasicAuth = (username: string, password: string) =>
    axios.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Basic ${btoa(username + ":" + password)}`,
        },
    });

const apiClientTokenAuth = (token: string) =>
    axios.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

type APIResponse<T> = {
    data?: T;
    error?: string;
};

// Each function will return an API response
// It will either be the data we are looking for or some sort of error

async function getAllPosts(): Promise<APIResponse<PostType[]>> {
    let data;
    let error;
    try {
        const response = await apiClientNoAuth().get(postEndpoint);
        data = response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.message;
        } else {
            error = "Something went wrong";
        }
    }
    return { data, error };
}

async function register(
    newUserData: UserFormDataType
): Promise<APIResponse<UserType>> {
    let data;
    let error;
    try {
        const response = await apiClientNoAuth().post(
            userEndpoint,
            newUserData
        );
        data = response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data.error;
        } else {
            error = "Something went wrong";
        }
    }
    return { data, error };
}

async function login(
    username: string,
    password: string
): Promise<APIResponse<TokenType>> {
    let data;
    let error;
    try {
        const response = await apiClientBasicAuth(username, password).get(
            tokenEndpoint
        );
        data = response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data.error;
        } else {
            error = "Something went wrong";
        }
    }
    return { data, error };
}

async function getMe(token: string): Promise<APIResponse<UserType>> {
    let data;
    let error;
    try {
        const response = await apiClientTokenAuth(token).get(
            userEndpoint + "/me"
        );
        data = response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data.error;
        } else {
            error = "Something went off here";
        }
    }
    return { data, error };
}

async function createPost(token: string, postData:PostFormDataType): Promise<APIResponse<PostType>> {
    let data;
    let error;
    try {
        const response = await apiClientTokenAuth(token).post(postEndpoint, postData)
        data = response.data
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data.error;
        } else {
            error = "Something went off here";
        }
    }
    return { data, error };
}


async function getPostById(postId:string|number): Promise<APIResponse<PostType>> {
    let data;
    let error;
    try {
        const response = await apiClientNoAuth().get(postEndpoint + '/' + postId)
        data = response.data
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data?.error || `Post with ID ${postId} does not exist`
        } else {
            error = "Something went off here";
        }
    }
    return { data, error };
}

async function editPostById(postId:string|number, token:string, editedPostData:PostFormDataType): Promise<APIResponse<PostType>> {
    let data;
    let error;
    try {
        const response = await apiClientTokenAuth(token).put(postEndpoint + '/' + postId, editedPostData)
        data = response.data
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data?.error || `Post with ID ${postId} does not exist`
        } else {
            error = "Something went off here";
        }
    }
    return { data, error };
}

async function deletePostById(postId:string|number, token:string): Promise<APIResponse<string>> {
    let data;
    let error;
    try {
        const response = await apiClientTokenAuth(token).delete(postEndpoint + '/' + postId)
        data = response.data.success
    } catch (err) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data?.error || `Post with ID ${postId} does not exist`
        } else {
            error = "Something went off here";
        }
    }
    return { data, error };
}





export { register, getAllPosts, login, getMe, createPost, getPostById, editPostById, deletePostById };
