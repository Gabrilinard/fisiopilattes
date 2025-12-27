import { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { ContainerGeral, Container, FormularioReserva, Input, Select, Button, DaysWrapper, Day, MensagemStatus, ReservasContainer, ReservaItem, Reserva_2, Selecao, H3, Div, Div_2, Paragrafo, Button_geral, Lista, Linha, Container_Important, ContainerEdicao, Label  } from './style';

const Agendar = () => {
  const { user } = useAuth();
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [diaSemana, setDiaSemana] = useState('');
  const [horario, setHorario] = useState('');
  const [tempoFalta, setTempoFalta] = useState({});
  const [horarioFinal, setHorarioFinal] = useState('');
  const [reservasTemporarias, setReservasTemporarias] = useState([]);
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [mensagemLogin] = useState('');
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [solicitCount, setSolicitCount] = useState(0);
  const [edicoesCount, setEdicoesCount] = useState(0);
  const [faltasCount, setFaltasCount] = useState(0);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [novoDiaSemana, setNovoDiaSemana] = useState('');
  const [novoHorario, setNovoHorario] = useState('');
  const [novaQuantidade, setNovaQuantidade] = useState('');
  const [setNovoDia] = useState('');
    const [reservasPorDia, setReservasPorDia] = useState({
      Segunda: [],
      Terça: [],
      Quarta: [],
      Quinta: [],
      Sexta: [],
      Sábado: [],
      Domingo: [],
    });

  const diasMap = {
    segunda: 'Segunda',
    terça: 'Terça',
    quarta: 'Quarta',
    quinta: 'Quinta',
    sexta: 'Sexta',
    sábado: 'Sábado',
    domingo: 'Domingo',
  };

    if (user && user.id) {
      axios.get(`http://localhost:4000/reservas/${user.id}`)
        .then(response => {
          setReservas(response.data);  
        })
        .catch(error => console.error('Erro ao buscar reservas:', error));
    }
  

  useEffect(() => {
    axios.get('http://localhost:4000/reservas')
      .then(response => {
        const reservasData = response.data;
    
        setReservas(reservasData);
    
        // Categorize reservas by day
        const reservasDia = reservasData.reduce((acc, reserva) => {
            const dia = reserva.dia ? reserva.dia.toLowerCase() : ''; 
            const diaCompleto = diasMap[dia];  
  
          if (diaCompleto) {
            acc[diaCompleto].push(reserva);
          }
    
          return acc;
        }, {
          Segunda: [],
          Terça: [],
          Quarta: [],
          Quinta: [],
          Sexta: [],
          Sábado: [],
          Domingo: [],
        });
    
        setReservasPorDia(reservasDia);
        
      })
      .catch(error => console.error('Erro ao buscar reservas:', error));
  }, []);

  const atualizarStatus = (id, status) => {
    axios.patch(`http://localhost:4000/reservas/${id}`, { status })
      .then(() => {
        const updatedReservas = reservas.map(reserva =>
          reserva.id === id ? { ...reserva, status } : reserva
        );
        setReservas(updatedReservas);

        // Update reservasPorDia
        const updatedReservasPorDia = { ...reservasPorDia };
        updatedReservas.forEach(reserva => {
          const diaCompleto = diasMap[reserva.dia.toLowerCase()];
          if (diaCompleto) {
            updatedReservasPorDia[diaCompleto] = updatedReservasPorDia[diaCompleto].map(r =>
              r.id === reserva.id ? { ...r, status } : r
            );
          }
        });
        setReservasPorDia(updatedReservasPorDia);
      })
      .catch(error => console.error('Erro ao atualizar status:', error));
  };

  const toggleStatus = (reserva) => {
    const novoStatus = reserva.status === 'confirmado' ? 'pendente' : 'confirmado';
    atualizarStatus(reserva.id, novoStatus);
  };

  const calcularHorarioFinal = (horario) => {
    if (!horario) return '';
    const [hora, minuto] = horario.split(':').map(Number);
    const novaHora = (hora + 1) % 24;
    return `${novaHora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  };

  const handleHorarioChange = (e) => {
    const novoHorario = e.target.value;
    setHorario(novoHorario);
    setHorarioFinal(calcularHorarioFinal(novoHorario));
  };

  const sendEmailNotification = (userEmail, userName, solicitCount, faltasCount, edicoesCount) => {
    const adminName = 'Italo';
    const email = userEmail;

    // console.log("Dados do e-mail:");
    // console.log("Email:", userEmail);
    // console.log("Nome:", adminName);
    // console.log("Nome Usuário:", userName);
    // console.log("Reservas:", solicitCount);
    // console.log("Faltas:", faltasCount);
    // console.log("Edições:", edicoesCount);

    // Envia o e-mail somente se as contagens forem diferentes de zero
    if (faltasCount > 0 || edicoesCount > 0 || solicitCount > 0) {
        const templateParams = {
            to_email: email,
            name: adminName || 'Nome não informado',
            message: solicitCount || "0",
            faltas: faltasCount ? faltasCount : "0",
            edicoes: edicoesCount ? edicoesCount : "0"
        };

        emailjs.send(
            'service_qk9fh0c',
            'template_mcivc2t',
            templateParams,
            'CmC62QYBAMTUx6B2a'
        )
        .then((response) => {
            console.log('E-mail enviado com sucesso:', response.status, response.text);
        })
        .catch((error) => {
            console.error('Erro ao enviar e-mail:', error);
        });
    } else {
        console.log('Condições não atendidas para envio de e-mail.');
    }
};


useEffect(() => {
  const interval = setInterval(() => {
    // Verifica se todas as contagens estão zeradas
    if (faltasCount > 0 || edicoesCount > 0 || solicitCount > 0) {
      sendEmailNotification(user.email, user.nome, solicitCount, faltasCount, edicoesCount);

      // Após enviar o e-mail, reinicia as contagens
      setSolicitCount(0);
      setFaltasCount(0);
      setEdicoesCount(0);
    } else {
      console.log(solicitCount)
      console.log("Não foi possível enviar o e-mail, pois não há valores em nenhum dos arrays.");
    }
  }, 10000); // Envia o e-mail a cada 10 segundos (10000 ms)

  // Limpa o intervalo quando o componente for desmontado
  return () => clearInterval(interval);
}, [solicitCount, faltasCount, edicoesCount]);

useEffect(() => {
  const storedCount = sessionStorage.getItem('solicitCount');
  if (storedCount) {
    setSolicitCount(parseInt(storedCount, 10));
    sessionStorage.removeItem('solicitCount'); 
  }
}, []);



const handleReserva = async (e) => {
  e.preventDefault();

  if (!user) return;

  // Verifique se quantidadePessoas tem um valor válido
  if (!diaSemana || !horario || !quantidadePessoas || isNaN(quantidadePessoas) || quantidadePessoas < 0) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  try {
    // Envia a reserva para o backend
    const response = await axios.post('http://localhost:4000/reservas', {
      nome: user.nome,
      sobrenome: user.sobrenome,
      email: user.email,
      telefone: user.telefone,
      dia: diaSemana,
      horario,
      horarioFinal,
      qntd_pessoa: parseInt(quantidadePessoas, 10), 
      usuario_id: user.id,
    });

    // Combina a nova reserva com os dados recebidos do backend (reservaNova)
    const novaReserva = {
      dia: diaSemana,
      horario,
      horarioFinal,
      status: 'pendente',
      qntd_pessoa: parseInt(quantidadePessoas, 10), 
      ...response.data, 
    };

    // Atualiza o estado para refletir todas as reservas, incluindo a nova
    setReservas((prevReservas) => [...prevReservas, novaReserva]);

    // Limpa os campos após a reserva
    setQuantidadePessoas(1);
    setDiaSemana('');
    setHorario('');

    setSolicitCount((prevCount) => prevCount + 1);
  } catch (error) {
    console.error('Erro ao fazer reserva:', error);
    alert('Erro ao tentar fazer a reserva. Tente novamente.');
  }
};
 
  const handleFaltar = async (id) => {
    const tempo = tempoFalta[id]; 

    if (!tempo) {
        alert("Por favor, insira o tempo da falta.");
        return;
    }

    try {
        await axios.put(`http://localhost:4000/reservas/solicitar/${id}`, { 
            status: 'ausente', 
            motivoFalta: tempo 
        });

        setReservas(reservas.map(reserva => 
            reserva.id === id ? { ...reserva, status: 'ausente', motivoFalta: tempo } : reserva
        ));

        setFaltasCount(prevCount => prevCount + 1);

        alert("Falta registrada com sucesso!");
    } catch (error) {
        console.error('Erro ao marcar falta:', error);
    }
};

