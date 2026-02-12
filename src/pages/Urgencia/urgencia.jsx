import axios from 'axios';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import {
    AcceptButton,
    Actions,
    AttachmentLink,
    Button,
    Container,
    Content,
    DenyButton,
    DescriptionBox,
    EditButton,
    EmptyState,
    InfoGroup,
    InfoLabel,
    InfoValue,
    ModalContent,
    ModalOverlay,
    Title,
    UrgenciaCard,
    UrgenciaList
} from './style';

const Urgencia = () => {
  const { user } = useAuth();
  const { success, error: showError, warning } = useNotification();
  const [urgencias, setUrgencias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  // States for Deny Modal
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [denyingId, setDenyingId] = useState(null);
  const [denyReason, setDenyReason] = useState('');

  useEffect(() => {
    fetchUrgencias();
  }, [user]);

  const fetchUrgencias = async () => {
    if (!user) return;

    try {
      const isProfissional = user.tipoUsuario === 'profissional';
      const url = isProfissional
        ? `http://localhost:3000/reservas?profissional_id=${user.id}`
        : 'http://localhost:3000/reservas';

      const response = await axios.get(url);
      const urgentRequests = response.data.filter(reserva => 
        reserva.is_urgente && 
        (reserva.status === 'pendente' || reserva.status === 'aguardando_confirmacao_paciente')
      );
      
      urgentRequests.sort((a, b) => {
        const dateA = new Date(a.dia);
        const dateB = new Date(b.dia);
        if (dateA - dateB !== 0) return dateA - dateB;
        return (a.horario || '').localeCompare(b.horario || '');
      });

      setUrgencias(urgentRequests);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar urgências:', error);
      showError('Erro ao carregar solicitações de urgência.');
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const date = new Date(dataString);
    if (isNaN(date.getTime())) {
        if (typeof dataString === 'string' && dataString.includes('-')) {
            const parts = dataString.split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }
        return dataString;
    }
    return date.toLocaleDateString('pt-BR');
  };

  const formatarHorario = (horario) => {
    if (!horario) return '';
    if (horario.length > 5) return horario.substring(0, 5);
    return horario;
  };

  const handleAccept = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/reservas/${id}`, { status: 'confirmado' });
      success('Solicitação de urgência aceita com sucesso!');
      fetchUrgencias();
    } catch (error) {
      console.error('Erro ao aceitar urgência:', error);
      showError('Erro ao aceitar solicitação.');
    }
  };

  const handleDenySubmit = async () => {
    if (!denyReason) {
      warning('Por favor, informe o motivo.');
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/reservas/negado/${denyingId}`, { 
        status: 'negado',
        motivoNegacao: denyReason 
      });
      success('Solicitação negada com sucesso.');
      setShowDenyModal(false);
      setDenyReason('');
      setDenyingId(null);
      fetchUrgencias();
    } catch (error) {
      console.error('Erro ao negar urgência:', error);
      showError('Erro ao negar solicitação.');
    }
  };

  const openEditModal = (reserva) => {
    setEditingId(reserva.id);
    let dateStr = '';
    if (reserva.dia) {
        if (typeof reserva.dia === 'string') {
            dateStr = reserva.dia.split('T')[0];
        } else {
            dateStr = new Date(reserva.dia).toISOString().split('T')[0];
        }
    }
    setEditDate(dateStr);
    setEditTime(reserva.horario || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        const [horas, minutos] = editTime.split(':').map(Number);
        const horarioObj = new Date();
        horarioObj.setHours(horas, minutos, 0);
        horarioObj.setHours(horarioObj.getHours() + 1);
        const horarioFinal = horarioObj.toTimeString().slice(0, 5);

        await axios.patch(`http://localhost:3000/reservas/${editingId}`, {
            dia: editDate,
            horario: editTime,
            horarioFinal: horarioFinal,
            status: 'aguardando_confirmacao_paciente' // Reset status to pending confirmation if changed
        });

        success('Agendamento atualizado com sucesso!');
        setShowEditModal(false);
        fetchUrgencias();
    } catch (error) {
        console.error('Erro ao editar agendamento:', error);
        showError('Erro ao atualizar agendamento.');
    }
  };

  return (
    <Container>
      <Content>
        <Title>🚨 Solicitações de Urgência</Title>
        
        {loading ? (
          <p>Carregando...</p>
        ) : urgencias.length === 0 ? (
          <EmptyState>Nenhuma solicitação de urgência pendente.</EmptyState>
        ) : (
          <UrgenciaList>
            {urgencias.map(reserva => (
              <UrgenciaCard key={reserva.id}>
                <InfoGroup>
                  <InfoLabel>Paciente</InfoLabel>
                  <InfoValue>{reserva.nome} {reserva.sobrenome}</InfoValue>
                  <InfoLabel>Contato</InfoLabel>
                  <InfoValue>{reserva.telefone}</InfoValue>
                </InfoGroup>
                
                <InfoGroup>
                  <InfoLabel>Data Preferencial</InfoLabel>
                  <InfoValue>{formatarData(reserva.dia)}</InfoValue>
                  <InfoLabel>Horário</InfoLabel>
                  <InfoValue>{formatarHorario(reserva.horario)}</InfoValue>
                </InfoGroup>

                <InfoGroup style={{flex: 2}}>
                  <InfoLabel>Descrição da Urgência</InfoLabel>
                  <DescriptionBox>
                    {reserva.descricao_urgencia}
                  </DescriptionBox>
                  {reserva.arquivo_urgencia && (
                    <AttachmentLink href={`http://localhost:3000${reserva.arquivo_urgencia}`} target="_blank" rel="noopener noreferrer">
                      📎 Visualizar Anexo/Comprovante
                    </AttachmentLink>
                  )}
                </InfoGroup>

                <Actions>
                  <AcceptButton onClick={() => handleAccept(reserva.id)}>Aceitar</AcceptButton>
                  <EditButton onClick={() => openEditModal(reserva)}>Ajustar</EditButton>
                  <DenyButton onClick={() => {
                    setDenyingId(reserva.id);
                    setShowDenyModal(true);
                  }}>Negar</DenyButton>
                </Actions>
              </UrgenciaCard>
            ))}
          </UrgenciaList>
        )}
      </Content>
      <Footer />

      {showEditModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Ajustar Horário/Data</h3>
            <form onSubmit={handleEditSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label style={{display: 'block', marginBottom: '5px'}}>Data:</label>
                    <input 
                        type="date" 
                        value={editDate} 
                        onChange={(e) => setEditDate(e.target.value)}
                        required
                        style={{width: '100%', padding: '8px'}}
                    />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label style={{display: 'block', marginBottom: '5px'}}>Horário:</label>
                    <input 
                        type="time" 
                        value={editTime} 
                        onChange={(e) => setEditTime(e.target.value)}
                        required
                        style={{width: '100%', padding: '8px'}}
                    />
                </div>
                <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                    <Button type="button" onClick={() => setShowEditModal(false)} style={{backgroundColor: '#999'}}>Cancelar</Button>
                    <Button type="submit" style={{backgroundColor: '#1976d2'}}>Salvar Ajuste</Button>
                </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {showDenyModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Negar Solicitação</h3>
            <p>Por favor, informe o motivo da negação:</p>
            <textarea 
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                style={{width: '100%', minHeight: '100px', padding: '10px', marginBottom: '15px'}}
                placeholder="Motivo..."
            />
            <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <Button onClick={() => setShowDenyModal(false)} style={{backgroundColor: '#999'}}>Cancelar</Button>
                <Button onClick={handleDenySubmit} style={{backgroundColor: '#c62828'}}>Confirmar Negação</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Urgencia;
