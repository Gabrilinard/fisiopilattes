import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { AgendarButton, Container, Container_texto, OverlayText, WelcomeText } from './style';

const Home = () => {
    const navigate = useNavigate();

    const handleAgendarClick = () => {
        navigate('/profissionais');
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
