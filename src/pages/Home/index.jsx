import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pngLogoAgende from '../../assets/pnglogoagende.png';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { AgendarButton, ButtonsContainer, Container, Container_texto, MinhasConsultasButton, OverlayText, WelcomeContainer, WelcomeLogo, WelcomeText } from './style';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [temConsultas, setTemConsultas] = useState(false);

    useEffect(() => {
        const verificarConsultas = async () => {
            if (user && user.id) {
                try {
                    const response = await axios.get(`http://localhost:3000/reservas?usuario_id=${user.id}`);
                    setTemConsultas(response.data && response.data.length > 0);
                } catch (error) {
                    console.error('Erro ao verificar consultas:', error);
                    setTemConsultas(false);
                }
            } else {
                setTemConsultas(false);
            }
        };

        verificarConsultas();
    }, [user]);

    const handleAgendarClick = () => {
        if (user) {
            navigate('/profissionais');
        } else {
            navigate('/Entrar');
        }
    };

    const handleMinhasConsultasClick = () => {
        navigate('/minhas-consultas');
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
                <ButtonsContainer>
                    <AgendarButton onClick={handleAgendarClick}>Agendar Agora</AgendarButton>
                    {temConsultas && (
                        <MinhasConsultasButton onClick={handleMinhasConsultasClick}>
                            Ver Minhas Consultas
                        </MinhasConsultasButton>
                    )}
                </ButtonsContainer>
            </Container_texto>
            
            <Footer />
        </Container>
    );
};

export default Home;