const handleEditar = (id) => {
  const reserva = reservas.find(reserva => reserva.id === id);
  if (reserva) {
    setReservaEditando(reserva);
    setNovoDia(reserva.dia);
    setNovoHorario(reserva.horario);
    setNovaQuantidade(reserva.qntd_pessoa || 1);
  }
};

const validarHorario = (horario) => {
  return /^([01]?\d|2[0-3]):([0-5]\d)$/.test(horario);
};

const handleSalvarEdicao = async () => {
  // Corrige o formato do dia para garantir que a primeira letra seja maiúscula
  const diaCorrigido = novoDiaSemana.charAt(0).toUpperCase() + novoDiaSemana.slice(1).toLowerCase();

  // Agora verificamos se o dia corrigido é válido
  if (!diaCorrigido || !diasDaSemana.map(dia => dia.toLowerCase()).includes(diaCorrigido.toLowerCase())) {
    alert("Dia inválido. Use um dia válido (ex: Segunda, Terça).");
    return;
  }

  if (!validarHorario(novoHorario)) {
    alert("Horário inválido! Use o formato HH:MM.");
    return;
  }

  const quantidadePessoasInt = parseInt(novaQuantidade, 10);
  if (isNaN(quantidadePessoasInt) || quantidadePessoasInt <= 0) {
    alert("Quantidade de pessoas inválida.");
    return;
  }

  try {
    // Garantir que o id real da reserva esteja sendo passado
    const reservaId = reservaEditando.id; // Pegando o id da reserva editando diretamente

    if (!reservaId) {
      alert("Reserva não encontrada.");
      return;
    }

    const [horas, minutos] = novoHorario.split(':').map(Number);
    const horarioObj = new Date();
    horarioObj.setHours(horas, minutos, 0);
    horarioObj.setHours(horarioObj.getHours() + 1);
    const novoHorarioFinal = horarioObj.toTimeString().slice(0, 5);

    console.log('ID da reserva sendo editada:', reservaId); // Verificar o ID correto

    // Usando o ID correto da reserva selecionada
    const response = await axios.patch(`http://localhost:4000/reservas/editar/${reservaId}`, {
      dia: diaCorrigido,
      horario: novoHorario,
      horarioFinal: novoHorarioFinal,
      qntd_pessoa: quantidadePessoasInt,
      status: "pendente"
    });

    if (response.status === 200) {
      alert("Edição enviada! Aguardando confirmação do professor.");

      const updatedReserva = {
        ...reservaEditando,
        dia: diaCorrigido,
        horario: novoHorario,
        horarioFinal: novoHorarioFinal,
        qntd_pessoa: quantidadePessoasInt,
        status: "pendente"
      };

      setReservas((prevReservas) =>
        prevReservas.map((reserva) =>
          reserva.id === reservaId ? updatedReserva : reserva
        )
      );      

      setEdicoesCount((prevCount) => prevCount + 1);
      setReservaEditando(null); // Limpa a reserva editando
    }
  } catch (error) {
    console.error("Erro ao editar reserva:", error);
    alert("Erro ao editar reserva. Tente novamente.");
  }
};

