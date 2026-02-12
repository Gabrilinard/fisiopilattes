import { useLocation } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import EmergencyModal from './components/EmergencyModal';
import MapComponent from './components/MapComponent';
import ProfessionalInfo from './components/ProfessionalInfo';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import { useAgendamento } from './hooks/useAgendamento';
import { useEmailNotification } from './hooks/useEmailNotification';
import { useEmergencia } from './hooks/useEmergencia';
import { useProfissional } from './hooks/useProfissional';
import { useReservaActions } from './hooks/useReservaActions';
import { useReservas } from './hooks/useReservas';

import {
  Container,
  Container_Important,
  ContainerGeral,
  TituloAgendamento
} from './style';

const Agendar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { nome: nomeProfissional } = location.state || {};
    const emailNotification = useEmailNotification(user);

    const { 
        profissionalInfo, 
        profissionalLocation, 
        enderecoCompleto, 
        reservasProfissional 
    } = useProfissional(nomeProfissional);

    const {
        dataSelecionada,
        setDataSelecionada,
        horario,
        setHorario,
        horariosDisponiveis,
        isDateAvailable,
        adicionarDiaReserva,
        enviarReservasEmLote,
        reservasTemporarias,
        datasSelecionadas
    } = useAgendamento(user, profissionalInfo, reservasProfissional, nomeProfissional, emailNotification);

    const {
        reservas,
        fetchReservas,
        loading: reservasLoading
    } = useReservas(user, profissionalInfo?.id);

    const reservaActions = useReservaActions(user, fetchReservas, emailNotification);

    const {
        showEmergencyModal,
        setShowEmergencyModal,
        urgenciaDescricao,
        setUrgenciaDescricao,
        urgenciaHorario,
        setUrgenciaHorario,
        urgenciaArquivo,
        setUrgenciaArquivo,
        handleEmergencySubmit
    } = useEmergencia(user, nomeProfissional);

    return (
        <ContainerGeral>
            <Header />
            <Container>
                {nomeProfissional ? (
                    <TituloAgendamento>Agendar com {nomeProfissional}</TituloAgendamento>
                ) : (
                    <h2>Agendar Consulta</h2>
                )}

                <Container_Important>
                    {profissionalInfo && nomeProfissional && (
                        <ProfessionalInfo profissionalInfo={profissionalInfo} />
                    )}

                    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', flex: 1 }}>
                        <ReservationForm 
                            user={user}
                            nomeProfissional={nomeProfissional}
                            dataSelecionada={dataSelecionada}
                            setDataSelecionada={setDataSelecionada}
                            horario={horario}
                            setHorario={setHorario}
                            horariosDisponiveis={horariosDisponiveis}
                            isDateAvailable={isDateAvailable}
                            adicionarDiaReserva={() => adicionarDiaReserva(reservas)}
                            enviarReservas={enviarReservasEmLote}
                            reservasTemporarias={reservasTemporarias}
                            datasSelecionadas={datasSelecionadas}
                            onEmergencyClick={() => setShowEmergencyModal(true)}
                            MapComponent={
                                <MapComponent 
                                    location={profissionalLocation} 
                                    endereco={enderecoCompleto}
                                />
                            }
                        />
                    </div>
                </Container_Important>

                <ReservationList 
                    reservas={reservas} 
                    actions={reservaActions}
                />
            </Container>
            
            <EmergencyModal 
                show={showEmergencyModal}
                onClose={() => setShowEmergencyModal(false)}
                onSubmit={handleEmergencySubmit}
                user={user}
                urgenciaDescricao={urgenciaDescricao}
                setUrgenciaDescricao={setUrgenciaDescricao}
                urgenciaHorario={urgenciaHorario}
                setUrgenciaHorario={setUrgenciaHorario}
                urgenciaArquivo={urgenciaArquivo}
                setUrgenciaArquivo={setUrgenciaArquivo}
            />
            
            <Footer />
        </ContainerGeral>
    );
};

export default Agendar;
