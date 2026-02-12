import { ptBR } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    AgendamentoContainer,
    Button,
    Button_geral,
    DataHorarioMapaContainer,
    DataHorarioWrapper,
    DatePickerWrapper,
    Div,
    Div_2,
    FormularioReserva,
    H3,
    Label,
    Linha,
    Lista,
    Paragrafo,
    Selecao
} from '../../style';
import { formatarHorarioBrasil } from '../../utils/formatters';

const ReservationForm = ({
  user,
  nomeProfissional,
  dataSelecionada,
  setDataSelecionada,
  horario,
  setHorario,
  horariosDisponiveis,
  isDateAvailable,
  adicionarDiaReserva,
  enviarReservas,
  reservasTemporarias,
  datasSelecionadas,
  onEmergencyClick,
  MapComponent
}) => {
  
  return (
    <AgendamentoContainer>
    <FormularioReserva onSubmit={(e) => e.preventDefault()}>
      <H3>Agendar Consulta</H3>
      
      <DataHorarioMapaContainer>
        <DataHorarioWrapper>
          <DatePickerWrapper>
            <Label>Selecione a Data</Label>
            <DatePicker
              selected={dataSelecionada}
              onChange={(date) => setDataSelecionada(date)}
              minDate={new Date()}
              filterDate={isDateAvailable}
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              inline
            />
          </DatePickerWrapper>

          <div style={{ flex: 1 }}>
            <Label>Selecione o Horário</Label>
            <div style={{marginTop: '5px'}}>
            <select
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              required
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '100%',
                fontSize: '16px'
              }}
            >
              <option value="">Selecione um horário</option>
              {horariosDisponiveis.map((h, index) => (
                <option key={index} value={formatarHorarioBrasil(h)}>
                  {formatarHorarioBrasil(h)}
                </option>
              ))}
            </select>
            </div>
            {horariosDisponiveis.length === 0 && (
              <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                Não há horários disponíveis para esta data.
              </p>
            )}

            {datasSelecionadas && datasSelecionadas.length > 0 && (
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
          </div>
        </DataHorarioWrapper>
        
        {MapComponent}

      </DataHorarioMapaContainer>

      <Button_geral>
        <Button onClick={enviarReservas}>Solicitar Consulta</Button>
        <Button onClick={adicionarDiaReserva} style={{backgroundColor: 'green'}}>Adicionar Dia</Button>
        <Button onClick={onEmergencyClick} style={{backgroundColor: 'orange', color: 'white'}}>Emergência</Button>
      </Button_geral>
    </FormularioReserva>
    </AgendamentoContainer>
  );
};

export default ReservationForm;
