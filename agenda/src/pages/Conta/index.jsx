import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: rgb(227, 228, 222);
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10vh;
`;

const ContentWrapper = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 500px;
  height: 200px;
`;

const LogoutButton = styled.button`
  padding: 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  &:hover {
    background-color: #c82333;
  }
`;

const Conta = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Você tem certeza que deseja sair?");
    if (confirmLogout) {
      logout();
      navigate('/');
    }
  };

  return (
    <PageWrapper>
      <Header />
      <Container>
        <ContentWrapper>
          <h2>Olá, {user?.nome}</h2>
          <p>Email: {user?.email}</p>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </ContentWrapper>
      </Container>
      <Footer />
    </PageWrapper>
  );
};

export default Conta;
