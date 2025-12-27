import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Container, EmpresaCard, EmpresaInfo, EmpresaNome, EmpresasGrid, EmpresasSection, InscreverButton, SearchContainer, SearchInput, TabButton, TabContainer, VerMaisButton, WelcomeText } from '../Home/style';

const EmpresasProfissionais = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { warning } = useNotification();
    const categorias = ['medico', 'dentista', 'nutricionista', 'fisioterapeuta', 'fonoaudiologo'];
    const categoriasLabels = {
        'medico': 'Médicos',
        'dentista': 'Odontologia',
        'nutricionista': 'Nutricionistas',
        'fisioterapeuta': 'Fisioterapeutas',
        'fonoaudiologo': 'Fonoaudiólogos'
    };
    const [profissionaisPorCategoria, setProfissionaisPorCategoria] = useState({});
    const [profissionaisExibidos, setProfissionaisExibidos] = useState({});
    const [categoriaAtiva, setCategoriaAtiva] = useState('medico');
    const [termoPesquisa, setTermoPesquisa] = useState('');

    useEffect(() => {
        const buscarProfissionaisPorCategoria = async () => {
            const profissionais = {};
            const exibidos = {};
            
            for (const categoria of categorias) {
                try {
                    const response = await axios.get(`http://localhost:3000/profissionais/${categoria}`);
                    console.log(`Dados recebidos para ${categoria}:`, response.data);
                    profissionais[categoria] = response.data;
                    exibidos[categoria] = 10;
                } catch (error) {
                    console.error(`Erro ao buscar ${categoria}:`, error);
                    profissionais[categoria] = [];
                    exibidos[categoria] = 10;
                }
            }
            
            setProfissionaisPorCategoria(profissionais);
            setProfissionaisExibidos(exibidos);
        };
        buscarProfissionaisPorCategoria();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleVerMais = () => {
        setProfissionaisExibidos(prev => ({
            ...prev,
            [categoriaAtiva]: (prev[categoriaAtiva] || 10) + 10
        }));
    };

    const handleInscrever = (nome, tipo) => {
        if (!user) {
            warning('Você precisa estar logado para agendar.');
            navigate('/Entrar');
            return;
        }
        navigate('/Agendar', { state: { nome, tipo } });
    };

    const profissionaisAtuais = profissionaisPorCategoria[categoriaAtiva] || [];
    
    const profissionaisFiltrados = termoPesquisa
        ? profissionaisAtuais.filter(profissional => 
            profissional.nomeCompleto.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
            profissional.tipoProfissional.toLowerCase().includes(termoPesquisa.toLowerCase())
          )
        : profissionaisAtuais;
    
    const profissionaisParaExibir = profissionaisFiltrados.slice(0, profissionaisExibidos[categoriaAtiva] || 10);
    const temMaisProfissionais = profissionaisFiltrados.length > (profissionaisExibidos[categoriaAtiva] || 10);

    return (
        <Container>
            <Header />
            
            <EmpresasSection>
                <TabContainer>
                    {categorias.map((categoria) => (
                        <TabButton 
                            key={categoria}
                            active={categoriaAtiva === categoria} 
                            onClick={() => setCategoriaAtiva(categoria)}
                        >
                            {categoriasLabels[categoria]}
                        </TabButton>
                    ))}
                </TabContainer>

                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="Pesquisar por nome ou especialidade..."
                        value={termoPesquisa}
                        onChange={(e) => setTermoPesquisa(e.target.value)}
                    />
                </SearchContainer>

                {profissionaisFiltrados.length > 0 ? (
                    <>
                        <EmpresasGrid>
                            {profissionaisParaExibir.map((profissional, index) => {
                                const temCidade = profissional.cidade && profissional.cidade.trim() !== '';
                                const temUF = profissional.ufRegiao && profissional.ufRegiao.trim() !== '';
                                
                                return (
                                    <EmpresaCard key={index}>
                                        <EmpresaNome>{profissional.nomeCompleto}</EmpresaNome>
                                        <EmpresaInfo>
                                            {temCidade || temUF ? (
                                                <div style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                                                    {temCidade && temUF ? (
                                                        `${profissional.cidade}, ${profissional.ufRegiao}`
                                                    ) : temCidade ? (
                                                        profissional.cidade
                                                    ) : (
                                                        profissional.ufRegiao
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ color: '#999', fontSize: '12px', fontStyle: 'italic', marginTop: '8px' }}>
                                                    Localização não informada
                                                </div>
                                            )}
                                        </EmpresaInfo>
                                        <InscreverButton onClick={() => handleInscrever(profissional.nomeCompleto, 'profissional')}>
                                            Agende Agora
                                        </InscreverButton>
                                    </EmpresaCard>
                                );
                            })}
                        </EmpresasGrid>
                        {temMaisProfissionais && (
                            <VerMaisButton onClick={handleVerMais}>
                                Ver Mais
                            </VerMaisButton>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '40px', width: '100%' }}>
                        <WelcomeText style={{ textAlign: 'center', margin: '0 auto' }}>
                            {termoPesquisa 
                                ? `Nenhum resultado encontrado para "${termoPesquisa}".`
                                : `Nenhum ${categoriasLabels[categoriaAtiva].toLowerCase()} cadastrado no momento.`
                            }
                        </WelcomeText>
                    </div>
                )}
            </EmpresasSection>
            
            <Footer />
        </Container>
    );
};

export default EmpresasProfissionais;

