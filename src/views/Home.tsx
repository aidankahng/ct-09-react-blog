import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { CategoryType, PostFormDataType, PostType, UserType } from "../types";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { createPost, getAllPosts } from "../lib/apiWrapper";

type HomeProps = {
    isLoggedIn: boolean,
    currentUser: UserType,
    flashMessage: (
        newMessage: string | undefined,
        newCategory: CategoryType | undefined
    ) => void;
};


type Sorting = {
    idAsc: (a: PostType, b: PostType) => number;
    idDesc: (a: PostType, b: PostType) => number;
    titleAsc: (a: PostType, b: PostType) => number;
    titleDesc: (a: PostType, b: PostType) => number;
};

export default function Home({isLoggedIn, currentUser, flashMessage}: HomeProps) {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [fetchPostData, setFetchPostData] = useState(true)
    
    useEffect(() => {
        // Code here will run ater EVERY render
        // console.log("The use effect function is running")
        async function fetchData(){
            const response = await getAllPosts();
            if (response.data){
                let posts = response.data;
                posts.sort( (a, b) => (new Date(a.dateCreated) > new Date(b.dateCreated)) ? -1 : 1)
                setPosts(posts)
            }
        }

        fetchData();
    }, [fetchPostData])

    

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        const sortFunctions: Sorting = {
            idAsc: (a: PostType, b: PostType) => a.id - b.id,
            idDesc: (a: PostType, b: PostType) => b.id - a.id,
            titleAsc: (a: PostType, b: PostType) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1),
            titleDesc: (a: PostType, b: PostType) => (b.title.toLowerCase() > a.title.toLowerCase() ? 1 : -1),
        };
        // console.log(sortFunctions[e.target.value as keyof Sorting])
        let func = sortFunctions[e.target.value as keyof Sorting];
        let newSorted = [...posts].sort(func);
        setPosts(newSorted);

        // posts.sort(sortFunctions[e.target.value as keyof Sorting])
        // setPosts(posts.slice(0,))
    };
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
        console.log(e.target.value);
        console.log(
            posts.filter((p) => p.title.toLowerCase().includes(searchTerm))
        );
    };

    const addNewPost = async (newPostData: PostFormDataType) => {
        const token = localStorage.getItem('token') || '';
        const response = await createPost(token, newPostData)
        if (response.error) {
            flashMessage(response.error, 'danger')
        } else if (response.data) {
            flashMessage(`Successfully created post ${newPostData.title}`, 'success')
            setShowForm(false)
            setFetchPostData(!fetchPostData)
        }
        
    }

    



    return (
        <>
            <h1 style={{textAlign:'center'}}>
                {isLoggedIn && currentUser?.id ? `Hello ${currentUser?.firstName} ${currentUser?.lastName}` : `Welcome to the blog`}
            </h1>
            <Row>
                <Col xs={12} md={8}>
                    <Form.Control
                        value={searchTerm}
                        placeholder="Search Posts"
                        onChange={handleSearch}
                    />
                </Col>
                <Col>
                    <Form.Select onChange={handleSelectChange}>
                        <option>Choose Sorting Option</option>
                        <option value="idAsc">Sort By ID ASC</option>
                        <option value="idDesc">Sort By ID DESC</option>
                        <option value="titleAsc">Sort By Title ASC</option>
                        <option value="titleDesc">Sort By Title DESC</option>
                    </Form.Select>
                </Col>
                {isLoggedIn && <Col>
                    <Button className='w-100' variant={showForm ? 'danger' : 'success'} onClick={() => setShowForm(!showForm)}>{showForm ? 'Hide Form' : 'Add Post+'}</Button>
                </Col>}
            </Row>
            { showForm && <PostForm addNewPost={addNewPost}/>}
            {posts
                .filter((p) => p.title.toLowerCase().includes(searchTerm))
                .map((post) => (
                    <PostCard key={post.id} post={post} currentUser={currentUser}/>
                ))}
        </>
    );
}
