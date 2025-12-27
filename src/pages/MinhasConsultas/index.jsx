import axios from 'axios';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import {
    ButtonsContainer,
    CancelButton,
    ConsultaCard,
    ConsultaHeader,
    ConsultaInfo,
    ConsultaInfoRow,
    ConsultaLabel,
    ConsultasContainer,
    ConsultaValue,
    Container,
    DatePickerWrapper,
    DrawerContainer,
    DrawerHeader,
    DrawerTitle,
    EditButton,
    EmptyMessage,
    FormContainer,
    FormInput,
    FormLabel,
    StatusBadge,
    Title
} from './style';

const MinhasConsultas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [consultaEditando, setConsultaEditando] = useState(null);
  const [novaData, setNovaData] = useState(new Date());
  const [novoHorario, setNovoHorario] = useState('');

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/Entrar');
      return;
    }

    buscarConsultas();
  }, [user]);

  const buscarConsultas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/reservas?usuario_id=${user.id}`);
      const consultasData = response.data || [];
      
      // Carregar nomes dos profissionais
      const consultasComNomes = await Promise.all(
        consultasData.map(async (consulta) => {
          if (consulta.profissional_id) {
            try {
              const profResponse = await axios.get(`http://localhost:3000/usuarios/solicitarDados/${consulta.profissional_id}`);
              return {
                ...consulta,
                nomeProfissional: `${profResponse.data.nome} ${profResponse.data.sobrenome}`
              };
            } catch (error) {
              console.error('Erro ao buscar nome do profissional:', error);
              return { ...consulta, nomeProfissional: 'Profissional não encontrado' };
            }
          }
          return consulta;
        })
      );
      
      setConsultas(consultasComNomes);
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      showError('Erro ao carregar suas consultas.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dataString;
    }
  };

  const formatarHorario = (horario) => {
    if (!horario) return '';
    if (typeof horario !== 'string') {
      horario = String(horario);
    }
    
    const matchHHMM = horario.match(/^(\d{1,2}):(\d{2})/);
    if (matchHHMM) {
      const horas = String(parseInt(matchHHMM[1], 10)).padStart(2, '0');
      const minutos = matchHHMM[2];
      return `${horas}:${minutos}`;
    }
    
    return horario;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmado':
        return '#28a745';
      case 'pendente':
        return '#ffc107';
      case 'negado':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'negado':
        return 'Negado';
      default:
        return 'Pendente';
    }
  };

  const handleCancelarConsulta = async (consultaId) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/reservas/${consultaId}`);
      success('Consulta cancelada com sucesso!');
      buscarConsultas();
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
      showError('Erro ao cancelar consulta.');
    }
  };

  const handleEditarConsulta = (consulta) => {
    setConsultaEditando(consulta);
    
    let dataReserva = new Date();
    if (consulta.dia) {
      try {
        if (typeof consulta.dia === 'string') {
          let dataParaFormatar = consulta.dia;
          if (consulta.dia.includes('T')) {
            dataParaFormatar = consulta.dia.split('T')[0];
          }
          const partes = dataParaFormatar.split('-');
          if (partes.length === 3) {
            const [ano, mes, dia] = partes;
            dataReserva = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
          } else {
            dataReserva = new Date(dataParaFormatar + 'T00:00:00');
          }
        } else {
          dataReserva = new Date(consulta.dia);
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
    setNovoHorario(formatarHorario(consulta.horario) || '');
    setShowEditDrawer(true);
  };

  const formatarDataBrasil = (data) => {
    if (!data) return '';
    const dataLocal = new Date(data);
    const ano = dataLocal.getFullYear();
    const mes = String(dataLocal.getMonth() + 1).padStart(2, '0');
    const dia = String(dataLocal.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
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
      const reservaId = consultaEditando.id;

      if (!reservaId) {
        showError("Consulta não encontrada.");
        return;
      }

      const [horas, minutos] = novoHorario.split(':').map(Number);
      const horarioObj = new Date();
      horarioObj.setHours(horas, minutos, 0);
      horarioObj.setHours(horarioObj.getHours() + 1);
      const novoHorarioFinal = horarioObj.toTimeString().slice(0, 5);

      const response = await axios.patch(`http://localhost:3000/reservas/editar/${reservaId}`, {
        dia: dataFormatada,
        horario: novoHorario,
        horarioFinal: novoHorarioFinal,
        qntd_pessoa: consultaEditando.qntd_pessoa || 1,
        status: "pendente"
      });

      if (response.status === 200) {
        success("Edição enviada! Aguardando confirmação do profissional.");
        setShowEditDrawer(false);
        setConsultaEditando(null);
        buscarConsultas();
      }
    } catch (error) {
      console.error('Erro ao editar consulta:', error);
      showError('Erro ao editar consulta.');
    }
  };


  if (loading) {
    return (
      <Container>
        <Header />
        <ConsultasContainer>
          <EmptyMessage>Carregando suas consultas...</EmptyMessage>
        </ConsultasContainer>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <ConsultasContainer>
        <Title>Minhas Consultas</Title>
        
        {consultas.length === 0 ? (
          <EmptyMessage>
            Você não possui consultas agendadas no momento.
          </EmptyMessage>
        ) : (
          consultas.map((consulta) => (
            <ConsultaCard key={consulta.id}>
              <ConsultaHeader>
                <StatusBadge color={getStatusColor(consulta.status)}>
                  {getStatusLabel(consulta.status)}
                </StatusBadge>
              </ConsultaHeader>
              
              <ConsultaInfo>
                {consulta.nomeProfissional && (
                  <ConsultaInfoRow>
                    <ConsultaLabel>Profissional:</ConsultaLabel>
                    <ConsultaValue>{consulta.nomeProfissional}</ConsultaValue>
                  </ConsultaInfoRow>
                )}
                
                <ConsultaInfoRow>
                  <ConsultaLabel>Data:</ConsultaLabel>
                  <ConsultaValue>{formatarData(consulta.dia)}</ConsultaValue>
                </ConsultaInfoRow>
                
                <ConsultaInfoRow>
                  <ConsultaLabel>Horário:</ConsultaLabel>
                  <ConsultaValue>{formatarHorario(consulta.horario)}</ConsultaValue>
                </ConsultaInfoRow>
              </ConsultaInfo>
              
              <ButtonsContainer>
                <EditButton onClick={() => handleEditarConsulta(consulta)}>
                  Editar
                </EditButton>
                <CancelButton onClick={() => handleCancelarConsulta(consulta.id)}>
                  Cancelar Consulta
                </CancelButton>
              </ButtonsContainer>
            </ConsultaCard>
          ))
        )}
      </ConsultasContainer>

      <DrawerContainer isOpen={showEditDrawer}>
        <DrawerHeader>
          <DrawerTitle>Editar Consulta</DrawerTitle>
        </DrawerHeader>
        
        <FormContainer>
          <FormLabel>Data:</FormLabel>
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

          <FormLabel>Horário:</FormLabel>
          <FormInput
            type="text"
            placeholder="HH:MM (ex: 14:30)"
            value={novoHorario}
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
            required
          />

          <ButtonsContainer>
            <EditButton onClick={handleSalvarEdicao}>
              Salvar
            </EditButton>
            <CancelButton onClick={() => {
              setShowEditDrawer(false);
              setConsultaEditando(null);
            }}>
              Cancelar
            </CancelButton>
          </ButtonsContainer>
        </FormContainer>
      </DrawerContainer>
      
      <Footer />
    </Container>
  );
};

export default MinhasConsultas;

