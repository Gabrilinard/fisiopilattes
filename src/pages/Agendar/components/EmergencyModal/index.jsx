import React from 'react';
import { formatarHorarioBrasil } from '../../utils/formatters';
import { Label, Input, Button } from '../../style';

const EmergencyModal = ({
  show,
  onClose,
  onSubmit,
  user,
  urgenciaDescricao,
  setUrgenciaDescricao,
  urgenciaHorario,
  setUrgenciaHorario,
  urgenciaArquivo,
  setUrgenciaArquivo
}) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ textAlign: 'center', color: '#d32f2f', marginBottom: '20px' }}>Solicitação de Emergência</h2>
        
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <Label>Nome:</Label>
            <Input type="text" value={user?.nome || ''} disabled />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <Label>Telefone:</Label>
            <Input type="text" value={user?.telefone || ''} disabled />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <Label>Data:</Label>
            <Input type="text" value={new Date().toLocaleDateString('pt-BR')} disabled />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <Label>Horário da Urgência:</Label>
            <Input
              type="text"
              placeholder="HH:MM (ex: 14:30)"
              value={urgenciaHorario}
              onChange={(e) => {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length <= 2) {
                  setUrgenciaHorario(valor);
                } else if (valor.length <= 4) {
                  setUrgenciaHorario(valor.slice(0, 2) + ':' + valor.slice(2));
                } else {
                  setUrgenciaHorario(valor.slice(0, 2) + ':' + valor.slice(2, 4));
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
                      setUrgenciaHorario(horarioFormatado);
                    }
                  } else if (valor.match(/^\d{2}:\d{2}$/)) {
                    const [h, m] = valor.split(':');
                    if (parseInt(h) >= 0 && parseInt(h) <= 23 && parseInt(m) >= 0 && parseInt(m) <= 59) {
                      setUrgenciaHorario(valor);
                    }
                  }
                } catch (error) {
                  console.error('Erro ao formatar horário:', error);
                }
              }}
              maxLength={5}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <Label>Descrição da Urgência:</Label>
            <textarea
              value={urgenciaDescricao}
              onChange={(e) => setUrgenciaDescricao(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                minHeight: '100px'
              }}
              placeholder="Descreva o que você está sentindo..."
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <Label>Arquivo (Obrigatório):</Label>
            <Input
              type="file"
              onChange={(e) => setUrgenciaArquivo(e.target.files[0])}
              accept="image/*,.pdf"
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button type="button" onClick={onClose} style={{ backgroundColor: 'gray' }}>
              Cancelar
            </Button>
            <Button type="submit" style={{ backgroundColor: 'orange' }}>
              Enviar Solicitação
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyModal;
