import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const StyledNavbar = styled(Navbar)`
  background-color: rgb(227, 228, 222);
  height: 110px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledNavLeft = styled(Nav)`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  position: absolute;
  left: 20px;

  .nav-link {
    color: green !important;
    font-size: 1.1rem;
    font-family: 'Figtree', sans-serif;
  }

  .nav-link:hover {
    color: rgb(40, 40, 40) !important;
  }

  @media (max-width: 768px) {
  }
`;

const StyledNavRight = styled(Nav)`
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  position: absolute;
  right: 20px;

  .nav-link {
    color: rgb(30, 30, 30) !important;
    font-size: 1.1rem;
    font-family: 'Figtree', sans-serif;
  }

  .nav-link:hover {
    color: #28a745 !important;
  }

  @media (max-width: 768px) {
    display: none; /* Esconde os links principais em telas pequenas */
  }
`;

const StyledBrand = styled(Navbar.Brand)`
  color: rgb(57, 57, 57) !important;
  font-size: 1.7rem;
  font-weight: bold;
  text-align: center;
  flex-grow: 0;
  margin-left: auto;
  font-family: 'Figtree', sans-serif;
  margin-right: auto;
`;

const StyledButton = styled(Button)`
  background-color: rgb(56, 128, 58);
  border-radius: 50px;
  color: white;
  padding: 15px 30px;
  border: none;

  &:hover {
    background-color: #4caf50;
  }
`;

const StyledDropdownToggle = styled(Dropdown.Toggle)`
  color: rgb(57, 57, 57) !important;
  font-size: 1.1rem;
  font-family: 'Figtree', sans-serif;
  text-decoration: none;

  &:hover {
    color: rgb(95, 94, 94) !important;
  }
`;

const Sidebar = styled.div`
  background-color: rgb(227, 228, 222);
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100vh;
  padding: 20px;
  display: ${({ show }) => (show ? 'block' : 'none')};
  transition: transform 0.3s ease;
  z-index: 999;

  @media (min-width: 769px) {
    display: none; /* Esconde a sidebar em telas maiores */
  }
`;

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controle do estado do Navbar.Toggle
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Pegando o usuário autenticado do contexto

  const handleAgendarClick = () => {
    navigate('/Agendar');
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    setIsOpen(!isOpen); // Alterar o estado do hambúrguer
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        showSidebar
      ) {
        setShowSidebar(false); // Fecha a sidebar
        setIsOpen(false); // Fecha o hambúrguer
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidebar]);

  const handleNavigation = (link) => {
    setShowSidebar(false); // Fechar a sidebar ao clicar em um link
    setIsOpen(false); // Fechar o hambúrguer ao clicar em um link
    navigate(link);
  };

 return (
    <StyledNavbar expand="lg">
      <Container>
        <StyledNavLeft>
          <StyledBrand onClick={() => navigate("/")}>Agende Aqui</StyledBrand>
        </StyledNavLeft>

        <Navbar.Toggle
        aria-controls="navbar-nav"
        onClick={toggleSidebar}
        style={{ position: 'absolute', right: '20px' }}
        expanded={isOpen.toString()} // Converte boolean para string
        />



          <Sidebar ref={sidebarRef} show={showSidebar ? 'true' : undefined}>
          <Nav className="flex-column">
            <Nav.Link onClick={() => handleNavigation("/")}>Home</Nav.Link>

            {user ? (
              <Nav.Link onClick={() => handleNavigation("/Conta")}>Conta</Nav.Link>
            ) : (
              <Nav.Link onClick={() => handleNavigation("/Entrar")}>Entrar</Nav.Link>
            )}
          </Nav>
        </Sidebar>

        <Navbar.Collapse id="navbar-nav" className={showSidebar ? 'd-none' : ''}>
          <StyledNavRight>
            <Nav.Link onClick={() => handleNavigation("/")}>Home</Nav.Link>

            {user ? (
              <Nav.Link onClick={() => handleNavigation("/Conta")}>Conta</Nav.Link>
            ) : (
              <Nav.Link onClick={() => handleNavigation("/Entrar")}>Entrar</Nav.Link>
            )}
          </StyledNavRight>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;