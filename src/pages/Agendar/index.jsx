import axios from 'axios';
import { ptBR } from 'date-fns/locale';
import emailjs from 'emailjs-com';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { AgendamentoContainer, Button, Button_geral, Container, Container_Important, ContainerEdicao, ContainerGeral, DataHorarioMapaContainer, DataHorarioWrapper, DatePickerWrapper, Div, Div_2, FormularioReserva, H3, InfoDescription, InfoLabel, InfoProfissionalContainer, InfoSection, InfoTitle, InfoValue, Input, Label, Linha, Lista, MapaContainer, MapWrapper, MensagemStatus, ModalidadeTag, Paragrafo, Reserva_2, ReservaItem, ReservasContainer, Selecao, TituloAgendamento } from './style';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Agendar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { nome } = location.state || {};
  const { success, error: showError, warning } = useNotification();
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
  const [profissionalLocation, setProfissionalLocation] = useState(null);
  const [enderecoCompleto, setEnderecoCompleto] = useState('');
  const [profissionalInfo, setProfissionalInfo] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [reservasProfissional, setReservasProfissional] = useState([]);

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
            axios.get(`http://localhost:3000/usuarios/solicitarDados/${profissional.id}`)
              .then(profResponse => {
                const profData = profResponse.data;
                console.log('Dados do profissional recebidos:', profData);
                
                let diasAtendimento = [];
                try {
                  diasAtendimento = typeof profData.diasAtendimento === 'string' 
                    ? JSON.parse(profData.diasAtendimento) 
                    : profData.diasAtendimento || [];
                } catch (e) {
                  diasAtendimento = profData.diasAtendimento ? [profData.diasAtendimento] : [];
                }

                let horariosAtendimento = {};
                try {
                  horariosAtendimento = typeof profData.horariosAtendimento === 'string'
                    ? JSON.parse(profData.horariosAtendimento)
                    : profData.horariosAtendimento || {};
                } catch (e) {
                  console.error('Erro ao parsear horariosAtendimento:', e);
                }

                setProfissionalInfo({
                  id: profissional.id,
                  nome: profData.nome,
                  sobrenome: profData.sobrenome,
                  descricao: profData.descricao,
                  publicoAtendido: profData.publicoAtendido,
                  modalidade: profData.modalidade,
                  cidade: profData.cidade,
                  ufRegiao: profData.ufRegiao,
                  valorConsulta: profData.valorConsulta,
                  diasAtendimento: diasAtendimento,
                  horariosAtendimento: horariosAtendimento
                });

                axios.get(`http://localhost:3000/reservas?profissional_id=${profissional.id}`)
                  .then(resReservas => {
                    setReservasProfissional(resReservas.data);
                  })
                  .catch(err => console.error('Erro ao buscar reservas do profissional:', err));


                if (profData.latitude && profData.longitude) {
                  const lat = parseFloat(profData.latitude);
                  const lng = parseFloat(profData.longitude);
                  
                  console.log('Localização encontrada:', { lat, lng });
                  
                  setProfissionalLocation({
                    lat: lat,
                    lng: lng,
                    cidade: profData.cidade,
                    ufRegiao: profData.ufRegiao
                  });

                  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR`)
                    .then(response => response.json())
                    .then(data => {
                      console.log('Dados do endereço recebidos:', data);
                      if (data && data.address) {
                        const endereco = [];
                        if (data.address.road) endereco.push(data.address.road);
                        if (data.address.house_number) endereco.push(data.address.house_number);
                        if (data.address.neighbourhood) endereco.push(data.address.neighbourhood);
                        if (data.address.city || data.address.town || data.address.village) {
                          endereco.push(data.address.city || data.address.town || data.address.village);
                        }
                        if (data.address.state) endereco.push(data.address.state);
                        if (data.address.postcode) endereco.push(`CEP: ${data.address.postcode}`);
                        
                        setEnderecoCompleto(endereco.length > 0 ? endereco.join(', ') : data.display_name || '');
                      } else {
                        setEnderecoCompleto('');
                      }
                    })
                    .catch(error => {
                      console.error('Erro ao buscar endereço:', error);
                      setEnderecoCompleto('');
                    });
                } else {
                  console.log('Profissional não tem localização cadastrada');
                }
              })
              .catch(error => console.error('Erro ao buscar localização do profissional:', error));

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

  useEffect(() => {
    if (profissionalInfo && dataSelecionada) {
      const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const diaSemana = diasSemana[dataSelecionada.getDay()];
      
      let horariosDoDia = [];
      if (profissionalInfo.horariosAtendimento) {
        horariosDoDia = profissionalInfo.horariosAtendimento[diaSemana] || [];
      }

      const dataFormatada = formatarDataBrasil(dataSelecionada);
      
      const horariosLivres = horariosDoDia.filter(horario => {
        const ocupado = reservasProfissional.some(reserva => {
            let dataReserva = reserva.dia;
            if (typeof reserva.dia === 'string' && reserva.dia.includes('T')) {
                dataReserva = reserva.dia.split('T')[0];
            }
            const horarioReserva = formatarHorarioBrasil(reserva.horario);
            
            return dataReserva === dataFormatada && 
                   horarioReserva === horario && 
                   reserva.status !== 'cancelado' && 
                   reserva.status !== 'recusado';
        });
        return !ocupado;
      });

      setHorariosDisponiveis(horariosLivres);
      
      if (horario && !horariosLivres.includes(horario)) {
          setHorario('');
      }
    }
  }, [dataSelecionada, profissionalInfo, reservasProfissional]);

  const isDateAvailable = (date) => {
    if (!profissionalInfo || !profissionalInfo.diasAtendimento || profissionalInfo.diasAtendimento.length === 0) return true;
    
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaSemana = diasSemana[date.getDay()];
    
    if (profissionalInfo.diasAtendimento.includes('Todos os dias')) return true;
    return profissionalInfo.diasAtendimento.includes(diaSemana);
  };



  useEffect(() => {
    if (horario && !horario.match(/^\d{2}:\d{2}$/)) {
      const horarioFormatado = formatarHorarioBrasil(horario);
      if (horarioFormatado && horarioFormatado.match(/^\d{2}:\d{2}$/)) {
        setHorario(horarioFormatado);
      }
    }
  }, [horario]);

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
    showError('Por favor, preencha todos os campos corretamente.');
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
      showError('Erro ao tentar fazer a consulta. Tente novamente.');
  }
};
 
  const handleFaltar = async (id) => {
    const tempo = tempoFalta[id]; 

    if (!tempo) {
        showError("Por favor, insira o tempo da falta.");
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

        success("Falta registrada com sucesso!");
        sendEmailNotification(user.email, user.nome, solicitCount, faltasCount, edicoesCount);
    } catch (error) {
        console.error('Erro ao marcar falta:', error);
    }
};

const handleEditar = (id) => {
  try {
  const reserva = reservas.find(reserva => reserva.id === id);
  if (reserva) {
    setReservaEditando(reserva);

      let dataReserva = new Date();
      if (reserva.dia) {
        try {
          if (typeof reserva.dia === 'string') {
            let dataParaFormatar = reserva.dia;
            if (reserva.dia.includes('T')) {
              dataParaFormatar = reserva.dia.split('T')[0];
            }
            const partes = dataParaFormatar.split('-');
            if (partes.length === 3) {
              const [ano, mes, dia] = partes;
              dataReserva = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
            } else {
              dataReserva = new Date(dataParaFormatar + 'T00:00:00');
            }
          } else {
            dataReserva = new Date(reserva.dia);
          }
        } catch (e) {
          console.error('Erro ao processar data:', e);
          dataReserva = new Date();
        }
      }
      
      if (isNaN(dataReserva.getTime())) {
        dataReserva = new Date();
      }
      
    setNovaData(dataReserva);
      
      const horarioFormatado = reserva.horario ? formatarHorarioBrasil(reserva.horario) : '';
      setNovoHorario(horarioFormatado || '');
    }
  } catch (error) {
    console.error('Erro ao editar reserva:', error);
    showError('Erro ao abrir edição. Tente novamente.');
  }
};

const validarHorario = (horario) => {
  return /^([01]?\d|2[0-3]):([0-5]\d)$/.test(horario);
};

const handleSalvarEdicao = async () => {
  if (!novaData) {
    showError("Data inválida.");
    return;
  }

  if (!validarHorario(novoHorario)) {
    showError("Horário inválido! Use o formato HH:MM.");
    return;
  }

  const dataFormatada = formatarDataBrasil(novaData);

  try {
    const reservaId = reservaEditando.id;  

    if (!reservaId) {
      showError("Consulta não encontrada.");
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
      success("Edição enviada! Aguardando confirmação do profissional.");
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
    showError("Erro ao editar consulta. Tente novamente.");
  }
};

const adicionarDiaReserva = (e) => {
    if (e) e.preventDefault();

    if (!dataSelecionada || !horario) {
      warning('Por favor, preencha todos os campos.');
      return;
    }
    const dataFormatada = formatarDataBrasil(dataSelecionada);
    
    const jaNaLista = reservasTemporarias.some(res => 
      res.dia === dataFormatada && res.horario === horario
    );

    if (jaNaLista) {
      warning('Você já adicionou este horário à lista.');
      return;
    }

    const jaReservado = reservas.some(res => {
      let dataReserva = res.dia;
      if (typeof res.dia === 'string' && res.dia.includes('T')) {
          dataReserva = res.dia.split('T')[0];
      }
      return dataReserva === dataFormatada && 
             formatarHorarioBrasil(res.horario) === formatarHorarioBrasil(horario) && 
             res.status !== 'cancelado' && 
             res.status !== 'recusado' &&
             res.status !== 'negado';
    });

    if (jaReservado) {
      warning('Você já possui um agendamento neste horário.');
      return;
    }

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
      success('Solicitação Enviada!');
      return;
    }
  
    if (!user) {
      warning('Você precisa estar logado para fazer uma consulta.');
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
      showError('Erro ao tentar enviar as consultas. Tente novamente.');
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
              {profissionalInfo && nome && (
                <InfoProfissionalContainer>
                  <InfoTitle>Informações do Profissional</InfoTitle>
                  
                  <InfoSection>
                    <InfoLabel>Nome:</InfoLabel>
                    <InfoValue>{profissionalInfo.nome} {profissionalInfo.sobrenome}</InfoValue>
                  </InfoSection>

                  {(profissionalInfo.cidade || profissionalInfo.ufRegiao) && (
                    <InfoSection>
                      <InfoLabel>Localização:</InfoLabel>
                      <InfoValue>
                        {profissionalInfo.cidade && profissionalInfo.ufRegiao 
                          ? `${profissionalInfo.cidade}, ${profissionalInfo.ufRegiao}`
                          : profissionalInfo.cidade || profissionalInfo.ufRegiao}
                      </InfoValue>
                    </InfoSection>
                  )}

                  {profissionalInfo.descricao && (
                    <InfoSection>
                      <InfoLabel>Descrição:</InfoLabel>
                      <InfoDescription>{profissionalInfo.descricao}</InfoDescription>
                    </InfoSection>
                  )}

                  {profissionalInfo.publicoAtendido && (
                    <InfoSection>
                      <InfoLabel>Público Atendido:</InfoLabel>
                      <InfoValue>{profissionalInfo.publicoAtendido}</InfoValue>
                    </InfoSection>
                  )}

                  {profissionalInfo.modalidade && (
                    <InfoSection>
                      <InfoLabel>Modalidade:</InfoLabel>
                      <div>
                        {profissionalInfo.modalidade.split(',').map((mod, index) => (
                          <ModalidadeTag key={index}>
                            {mod.trim() === 'presencial' ? 'Presencial' :
                             mod.trim() === 'online' ? 'Online' :
                             mod.trim() === 'domiciliar' ? 'Domiciliar' : mod.trim()}
                          </ModalidadeTag>
                        ))}
                      </div>
                    </InfoSection>
                  )}

                  {profissionalInfo.valorConsulta && (
                    <InfoSection>
                      <InfoLabel>Valor da Consulta:</InfoLabel>
                      <InfoValue>
                        {profissionalInfo.valorConsulta === 'A negociar' 
                          ? 'A negociar' 
                          : `R$ ${parseFloat(profissionalInfo.valorConsulta).toFixed(2).replace('.', ',')}`
                        }
                      </InfoValue>
                    </InfoSection>
                  )}
                </InfoProfissionalContainer>
              )}

              <AgendamentoContainer>
                <FormularioReserva onSubmit={handleReserva}>
                <DataHorarioMapaContainer>
                  <DataHorarioWrapper>
                    <label>Data:</label>
                    <DatePickerWrapper>
                      <DatePicker
                        selected={dataSelecionada}
                        onChange={(date) => setDataSelecionada(date)}
                        minDate={new Date()}
                        filterDate={isDateAvailable}
                        dateFormat="dd/MM/yyyy"
                        locale={ptBR}
                        showPopperArrow={false}
                        required
                      />
                    </DatePickerWrapper>
                    <label>Horário:</label>
                    <select
                      value={horario}
                      onChange={(e) => {
                        setHorario(e.target.value);
                        setHorarioFinal(calcularHorarioFinal(e.target.value));
                      }}
                      required
                      style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '100%',
                        fontSize: '16px',
                        marginTop: '5px'
                      }}
                    >
                      <option value="">Selecione um horário</option>
                      {horariosDisponiveis.map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>

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
                  </DataHorarioWrapper>
                  {profissionalLocation && !isNaN(profissionalLocation.lat) && !isNaN(profissionalLocation.lng) ? (
                    <MapaContainer>
                      <MapWrapper>
                        <MapContainer
                          key={`map-${profissionalLocation.lat}-${profissionalLocation.lng}`}
                          center={[profissionalLocation.lat, profissionalLocation.lng]}
                          zoom={13}
                          style={{ height: '300px', width: '100%' }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[profissionalLocation.lat, profissionalLocation.lng]} />
                        </MapContainer>
                      </MapWrapper>
                      {enderecoCompleto && (
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: '5px', 
                          fontSize: '14px',
                          color: '#333',
                          textAlign: 'center'
                        }}>
                          <strong>📍 Endereço:</strong> {enderecoCompleto}
                        </div>
                      )}
                    </MapaContainer>
                  ) : (
                    nome && (
                      <div style={{ 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '5px', 
                        fontSize: '14px',
                        color: '#666',
                        textAlign: 'center',
                        flex: 1,
                        minWidth: '300px'
                      }}>
                        Localização não disponível para este profissional.
                      </div>
                    )
                  )}
                </DataHorarioMapaContainer>
                <Button_geral>
                  <Button onClick={enviarReservas}>Solicitar Consulta</Button>
                  <Button onClick={adicionarDiaReserva} style={{backgroundColor: 'green'}}>Adicionar Dia</Button>
                </Button_geral>
              </FormularioReserva>
              </AgendamentoContainer>
            </>
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
                <Button color="orange" onClick={() => handleEditar(reserva.id)}>Editar</Button>
  
                {reservaEditando && reservaEditando.id === reserva.id && novaData && (
                  <ContainerEdicao>
                    <Label>Data:</Label>
                    <DatePickerWrapper>
                      <DatePicker
                        selected={novaData}
                        onChange={(date) => {
                          if (date) {
                            setNovaData(date);
                          }
                        }}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        locale={ptBR}
                        showPopperArrow={false}
                        required
                      />
                    </DatePickerWrapper>
  
                    <Label>Horário:</Label>
                    <Input 
                      type="text" 
                      placeholder="HH:MM (ex: 14:30)"
                      value={novoHorario || ''} 
                      onChange={(e) => {
                        let valor = e.target.value.replace(/\D/g, '');
                        
                        if (valor.length <= 2) {
                          setNovoHorario(valor);
                        } else if (valor.length <= 4) {
                          setNovoHorario(valor.slice(0, 2) + ':' + valor.slice(2));
                        } else {
                          setNovoHorario(valor.slice(0, 2) + ':' + valor.slice(2, 4));
                        }
                      }}
                      onBlur={(e) => {
                        let valor = e.target.value;
                        if (!valor) return;
                        
                        if (valor.includes(' ')) {
                          const partes = valor.split(' ');
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
                            
                            valor = `${String(horas).padStart(2, '0')}:${minuto || '00'}`;
                          }
                        }
                        
                        try {
                          const horarioFormatado = formatarHorarioBrasil(valor);
                          if (horarioFormatado && horarioFormatado.match(/^\d{2}:\d{2}$/)) {
                            const [h, m] = horarioFormatado.split(':');
                            if (parseInt(h) >= 0 && parseInt(h) <= 23 && parseInt(m) >= 0 && parseInt(m) <= 59) {
                              setNovoHorario(horarioFormatado);
                            }
                          } else if (valor.match(/^\d{2}:\d{2}$/)) {
                            const [h, m] = valor.split(':');
                            if (parseInt(h) >= 0 && parseInt(h) <= 23 && parseInt(m) >= 0 && parseInt(m) <= 59) {
                              setNovoHorario(valor);
                            }
                          }
                        } catch (error) {
                          console.error('Erro ao formatar horário:', error);
                        }
                      }}
                      maxLength={5}
                    />
  
                    <Button onClick={handleSalvarEdicao}>Confirmar Edição</Button>
                    <Button onClick={() => setReservaEditando(null)} style={{ marginLeft: '10px', backgroundColor: 'gray', color: 'white' }}>
                      Cancelar
                    </Button>
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