import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, editPostById, deletePostById } from "../lib/apiWrapper";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { CategoryType, PostFormDataType } from "../types";
import Modal from "react-bootstrap/esm/Modal";

type EditPostProps = {
    flashMessage: (message: string, category: CategoryType) => void;
};

export default function EditPost({ flashMessage }: EditPostProps) {
    const navigate = useNavigate();
    const { postId } = useParams();

    const [postToEditData, setPostToEditData] = useState<PostFormDataType>({
        title: "",
        body: "",
    });

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(event.target.name, event.target.value);
        setPostToEditData({
            ...postToEditData,
            [event.target.name]: event.target.value,
        });
    };


    const handleDeleteClick = async () => {
        const token = localStorage.getItem('token') || ''
        const response = await deletePostById(postId!, token);
        if (response.error) {
            flashMessage(response.error, 'danger')
        } else {
            flashMessage(`Post #${postId}: ${postToEditData.title} has been deleted`, 'info')
            navigate('/');
        }
    }



    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token') || ''
        const response = await editPostById(postId!, token, postToEditData)
        if (response.error) {
            flashMessage(response.error, 'danger');
        } else {
            flashMessage(`${response.data?.title} has been updated`, 'success');
            navigate('/');
        }
    }



    useEffect(() => {
        async function getPost() {
            let response = await getPostById(postId!);
            // console.log(response);
            if (response.data) {
                if ((JSON.parse(localStorage.getItem('currentUser')!)?.id || "") !== response.data.author.id) {
                    flashMessage("You do not have permission to edit this post", 'danger');
                    navigate('/');
                }
                setPostToEditData({
                    title: response.data.title,
                    body: response.data.body,
                });
            } else if (response.error) {
                flashMessage(response.error, "danger");
                navigate("/");
            } else {
                flashMessage("Something went wrong", "warning");
                navigate("/");
            }
        }
        getPost();
    }, [postId]);

    return (
        <>
            <Card className="my-3">
                <Card.Body>
                    <h3 className="text-center">Edit Post #{postId}</h3>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Label>Post Title</Form.Label>
                        <Form.Control
                            name="title"
                            placeholder="Enter New Post Title"
                            value={postToEditData.title}
                            onChange={handleInputChange}
                        />
                        <Form.Label>Post Body</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="body"
                            placeholder="Enter New Post Body"
                            value={postToEditData.body}
                            onChange={handleInputChange}
                        />
                        <Button
                            className="mt-3 w-100"
                            variant="secondary"
                            type="submit"
                        >
                            Submit Edits
                        </Button>
                        <Button
                            className="mt-3 w-100"
                            variant="danger"
                            onClick={openModal}
                        >
                            Delete Post
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Delete {postToEditData.title}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {postToEditData.title}? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeModal} variant='secondary'>Close</Button>
                    <Button onClick={handleDeleteClick} variant='danger'>Confirm Delete Post</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
