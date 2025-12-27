import { useNavigate } from 'react-router-dom';
import pngLogoAgende from '../../assets/pnglogoagende.png';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { AgendarButton, Container, Container_texto, OverlayText, WelcomeContainer, WelcomeLogo, WelcomeText } from './style';

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
                <WelcomeContainer>
                    <OverlayText>Bem-Vindo ao</OverlayText>
                    <WelcomeLogo src={pngLogoAgende} alt="Logo Agende Aqui" />
                    <OverlayText>!</OverlayText>
                </WelcomeContainer>
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
