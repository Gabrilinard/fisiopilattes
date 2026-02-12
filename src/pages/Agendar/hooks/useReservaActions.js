import { useState } from 'react';
import { useNotification } from '../../../contexts/NotificationContext';
import { agendarService } from '../services/api';
import { formatarDataBrasil, formatarHorarioBrasil } from '../utils/formatters';

export const useReservaActions = (user, fetchReservas, emailNotification) => {
  const { success, error: showError } = useNotification();
  const { 
    setFaltasCount, 
    setEdicoesCount, 
    sendEmailNotification, 
    solicitCount, 
    faltasCount, 
    edicoesCount 
  } = emailNotification;

  const [reservaEditando, setReservaEditando] = useState(null);
  const [novaData, setNovaData] = useState(new Date());
  const [novoHorario, setNovoHorario] = useState('');
  const [tempoFalta, setTempoFalta] = useState({});

  const handleFaltar = async (id) => {
    const tempo = tempoFalta[id];

    if (!tempo) {
      showError("Por favor, insira o tempo da falta.");
      return;
    }

    try {
      await agendarService.solicitarFalta(id, tempo);
      setFaltasCount(prevCount => prevCount + 1);
      success("Falta registrada com sucesso!");
      
      fetchReservas();
    } catch (error) {
      console.error('Erro ao marcar falta:', error);
      showError('Erro ao marcar falta.');
    }
  };

  const handleEditar = (reserva) => {
    try {
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

      await agendarService.editarReserva(reservaId, {
        dia: dataFormatada,
        horario: novoHorario,
        horarioFinal: novoHorarioFinal,
        qntd_pessoa: 1,
        status: "pendente"
      });

      success("Edição enviada! Aguardando confirmação do profissional.");
      
      setEdicoesCount((prevCount) => prevCount + 1);
      setReservaEditando(null);
      fetchReservas();
    } catch (error) {
      console.error("Erro ao editar consulta:", error);
      showError("Erro ao editar consulta. Tente novamente.");
    }
  };

  const confirmarAlteracao = async (reserva) => {
    try {
      await agendarService.updateReservaStatus(reserva.id, 'confirmado');
      success('Alteração confirmada com sucesso!');
      fetchReservas();
    } catch (error) {
      console.error('Erro ao confirmar alteração:', error);
      showError('Erro ao confirmar alteração.');
    }
  };

  const desistirReserva = async (reserva) => {
    if (window.confirm('Tem certeza que deseja desistir desta consulta?')) {
      try {
        await agendarService.deleteReserva(reserva.id);
        success('Consulta cancelada com sucesso.');
        fetchReservas();
      } catch (error) {
        console.error('Erro ao cancelar consulta:', error);
        showError('Erro ao cancelar consulta.');
      }
    }
  };

  return {
    reservaEditando,
    setReservaEditando,
    novaData,
    setNovaData,
    novoHorario,
    setNovoHorario,
    tempoFalta,
    setTempoFalta,
    handleFaltar,
    handleEditar,
    handleSalvarEdicao,
    confirmarAlteracao,
    desistirReserva
  };
};
