import Button from "react-bootstrap/esm/Button";
import { PostType, UserType } from "../types"
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

type PostCardProps = {
    post: PostType,
    currentUser: UserType,
}

export default function PostCard({ post, currentUser }: PostCardProps) {
  return (
    <>
    <Card className='my-3' bg='primary' text='light'>
        <Card.Header>{post.dateCreated}</Card.Header>
        <Card.Body>    
            <Card.Title>{post.title}</Card.Title>
            <Card.Subtitle>By: {post.author.username}</Card.Subtitle>
            <Card.Text>{post.body}</Card.Text>
            {post.author.id === currentUser?.id && <Nav.Link as={Link} to={`/edit/${post.id}`} ><Button variant='light'>Edit Post</Button></Nav.Link>}
        </Card.Body>
    </Card>
    </>
  )
}