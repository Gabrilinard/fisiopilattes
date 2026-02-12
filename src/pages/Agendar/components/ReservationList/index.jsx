import { ptBR } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import {
  Button,
  ContainerEdicao,
  DatePickerWrapper,
  Input,
  Label,
  MensagemStatus,
  Reserva_2,
  ReservasContainer,
  ReservaItem as StyledReservaItem
} from '../../style';
import { formatarDataExibicao, formatarHorarioBrasil } from '../../utils/formatters';

const ReservationItem = ({ reserva, actions }) => {
  const { 
    handleEditar, 
    handleSalvarEdicao, 
    confirmarAlteracao, 
    desistirReserva, 
    reservaEditando, 
    novaData, 
    setNovaData, 
    novoHorario, 
    setNovoHorario 
  } = actions;

  const isEditing = reservaEditando && reservaEditando.id === reserva.id;

  const handleHorarioChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    
    if (valor.length <= 2) {
      setNovoHorario(valor);
    } else if (valor.length <= 4) {
      setNovoHorario(valor.slice(0, 2) + ':' + valor.slice(2));
    } else {
      setNovoHorario(valor.slice(0, 2) + ':' + valor.slice(2, 4));
    }
  };

  const handleHorarioBlur = (e) => {
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
      console.error("Erro ao formatar horário:", error);
    }
  };

  return (
    <StyledReservaItem>
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
        ) : reserva.status === 'aguardando_confirmacao_paciente' ? (
          <>
            <br />
            <span style={{ color: 'blue', fontWeight: 'bold' }}>Alteração Solicitada pelo Profissional</span>
            <p>Novo horário: {formatarDataExibicao(reserva.dia)} às {formatarHorarioBrasil(reserva.horario)}</p>
            <div style={{ marginTop: '10px' }}>
              <Button 
                onClick={() => confirmarAlteracao(reserva)} 
                style={{ backgroundColor: 'green', color: 'white', marginRight: '10px', fontSize: '14px', padding: '5px 10px' }}
              >
                Confirmar Alteração
              </Button>
              <Button 
                onClick={() => desistirReserva(reserva)} 
                style={{ backgroundColor: 'red', color: 'white', fontSize: '14px', padding: '5px 10px' }}
              >
                Desistir
              </Button>
            </div>
          </>
        ) : (
          <>
            <br />
            <span style={{ color: 'orange' }}>Aguardando Confirmação</span>
          </>
        )}
      </MensagemStatus>
      
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <Button color="orange" onClick={() => handleEditar(reserva)}>Editar</Button>
        <Button color="#dc3545" onClick={() => desistirReserva(reserva)}>Cancelar Solicitação</Button>
      </div>

      {isEditing && novaData && (
        <ContainerEdicao>
          <Label>Data:</Label>
          <DatePickerWrapper>
            <DatePicker
              selected={novaData}
              onChange={(date) => date && setNovaData(date)}
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
            onChange={handleHorarioChange}
            onBlur={handleHorarioBlur}
          />
          
          <Button onClick={handleSalvarEdicao} style={{ backgroundColor: '#4CAF50', color: 'white', marginTop: '10px' }}>
            Salvar Edição
          </Button>
          <Button onClick={() => actions.setReservaEditando(null)} style={{ backgroundColor: '#f44336', color: 'white', marginTop: '5px' }}>
            Cancelar
          </Button>
        </ContainerEdicao>
      )}
    </StyledReservaItem>
  );
};

const ReservationList = ({ reservas, actions }) => {
  if (!reservas || reservas.length === 0) {
    return (
      <ReservasContainer>
        <h3>Consultas Confirmadas</h3>
        <p>Você não possui consultas agendadas.</p>
      </ReservasContainer>
    );
  }

  const reservasOrdenadas = [...reservas].sort((a, b) => {
    const dataDiff = a.dia.localeCompare(b.dia);
    if (dataDiff !== 0) return dataDiff;
    return a.horario.localeCompare(b.horario);
  });

  return (
    <ReservasContainer>
      <h3>Consultas Confirmadas</h3>
      <Reserva_2>
        {reservasOrdenadas.map(reserva => (
          <ReservationItem key={reserva.id} reserva={reserva} actions={actions} />
        ))}
      </Reserva_2>
    </ReservasContainer>
  );
};

export default ReservationList;
