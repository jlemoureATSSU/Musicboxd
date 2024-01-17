import React, {} from 'react'
import Card from 'react-bootstrap/Card';

const Landingpage = () => {
    
    return (
        <div className='main'>
            <Card className="text-center">
                <Card.Header>Musicboxd</Card.Header>
                <Card.Body>
                    <Card.Title>Welcome to Musicboxd!</Card.Title>
                    <Card.Text>
                        Musicboxd is a music database that allows you to search for albums and artists.
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">Created by: Team 1</Card.Footer>
            </Card>
        </div>
    )
}

export default Landingpage