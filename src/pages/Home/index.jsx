import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { AgendarButton, Container, Container_texto, EmpresaCard, EmpresaInfo, EmpresaNome, EmpresasGrid, EmpresasSection, EmpresasTitle, OverlayText, RedirectMessage, VerMaisButton, WelcomeText } from './style';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showMessage, setShowMessage] = useState(false);
    const [empresas, setEmpresas] = useState([]);
    const [empresasExibidas, setEmpresasExibidas] = useState(10);
    const [isCliente, setIsCliente] = useState(false);

    useEffect(() => {
        const buscarEmpresas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/empresas');
                setEmpresas(response.data);
            } catch (error) {
                console.error('Erro ao buscar empresas:', error);
            }
        };
        buscarEmpresas();
    }, []);

    useEffect(() => {
        const verificarTipoUsuario = async () => {
            if (user?.id) {
                if (user.tipoUsuario === 'cliente' || !user.tipoUsuario) {
                    setIsCliente(true);
                    if (!user.tipoUsuario) {
                        const updatedUser = { ...user, tipoUsuario: 'cliente' };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                    return;
                }
                
                try {
                    const response = await axios.get(`http://localhost:3000/user/${user.id}`);
                    const tipoUsuario = response.data.tipoUsuario || 'cliente';
                    if (tipoUsuario === 'cliente') {
                        setIsCliente(true);
                        // Atualiza o user no contexto e localStorage
                        const updatedUser = { ...user, tipoUsuario: 'cliente' };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    } else {
                        setIsCliente(false);
                    }
                } catch (error) {
                    console.error('Erro ao buscar tipo de usuário:', error);
                    // Em caso de erro, assume que é cliente por padrão
                    setIsCliente(true);
                }
            } else {
                setIsCliente(false);
            }
        };
        
        verificarTipoUsuario();
    }, [user]);

    const handleAgendarClick = () => {
        if (user) {  
            navigate('/Agendar');
        } else {
            setShowMessage(true);  
            setTimeout(() => {
                navigate('/Entrar');  
            }, 2500);
        }
    };

    const handleVerMais = () => {
        setEmpresasExibidas(prev => prev + 10);
    };

    const empresasParaExibir = empresas.slice(0, empresasExibidas);
    const temMaisEmpresas = empresas.length > empresasExibidas;

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
                {isCliente && user && (
                    <AgendarButton onClick={handleAgendarClick}>Agendar Agora</AgendarButton>
                )}
            </Container_texto>
            
            {isCliente ? (
                <EmpresasSection>
                    <EmpresasTitle>Empresas Parceiras</EmpresasTitle>
                    {empresas.length > 0 ? (
                        <>
                            <EmpresasGrid>
                                {empresasParaExibir.map((empresa, index) => (
                                    <EmpresaCard key={index}>
                                        <EmpresaNome>{empresa.nomeEmpresa}</EmpresaNome>
                                        <EmpresaInfo>
                                            {empresa.quantidadeProfissionais} {empresa.quantidadeProfissionais === 1 ? 'profissional' : 'profissionais'}
                                        </EmpresaInfo>
                                    </EmpresaCard>
                                ))}
                            </EmpresasGrid>
                            {temMaisEmpresas && (
                                <VerMaisButton onClick={handleVerMais}>
                                    Ver Mais
                                </VerMaisButton>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '40px', width: '100%' }}>
                            <WelcomeText style={{ textAlign: 'center', margin: '0 auto' }}>
                                Nenhuma empresa cadastrada no momento.
                            </WelcomeText>
                        </div>
                    )}
                </EmpresasSection>
            ) : (
                empresas.length > 0 && (
                    <EmpresasSection>
                        <EmpresasTitle>Empresas Parceiras</EmpresasTitle>
                        <EmpresasGrid>
                            {empresas.map((empresa, index) => (
                                <EmpresaCard key={index}>
                                    <EmpresaNome>{empresa.nomeEmpresa}</EmpresaNome>
                                    <EmpresaInfo>
                                        {empresa.quantidadeProfissionais} {empresa.quantidadeProfissionais === 1 ? 'profissional' : 'profissionais'}
                                    </EmpresaInfo>
                                </EmpresaCard>
                            ))}
                        </EmpresasGrid>
                    </EmpresasSection>
                )
            )}
            
            <Footer />
        </Container>
    );
};

export default Home;
