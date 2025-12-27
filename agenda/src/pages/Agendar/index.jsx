import axios from 'axios';
import { ptBR } from 'date-fns/locale';
import emailjs from 'emailjs-com';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Button_geral, Container, Container_Important, ContainerEdicao, ContainerGeral, DatePickerWrapper, Div, Div_2, FormularioReserva, H3, Input, Label, Linha, Lista, MensagemStatus, Paragrafo, Reserva_2, ReservaItem, ReservasContainer, Selecao, TituloAgendamento } from './style';

const Agendar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { nome } = location.state || {};
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horario, setHorario] = useState('');
  const [tempoFalta, setTempoFalta] = useState({});
  const [horarioFinal, setHorarioFinal] = useState('');
  const [reservasTemporarias, setReservasTemporarias] = useState([]);
  const [mensagemLogin] = useState('');
  const [datasSelecionadas, setDatasSelecionadas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [solicitCount, setSolicitCount] = useState(0);
  const [edicoesCount, setEdicoesCount] = useState(0);
  const [faltasCount, setFaltasCount] = useState(0);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [novaData, setNovaData] = useState(new Date());
  const [novoHorario, setNovoHorario] = useState('');

  const formatarDataBrasil = (data) => {
    if (!data) return '';
    const dataLocal = new Date(data);
    const ano = dataLocal.getFullYear();
    const mes = String(dataLocal.getMonth() + 1).padStart(2, '0');
    const dia = String(dataLocal.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const formatarDataExibicao = (dataString) => {
    if (!dataString) return '';
    if (dataString instanceof Date) {
      const dia = String(dataString.getDate()).padStart(2, '0');
      const mes = String(dataString.getMonth() + 1).padStart(2, '0');
      const ano = dataString.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
    if (typeof dataString === 'string') {
      let dataParaFormatar = dataString;
      if (dataString.includes('T')) {
        dataParaFormatar = dataString.split('T')[0];
      }
      if (dataParaFormatar.includes('-')) {
        const partes = dataParaFormatar.split('-');
        if (partes.length >= 3) {
          const [ano, mes, dia] = partes;
          return `${dia}/${mes}/${ano}`;
        }
      }
      try {
        const data = new Date(dataString);
        if (!isNaN(data.getTime())) {
          const dia = String(data.getDate()).padStart(2, '0');
          const mes = String(data.getMonth() + 1).padStart(2, '0');
          const ano = data.getFullYear();
          return `${dia}/${mes}/${ano}`;
        }
      } catch {
        return dataString;
      }
    }
    return dataString;
  };

  const formatarHorarioBrasil = (horario) => {
    if (!horario) return '';
    
    if (typeof horario !== 'string') {
      horario = String(horario);
    }
    
    const matchAMPM = horario.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (matchAMPM) {
      let horas = parseInt(matchAMPM[1], 10);
      const minutos = matchAMPM[2];
      const periodo = matchAMPM[4].toUpperCase();
      if (periodo === 'PM' && horas !== 12) {
        horas += 12;
      } else if (periodo === 'AM' && horas === 12) {
        horas = 0;
      }
      return `${String(horas).padStart(2, '0')}:${minutos}`;
    }
    
    const matchComSegundos = horario.match(/^(\d{1,2}):(\d{2}):(\d{2})/);
    if (matchComSegundos) {
      const horas = matchComSegundos[1];
      const minutos = matchComSegundos[2];
      return `${String(parseInt(horas, 10)).padStart(2, '0')}:${minutos}`;
    }
    
    const matchHHMM = horario.match(/^(\d{1,2}):(\d{2})/);
    if (matchHHMM) {
      const horas = String(parseInt(matchHHMM[1], 10)).padStart(2, '0');
      const minutos = matchHHMM[2];
      return `${horas}:${minutos}`;
    }
    
    return horario;
  };


  useEffect(() => {
    if (user && user.id && nome) {
      const partes = nome.trim().split(' ');
      const nomeProf = partes[0] || '';
      const sobrenomeProf = partes.slice(1).join(' ') || '';
      
      axios.get(`http://localhost:3000/profissionais`)
        .then(response => {
          const profissional = response.data.find(p => 
            p.nomeCompleto === nome || 
            (p.nome === nomeProf && p.sobrenome === sobrenomeProf)
          );
          
          if (profissional && profissional.id) {
            axios.get(`http://localhost:3000/reservas?usuario_id=${user.id}&profissional_id=${profissional.id}`)
              .then(response => {
                const reservasFormatadas = response.data.map(reserva => ({
                  ...reserva,
                  horario: formatarHorarioBrasil(reserva.horario)
                }));
                setReservas(reservasFormatadas);  
              })
              .catch(error => console.error('Erro ao buscar consultas:', error));
          } else {
            axios.get(`http://localhost:3000/reservas/${user.id}`)
              .then(response => {
                const reservasFormatadas = response.data.map(reserva => ({
                  ...reserva,
                  horario: formatarHorarioBrasil(reserva.horario)
                }));
                setReservas(reservasFormatadas);  
              })
              .catch(error => console.error('Erro ao buscar consultas:', error));
          }
        })
        .catch(error => {
          console.error('Erro ao buscar profissional:', error);
          axios.get(`http://localhost:3000/reservas/${user.id}`)
            .then(response => {
              const reservasFormatadas = response.data.map(reserva => ({
                ...reserva,
                horario: formatarHorarioBrasil(reserva.horario)
              }));
              setReservas(reservasFormatadas);  
            })
            .catch(error => console.error('Erro ao buscar consultas:', error));
        });
    } else if (user && user.id) {
      axios.get(`http://localhost:3000/reservas/${user.id}`)
        .then(response => {
          const reservasFormatadas = response.data.map(reserva => ({
            ...reserva,
            horario: formatarHorarioBrasil(reserva.horario)
          }));
          setReservas(reservasFormatadas);  
        })
        .catch(error => console.error('Erro ao buscar consultas:', error));
    }
  }, [user, nome]);


  const calcularHorarioFinal = (horario) => {
    if (!horario) return '';
    const [hora, minuto] = horario.split(':').map(Number);
    const novaHora = (hora + 1) % 24;
    return `${novaHora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  };

  const handleHorarioChange = (e) => {
    let novoHorario = e.target.value;
    
    if (novoHorario && novoHorario.includes(' ')) {
      const partes = novoHorario.split(' ');
      if (partes.length >= 2) {
        const horaMinuto = partes[0];
        const periodo = partes[1].toUpperCase();
        const [hora, minuto] = horaMinuto.split(':');
        let horas = parseInt(hora, 10);
        
        if (periodo === 'PM' && horas !== 12) {
          horas += 12;
        } else if (periodo === 'AM' && horas === 12) {
          horas = 0;
        }
        
        novoHorario = `${String(horas).padStart(2, '0')}:${minuto}`;
      }
    }
    
    const horarioFormatado = formatarHorarioBrasil(novoHorario);
    setHorario(horarioFormatado);
    setHorarioFinal(calcularHorarioFinal(horarioFormatado));
  };

  const sendEmailNotification = (userEmail, userName, solicitCount, faltasCount, edicoesCount) => {
    const adminName = 'Italo';
    const email = userEmail;

    if (faltasCount > 0 || edicoesCount > 0 || solicitCount > 0) {
        const templateParams = {
            to_email: email,
            name: adminName || 'Nome não informado',
            message: solicitCount || "0",
            faltas: faltasCount ? faltasCount : "0",
            edicoes: edicoesCount ? edicoesCount : "0"
        };

        emailjs.send(
            'service_5guvy7s',
            'template_me4jkpe',
            templateParams,
            '95NytkXcfDF9Z3EEQ'
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
    if (faltasCount > 0 || edicoesCount > 0 || solicitCount > 0) {
      sendEmailNotification(user.email, user.nome, solicitCount, faltasCount, edicoesCount);

      setSolicitCount(0);
      setFaltasCount(0);
      setEdicoesCount(0);
    } else {
      console.log(solicitCount)
      console.log("Não foi possível enviar o e-mail, pois não há valores em nenhum dos arrays.");
    }
  }, 5000 ); 

  return () => clearInterval(interval);
}, [solicitCount, faltasCount, edicoesCount, user]);

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

  if (!dataSelecionada || !horario) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  const dataFormatada = formatarDataBrasil(dataSelecionada);

  try {
    const response = await axios.post('http://localhost:3000/reservas', {
      nome: user.nome,
      sobrenome: user.sobrenome,
      email: user.email,
      telefone: user.telefone,
      dia: dataFormatada,
      horario,
      horarioFinal,
      qntd_pessoa: 1, 
      usuario_id: user.id,
      nomeProfissional: nome || null,
    });

    const novaReserva = {
      dia: dataFormatada,
      horario,
      horarioFinal,
      status: 'pendente',
      qntd_pessoa: 1, 
      ...response.data, 
    };

    setReservas((prevReservas) => [...prevReservas, novaReserva]);

    setDataSelecionada(new Date());
    setHorario('');

    setSolicitCount((prevCount) => prevCount + 1);
    sendEmailNotification(user.email, user.nome, solicitCount, faltasCount, edicoesCount);
  } catch (error) {
    console.error('Erro ao fazer consulta:', error);
      alert('Erro ao tentar fazer a consulta. Tente novamente.');
  }
};
 
  const handleFaltar = async (id) => {
    const tempo = tempoFalta[id]; 

    if (!tempo) {
        alert("Por favor, insira o tempo da falta.");
        return;
    }

    try {
        await axios.put(`http://localhost:3000/reservas/solicitar/${id}`, { 
            status: 'ausente', 
            motivoFalta: tempo 
        });

        setReservas(reservas.map(reserva => 
            reserva.id === id ? { ...reserva, status: 'ausente', motivoFalta: tempo } : reserva
        ));

        setFaltasCount(prevCount => prevCount + 1);

        alert("Falta registrada com sucesso!");
        sendEmailNotification(user.email, user.nome, solicitCount, faltasCount, edicoesCount);
    } catch (error) {
        console.error('Erro ao marcar falta:', error);
    }
};

const handleEditar = (id) => {
  const reserva = reservas.find(reserva => reserva.id === id);
  if (reserva) {
    setReservaEditando(reserva);
    const dataReserva = reserva.dia ? new Date(reserva.dia + 'T00:00:00') : new Date();
    setNovaData(dataReserva);
    setNovoHorario(formatarHorarioBrasil(reserva.horario));
  }
};

const validarHorario = (horario) => {
  return /^([01]?\d|2[0-3]):([0-5]\d)$/.test(horario);
};

const handleSalvarEdicao = async () => {
  if (!novaData) {
    alert("Data inválida.");
    return;
  }

  if (!validarHorario(novoHorario)) {
    alert("Horário inválido! Use o formato HH:MM.");
    return;
  }

  const dataFormatada = formatarDataBrasil(novaData);

  try {
    const reservaId = reservaEditando.id;  

    if (!reservaId) {
      alert("Consulta não encontrada.");
      return;
    }

    const [horas, minutos] = novoHorario.split(':').map(Number);
    const horarioObj = new Date();
    horarioObj.setHours(horas, minutos, 0);
    horarioObj.setHours(horarioObj.getHours() + 1);
    const novoHorarioFinal = horarioObj.toTimeString().slice(0, 5);

    console.log('ID da reserva sendo editada:', reservaId); 

    const response = await axios.patch(`http://localhost:3000/reservas/editar/${reservaId}`, {
      dia: dataFormatada,
      horario: novoHorario,
      horarioFinal: novoHorarioFinal,
      qntd_pessoa: 1,
      status: "pendente"
    });

    if (response.status === 200) {
      alert("Edição enviada! Aguardando confirmação do professor.");
      sendEmailNotification(user.email, user.nome, solicitCount, faltasCount, edicoesCount);

      const updatedReserva = {
        ...reservaEditando,
        dia: dataFormatada,
        horario: novoHorario,
        horarioFinal: novoHorarioFinal,
        qntd_pessoa: 1,
        status: "pendente"
      };

      setReservas((prevReservas) =>
        prevReservas.map((reserva) =>
          reserva.id === reservaId ? updatedReserva : reserva
        )
      );      

      setEdicoesCount((prevCount) => prevCount + 1);
      setReservaEditando(null); 
    }
  } catch (error) {
    console.error("Erro ao editar consulta:", error);
    alert("Erro ao editar consulta. Tente novamente.");
  }
};

const adicionarDiaReserva = () => {
    if (!dataSelecionada || !horario) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const dataFormatada = formatarDataBrasil(dataSelecionada);
    
    if (dataFormatada && !datasSelecionadas.includes(dataFormatada)) {
      setDatasSelecionadas([...datasSelecionadas, dataFormatada]);
    }
    
    const novaReserva = {
      dia: dataFormatada,
      horario,
      horarioFinal,
    };
    setReservasTemporarias([...reservasTemporarias, novaReserva]);

    setDataSelecionada(new Date());
    setHorario('');
  };
  
  const enviarReservas = async () => {
    if (reservasTemporarias.length === 0) {
      alert('Solicitação Enviada!');
      return;
    }
  
    if (!user) {
      alert('Você precisa estar logado para fazer uma consulta.');
      return;
    }
  
    try {
      const enviarReserva = await Promise.all(reservasTemporarias.map(async (reserva) => {
        await axios.post('http://localhost:3000/reservas', {
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email,
          telefone: user.telefone,
          dia: reserva.dia,
          horario: reserva.horario,
          horarioFinal: reserva.horarioFinal,
          qntd_pessoa: 1,
          usuario_id: user.id,
          nomeProfissional: nome || null,
        });
      }));

      setReservasTemporarias((prevReservas) => [...prevReservas, enviarReserva]);
      setReservasTemporarias([]); 

      const novoCount = solicitCount + 1;
      sessionStorage.setItem('solicitCount', novoCount);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao enviar reservas:', error);
      alert('Erro ao tentar enviar as consultas. Tente novamente.');
    }
  };
  
  const reservasOrdenadas = [...reservas].sort((a, b) => {
    const dataDiff = a.dia.localeCompare(b.dia);
    if (dataDiff !== 0) return dataDiff;
    return a.horario.localeCompare(b.horario);
  });

  return (
    <ContainerGeral>
      <Header />
      <Container>
        {nome ? (
          <TituloAgendamento>
            Agendar com {nome}
          </TituloAgendamento>
        ) : (
          <h2>Agendar Consulta</h2>
        )}
        <Container_Important>
          {mensagemLogin && <p>{mensagemLogin}</p>}
          {!mensagemLogin && (
            <>
              <FormularioReserva onSubmit={handleReserva}>
                <label>Data:</label>
                <DatePickerWrapper>
                  <DatePicker
                    selected={dataSelecionada}
                    onChange={(date) => setDataSelecionada(date)}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    locale={ptBR}
                    showPopperArrow={false}
                    required
                  />
                </DatePickerWrapper>
                <label>Horário:</label>
                <Input 
                  type="time" 
                  value={formatarHorarioBrasil(horario)} 
                  onChange={handleHorarioChange}
                  step="60"
                  required 
                />
                <Button_geral>
                  <Button onClick={enviarReservas}>Solicitar Consulta</Button>
                  <Button onClick={adicionarDiaReserva} style={{backgroundColor: 'green'}}>Adicionar Dia</Button>
                </Button_geral>
              </FormularioReserva>
            </>
          )}
          {datasSelecionadas.length > 0 && (
            <Selecao>
              <H3>Consultas Selecionadas</H3>
              <Div>
                {datasSelecionadas.map((data, index) => {
                  const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
                  return (
                    <Div_2 key={index}>
                      <Paragrafo>{`Data: ${dataFormatada}`}</Paragrafo>
                      <Lista>
                        {reservasTemporarias
                          .filter(reserva => reserva.dia === data)
                          .map((reserva, idx) => (
                            <Linha key={idx}>
                              <span>{formatarHorarioBrasil(reserva.horario)}</span>
                            </Linha>
                          ))}
                      </Lista>
                    </Div_2>
                  );
                })}
              </Div>
            </Selecao>
          )}
        </Container_Important>
  
        <ReservasContainer>
          <h3>Consultas Confirmadas</h3>
          <Reserva_2>
            {reservasOrdenadas.length > 0 ? reservasOrdenadas.map(reserva => (
              <ReservaItem key={reserva.id}>
                <MensagemStatus status={reserva.status}>
                  <strong>Dia:</strong> {formatarDataExibicao(reserva.dia)}<br />
                  <strong>Horário:</strong> {formatarHorarioBrasil(reserva.horario)}<br />
                  <strong>Status:</strong> {reserva.status}
                  {reserva.status === 'negado' && (
                    <MensagemStatus status="negado">
                      <strong>Motivo:</strong> {reserva.motivoNegacao}
                    </MensagemStatus>
                  )}
                  {reserva.status === 'confirmado' ? (
                    <p>Confirmado: {formatarDataExibicao(reserva.dia)} às {formatarHorarioBrasil(reserva.horario)}</p>
                  ) : (
                    <>
                      <br />
                      <span style={{ color: 'orange' }}>Aguardando Confirmação</span>
                    </>
                  )}

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
                          onChange={(e) => setTempoFalta({ ...tempoFalta, [reserva.id]: e.target.value })}
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
                    <Label>Data:</Label>
                    <DatePickerWrapper>
                      <DatePicker
                        selected={novaData}
                        onChange={(date) => setNovaData(date)}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        locale={ptBR}
                        showPopperArrow={false}
                        required
                      />
                    </DatePickerWrapper>
  
                    <Label>Horário:</Label>
                    <Input 
                      type="time" 
                      value={formatarHorarioBrasil(novoHorario)} 
                      onChange={(e) => {
                        let novoHorarioInput = e.target.value;
                        
                        if (novoHorarioInput && novoHorarioInput.includes(' ')) {
                          const partes = novoHorarioInput.split(' ');
                          if (partes.length >= 2) {
                            const horaMinuto = partes[0];
                            const periodo = partes[1].toUpperCase();
                            const [hora, minuto] = horaMinuto.split(':');
                            let horas = parseInt(hora, 10);
                            
                            if (periodo === 'PM' && horas !== 12) {
                              horas += 12;
                            } else if (periodo === 'AM' && horas === 12) {
                              horas = 0;
                            }
                            
                            novoHorarioInput = `${String(horas).padStart(2, '0')}:${minuto}`;
                          }
                        }
                        
                        const horarioFormatado = formatarHorarioBrasil(novoHorarioInput);
                        setNovoHorario(horarioFormatado);
                      }}
                      step="60"
                    />
  
                    <Button onClick={handleSalvarEdicao}>Confirmar Edição</Button>
                  </ContainerEdicao>
                )}
              </ReservaItem>
            )) : <p>Nenhuma consulta confirmada ainda.</p>}
          </Reserva_2>
        </ReservasContainer>
      </Container>
      <Footer />
    </ContainerGeral>
  );  
};

export default Agendar;