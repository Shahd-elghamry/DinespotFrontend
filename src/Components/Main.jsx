
import { useState } from "react";
import Navbar from "./Navbar";
import LoginForm from "./Login";
import RegistrationForm from "./Register";
import Home from "./Home"; 
import Lists from "./Lists";
import Contact from "./Contact"; 

const Main = () => {
    let [page, setPage] = useState('home'); 
    let currentPage;

    if (page === 'Home') currentPage = <Home />;
    else if (page === 'Login') currentPage = <LoginForm navigate={setPage} />;
    else if (page === 'Register') currentPage = <RegistrationForm navigate={setPage} />;
    else if (page === 'Restaurant') currentPage = <Restaurant/>;
    else if (page === 'Contact') currentPage = <Contact />;

    return (
        <div>
            <Navbar navigate={setPage} />
            {currentPage}
        </div>
    );
}

export default Main;