const adicionarDiaReserva = () => {

    if (diaSemana && !diasSelecionados.includes(diaSemana)) {
        setDiasSelecionados([...diasSelecionados, diaSemana]);
      }
    
    if (!diaSemana || !horario || !quantidadePessoas) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const novaReserva = {
      dia: diaSemana,
      horario,
      horarioFinal,
      quantidadePessoas,
    };
    setReservasTemporarias([...reservasTemporarias, novaReserva]);

    setDiaSemana('');
    setHorario('');
  };
  
  const enviarReservas = async () => {
    if (reservasTemporarias.length === 0) {
      alert('Solicitação Enviada!');
      return;
    }
  
    if (!user) {
      alert('Você precisa estar logado para fazer uma reserva.');
      return;
    }
  
    try {
      const enviarReserva = await Promise.all(reservasTemporarias.map(async (reserva) => {
        await axios.post('http://localhost:4000/reservas', {
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email,
          telefone: user.telefone,
          dia: reserva.dia,
          horario: reserva.horario,
          horarioFinal: reserva.horarioFinal,
          qntd_pessoa: parseInt(reserva.quantidadePessoas, 10),
          usuario_id: user.id,
        });
      }));

      setReservasTemporarias((prevReservas) => [...prevReservas, enviarReserva]);
      setReservasTemporarias([]); 

      const novoCount = solicitCount + 1;
      sessionStorage.setItem('solicitCount', novoCount);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao enviar reservas:', error);
      alert('Erro ao tentar enviar as reservas. Tente novamente.');
    }
  };
  
