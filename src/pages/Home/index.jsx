import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { AgendarButton, Container, Container_texto, OverlayText, WelcomeText } from './style';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleAgendarClick = () => {
        if (user) {
            navigate('/profissionais');
        } else {
            navigate('/Entrar');
        }
    };

    return (
        <Container>
            <Header />
            <Container_texto>
                <OverlayText>Bem-Vindo!</OverlayText>
                <WelcomeText>
                    Bem-vindo à nossa plataforma de saúde! Agende sua consulta de forma simples e rápida.
                </WelcomeText>
                <AgendarButton onClick={handleAgendarClick}>Agendar Agora</AgendarButton>
            </Container_texto>
            
            <Footer />
        </Container>
    );
};

export default Home;
