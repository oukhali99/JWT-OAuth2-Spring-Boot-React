import { Container, Button } from "react-bootstrap";

const Home = () => {
    return (
        <Container className="m-4 text-center">
            <h1 className="display-4 mb-4">Welcome to JWT OAuth2 Demo</h1>
            <p className="lead mb-4">
                A full-stack authentication system with OAuth2 and JWT tokens using Spring Boot and React.
            </p>
            <Button 
                variant="primary" 
                href="https://github.com/oukhali99/JWT-OAuth2-Spring-Boot-React" 
                target="_blank"
                size="lg"
            >
                View GitHub Repository
            </Button>
        </Container>
    );
};

export default Home;
