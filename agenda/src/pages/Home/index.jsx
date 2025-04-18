import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext'; // Importe o contexto de autenticação
import { WelcomeText, Container, OverlayText, Container_texto, AgendarButton, RedirectMessage } from './style'; // Estilos

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Obtém o usuário do contexto
    const [showMessage, setShowMessage] = useState(false);

    const handleAgendarClick = () => {
        if (user) {  // Se estiver logado, vai para a página de agendamento
            navigate('/Agendar');
        } else {
            setShowMessage(true);  // Se não estiver logado, exibe a mensagem
            setTimeout(() => {
                navigate('/Entrar');  // Redireciona para a página de login após 1500 ms
            }, 2500);
        }
    };

    return (
        <Container>
            <Header />
            <Container_texto>
                {showMessage && (
                    <RedirectMessage>
                        Você não está logado. Redirecionando para o login...
                    </RedirectMessage>
                )}
                <OverlayText>Bem-Vindo, Alunos!</OverlayText>
                <WelcomeText>
                    Bem-vindo ao nosso universo fitness! Agende seu horário de forma simples e rápida.
                </WelcomeText>
                <AgendarButton onClick={handleAgendarClick}>Agendar Agora</AgendarButton>
            </Container_texto>
            <Footer />
        </Container>
    );
};

export default Home;