const selecionarDia = (dia) => {
    setDiaSelecionado(dia === diaSelecionado ? null : dia); 
  };
  
  const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  const reservasOrdenadas = [...reservas].sort((a, b) => {
    const diaDiff = diasDaSemana.indexOf(a.dia) - diasDaSemana.indexOf(b.dia);
    if (diaDiff !== 0) return diaDiff;
    return a.horario.localeCompare(b.horario);
  });

  return (
    <ContainerGeral>
      <Header />
      <Container>
      <h2>Agendar Reserva</h2>
        <DaysWrapper>
            {diasDaSemana.map((dia, index) => {
                const reservasConfirmadas = reservasPorDia[dia]
                .filter(reserva => reserva.status === 'confirmado')
                .sort((a, b) => a.horario.localeCompare(b.horario));
                
                return (
                <Day key={index} onClick={() => selecionarDia(dia)}>
                    <h3>{dia}</h3>
                    {diaSelecionado === dia && (
                    <ul>
                        {reservasConfirmadas.length > 0 ? (
                        reservasConfirmadas.map(reserva => (
                            <li
                            key={reserva.id}
                            style={{
                                color: reserva.usuario_id === user.id ? 'green' : 'black', 
                            }}
                            >
                            Horário Inicial: {reserva.horario} - Horário Final: {reserva.horarioFinal} - Pessoas: {reserva.qntd_pessoa}
                            </li>
                        ))
                        ) : (
                        <li>Nenhuma aula marcada</li>
                        )}
                    </ul>
                    )}
                </Day>
                );
            })}
        </DaysWrapper>

        <Container_Important>
            {mensagemLogin && <p>{mensagemLogin}</p>}
            {!mensagemLogin && (
              <>
                <FormularioReserva onSubmit={handleReserva}>
                  <label>Dia da Semana:</label>
                  <Select value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)} required>
                    <option value="">Selecione um dia</option>
                    <option value="Segunda">Segunda</option>
                    <option value="Terça">Terça</option>
                    <option value="Quarta">Quarta</option>
                    <option value="Quinta">Quinta</option>
                    <option value="Sexta">Sexta</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </Select>
                  <label>Horário desejado:</label>
                  <Input type="time" value={horario} onChange={handleHorarioChange} required />
                  <label>Horário Final:</label>
                  <Input type="time" value={horarioFinal} disabled />
                  <label>Quantidade de pessoas:</label>
                  <Input type="number" min="1" value={quantidadePessoas} onChange={(e) => setQuantidadePessoas(e.target.value)} required />
                  <Button_geral>
                      <Button onClick={enviarReservas}>Solicitar Reserva</Button>
                      <Button onClick={adicionarDiaReserva} style={{backgroundColor: 'green'}}>Adicionar Dia</Button>
                  </Button_geral>
                </FormularioReserva>
              </>
            )}
            {diasSelecionados.length > 0 && (
              <Selecao>
              <H3>Reservas Selecionadas</H3>
              <Div>
                {diasSelecionados.map((dia, index) => (
                  <Div_2 key={index}>
                    <Paragrafo>{`Dia: ${dia}`}</Paragrafo>
                    <Lista>
                      {reservasTemporarias
                        .filter(reserva => reserva.dia === dia)
                        .map((reserva, idx) => (
                          <Linha key={idx}>
                            <span>{reserva.horario}</span> - <span>{reserva.quantidadePessoas} pessoas</span>
                          </Linha>
                        ))}
                    </Lista>
                  </Div_2>
                ))}
              </Div>
            </Selecao>
            )}
        </Container_Important>
        <ReservasContainer>
        <h3>Reservas Confirmadas</h3>
            <Reserva_2>
                {reservasOrdenadas.length > 0 ? reservasOrdenadas.map(reserva => (
                    <ReservaItem key={reserva.id}>
                    <MensagemStatus status={reserva.status}>
                        <p><strong>Dia:</strong> {reserva.dia}</p>
                        <p><strong>Horário:</strong> {reserva.horario} - {reserva.horarioFinal}</p>
                        <p><strong>Status:</strong> {reserva.status}</p>
                        {reserva.status === 'negado' && (
                        <MensagemStatus status="negado">
                            <p>Motivo: {reserva.motivoNegacao}</p>
                        </MensagemStatus>
                        )}
                        {reserva.status === 'confirmado' ? `Confirmado: ${reserva.dia} às ${reserva.horario}` : 'Aguardando Confirmação'}
                    </MensagemStatus>
                        {reserva.status === 'confirmado' && (
                        <>
                            <Button onClick={() => setTempoFalta({ ...tempoFalta, [reserva.id]: '' })}>
                            Falta Programada
                            </Button>
                    
                        {tempoFalta[reserva.id] !== undefined && (
                        <div>
                            <p style={{marginTop: '20px'}}>Tempo de Falta:</p>
                            <input
                            type="text"
                            value={tempoFalta[reserva.id] || ""}
                            onChange={(e) =>
                                setTempoFalta({ ...tempoFalta, [reserva.id]: e.target.value })
                            }
                            />
                            <Button color="green" onClick={() => handleFaltar(reserva.id)}>
                            Confirmar
                            </Button>
                        </div>
                        )}
                    </>          
                    )}
                    <Button color="orange" onClick={() => handleEditar(reserva.id)}>Editar</Button>

                    {reservaEditando && reservaEditando.id === reserva.id && (
                      <ContainerEdicao>
                        <Label>Dia da Semana:</Label>
                        <Input 
                          type="text" 
                          value={novoDiaSemana} 
                          onChange={(e) => setNovoDiaSemana(e.target.value)} 
                        />

                        <Label>Horário:</Label>
                        <Input 
                          type="text" 
                          value={novoHorario} 
                          onChange={(e) => setNovoHorario(e.target.value)} 
                        />

                        <Label>Quantidade de Pessoas:</Label>
                        <Input 
                          type="number" 
                          value={novaQuantidade} 
                          min="1" 
                          onChange={(e) => setNovaQuantidade(e.target.value)} 
                        />

                        <Button onClick={handleSalvarEdicao}>Confirmar Edição</Button>
                      </ContainerEdicao>
                    )}
                    </ReservaItem>
                )) : <p>Nenhuma reserva confirmada ainda.</p>}
            </Reserva_2>
        </ReservasContainer>
      </Container>
      <Footer />
    </ContainerGeral>
  );
};

export default Agendar;