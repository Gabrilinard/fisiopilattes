import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from '../../contexts/NotificationContext';
import { Button, Button_2, Container, DaysWrapper, DivInputContainer, DrawerContainer, DrawerHeader, DrawerTitle, FormContainer, Input, Label, Select, Table, TableWrapper, Td, Th, Wrapper } from './style';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminDashboard = () => {
  const [nomeReserva, setNomeReserva] = useState('');
  const [sobrenomeReserva, setSobrenomeReserva] = useState('');
  const [emailReserva, setEmailReserva] = useState('');
  const [diaReserva, setDiaReserva] = useState('');
  const [telefoneReserva, setTelefoneReserva] = useState('');
  const [horarioReserva, setHorarioReserva] = useState('');
  const [qntdPessoas, setQntdPessoas] = useState('');
  const [reservas, setReservas] = useState([]);
  const [userId, setUserId] = useState([]);
  const [motivo, setMotivo] = useState('');
  const [mostrarMotivo, setMostrarMotivo] = useState(null);
  const { logout, user } = useAuth();
  const { success, error: showError, warning } = useNotification();
  const [showReservas, setShowReservas] = useState(false);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [reservasPorData, setReservasPorData] = useState({});
  const [showConsultas, setShowConsultas] = useState(true);
  const [showMapEdit, setShowMapEdit] = useState(false);
  const [editLatitude, setEditLatitude] = useState(null);
  const [editLongitude, setEditLongitude] = useState(null);
  const [editCidade, setEditCidade] = useState('');
  const [editUfRegiao, setEditUfRegiao] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

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

  const formatarDataExibicao = (dataString) => {
    if (!dataString) return '';
    let dataObj;
    
    if (dataString instanceof Date) {
      dataObj = dataString;
    } else if (typeof dataString === 'string') {
      let dataParaFormatar = dataString;
      if (dataString.includes('T')) {
        dataParaFormatar = dataString.split('T')[0];
      }
      const partes = dataParaFormatar.split('-');
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        dataObj = new Date(dataParaFormatar);
      }
    } else {
      dataObj = new Date(dataString);
    }
    
    if (isNaN(dataObj.getTime())) {
      return dataString;
    }
    
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const diaSemana = diasSemana[dataObj.getDay()];
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    
    return `${diaSemana}, ${dia}/${mes}/${ano}`;
  };

  const formatarTelefone = (telefone) => {
    const somenteNumeros = telefone.replace(/\D/g, '');
    
    if (somenteNumeros.length <= 2) {
      return somenteNumeros;
    } else if (somenteNumeros.length <= 7) {
      return `${somenteNumeros.slice(0, 2)} ${somenteNumeros.slice(2)}`;
    } else {
      return `${somenteNumeros.slice(0, 2)} ${somenteNumeros.slice(2, 7)}-${somenteNumeros.slice(7, 11)}`;
    }
  };

  const buscarUsuarioPorId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/usuarios/solicitarDados/${id}`);
      const usuario = response.data;
      setNomeReserva(usuario.nome);
      setSobrenomeReserva(usuario.sobrenome);
      setEmailReserva(usuario.email);
      setTelefoneReserva(usuario.telefone);
    } catch (error) {
      console.log('Erro ao buscar usuário por ID:', error);
    }
};


  useEffect(() => {
    if (userId) {
      buscarUsuarioPorId(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!user || !user.id) {
      console.log('AdminDashboard: user não disponível ainda', { user });
      return;
    }
    
    console.log('AdminDashboard: user completo:', user);
    console.log('AdminDashboard: user.tipoUsuario:', user.tipoUsuario);
    console.log('AdminDashboard: user.id:', user.id);
    console.log('AdminDashboard: user.tipoUsuario === "profissional":', user.tipoUsuario === 'profissional');
    
    const isProfissional = user.tipoUsuario === 'profissional';
    const url = isProfissional
      ? `http://localhost:3000/reservas?profissional_id=${user.id}`
      : 'http://localhost:3000/reservas';
    
    console.log('Buscando reservas para:', { 
      userId: user.id, 
      tipoUsuario: user.tipoUsuario, 
      isProfissional,
      url 
    });
    
    axios.get(url)
      .then(response => {
        const reservasData = response.data;
        console.log('Reservas recebidas:', reservasData);
    
        setReservas(reservasData);
    
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
    
        const reservasPorDataObj = reservasData.reduce((acc, reserva) => {
          if (!reserva.dia) return acc;
          
          let dataReserva;
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
              dataReserva = new Date(dataParaFormatar);
            }
          } else {
            dataReserva = new Date(reserva.dia);
          }
          
          dataReserva.setHours(0, 0, 0, 0);
          
          if (dataReserva >= hoje) {
            const ano = dataReserva.getFullYear();
            const mes = String(dataReserva.getMonth() + 1).padStart(2, '0');
            const dia = String(dataReserva.getDate()).padStart(2, '0');
            const dataKey = `${ano}-${mes}-${dia}`;
            if (!acc[dataKey]) {
              acc[dataKey] = [];
            }
            acc[dataKey].push(reserva);
          }
    
          return acc;
        }, {});
    
        Object.keys(reservasPorDataObj).forEach(dataKey => {
          reservasPorDataObj[dataKey].sort((a, b) => {
            const horarioA = a.horario || '00:00';
            const horarioB = b.horario || '00:00';
            return horarioA.localeCompare(horarioB);
          });
        });
    
        setReservasPorData(reservasPorDataObj);
        setShowConsultas(true);
        
      })
      .catch(error => console.error('Erro ao buscar consultas:', error));
  }, [user]);

  const atualizarStatus = (id, status) => {
    axios.patch(`http://localhost:3000/reservas/${id}`, { status })
      .then(() => {
        setReservas(prevReservas => {
          const updatedReservas = prevReservas.map(reserva =>
            reserva.id === id ? { ...reserva, status } : reserva
          );
  
          const reservaAtualizada = updatedReservas.find(r => r.id === id);
          const updatedReservasPorData = { ...reservasPorData };
          
          if (reservaAtualizada && reservaAtualizada.dia) {
            let dataReserva;
            if (typeof reservaAtualizada.dia === 'string') {
              let dataParaFormatar = reservaAtualizada.dia;
              if (reservaAtualizada.dia.includes('T')) {
                dataParaFormatar = reservaAtualizada.dia.split('T')[0];
              }
              const partes = dataParaFormatar.split('-');
              if (partes.length === 3) {
                const [ano, mes, dia] = partes;
                dataReserva = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
              } else {
                dataReserva = new Date(dataParaFormatar);
              }
            } else {
              dataReserva = new Date(reservaAtualizada.dia);
            }
            
            dataReserva.setHours(0, 0, 0, 0);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            if (dataReserva >= hoje) {
              const ano = dataReserva.getFullYear();
              const mes = String(dataReserva.getMonth() + 1).padStart(2, '0');
              const dia = String(dataReserva.getDate()).padStart(2, '0');
              const dataKey = `${ano}-${mes}-${dia}`;
              
              if (!updatedReservasPorData[dataKey]) {
                updatedReservasPorData[dataKey] = [];
              }
              
              const indexNaData = updatedReservasPorData[dataKey].findIndex(r => r.id === id);
              if (indexNaData >= 0) {
                updatedReservasPorData[dataKey][indexNaData] = { ...reservaAtualizada, status };
              } else {
                updatedReservasPorData[dataKey].push({ ...reservaAtualizada, status });
              }
              
              updatedReservasPorData[dataKey].sort((a, b) => {
                const horarioA = a.horario || '00:00';
                const horarioB = b.horario || '00:00';
                return horarioA.localeCompare(horarioB);
              });
            }
          }
          
          Object.keys(updatedReservasPorData).forEach(dataKey => {
            updatedReservasPorData[dataKey] = updatedReservasPorData[dataKey].map(reserva =>
              reserva.id === id ? { ...reserva, status } : reserva
            );
          });

          setReservasPorData(updatedReservasPorData);
          
          if (status === 'confirmado' && reservaAtualizada) {
            let dataReserva;
            if (typeof reservaAtualizada.dia === 'string') {
              if (reservaAtualizada.dia.includes('T')) {
                dataReserva = new Date(reservaAtualizada.dia.split('T')[0]);
              } else {
                dataReserva = new Date(reservaAtualizada.dia);
              }
            } else {
              dataReserva = new Date(reservaAtualizada.dia);
            }
            
            dataReserva.setHours(0, 0, 0, 0);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
          }
          
          return updatedReservas;
        });
      })
      .catch(error => console.error('Erro ao atualizar status:', error));
  };
  

  const toggleStatus = (reserva) => {
    const novoStatus = reserva.status === 'confirmado' ? 'pendente' : 'confirmado';
    atualizarStatus(reserva.id, novoStatus);
  };

  const removerReserva = (id) => {
    if (window.confirm("Tem certeza que deseja remover esta consulta?")) {
      axios.delete(`http://localhost:3000/reservas/${id}`)
        .then(() => {
          const updatedReservas = reservas.filter(reserva => reserva.id !== id);
          setReservas(updatedReservas);
          success('Consulta removida com sucesso!');
        })
        .catch(error => console.error('Erro ao remover consulta:', error));
    }
  };

  const negarReserva = (reserva) => {
    if (motivo.trim() === '') {
      warning('Por favor, insira o motivo da negação!');
      return;
    }

    axios.patch(`http://localhost:3000/reservas/negado/${reserva.id}`, { 
      status: 'negado', 
      motivoNegacao: motivo 
    })
    .then(() => {
      setReservas(prevReservas => prevReservas.map(r =>
        r.id === reserva.id ? { ...r, status: 'negado', motivoNegacao: motivo } : r
      ));
      success('Consulta negada com sucesso!');
      setMotivo(''); 
      setMostrarMotivo(null);
    })
    .catch(error => console.error('Erro ao negar consulta:', error));
  };

  const handleLogout = () => {
    logout();
    navigate('/Entrar');
  };

  const converterEstadoParaSigla = (estadoNome) => {
    const estadosMap = {
      'acre': 'AC',
      'alagoas': 'AL',
      'amapá': 'AP',
      'amazonas': 'AM',
      'bahia': 'BA',
      'ceará': 'CE',
      'distrito federal': 'DF',
      'espírito santo': 'ES',
      'goiás': 'GO',
      'maranhão': 'MA',
      'mato grosso': 'MT',
      'mato grosso do sul': 'MS',
      'minas gerais': 'MG',
      'pará': 'PA',
      'paraíba': 'PB',
      'paraná': 'PR',
      'pernambuco': 'PE',
      'piauí': 'PI',
      'rio de janeiro': 'RJ',
      'rio grande do norte': 'RN',
      'rio grande do sul': 'RS',
      'rondônia': 'RO',
      'roraima': 'RR',
      'santa catarina': 'SC',
      'são paulo': 'SP',
      'sergipe': 'SE',
      'tocantins': 'TO'
    };

    if (!estadoNome) return null;

    const estadoNormalizado = estadoNome.toLowerCase().trim();
    
    if (estadosMap[estadoNormalizado]) {
      return estadosMap[estadoNormalizado];
    }

    if (estadoNome.length === 2 && /^[A-Z]{2}$/i.test(estadoNome)) {
      return estadoNome.toUpperCase();
    }

    return null;
  };

  const buscarLocalizacao = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR`);
      const data = await response.json();
      
      if (data && data.address) {
        let uf = data.address.state_code || data.address.state;
        const cidadeNome = data.address.city || data.address.town || data.address.village || data.address.municipality || data.address.county || '';
        
        if (uf) {
          let ufLimpo = uf.replace(/^[A-Z]{2}-/, '').toUpperCase();
          
          if (ufLimpo.length > 2) {
            const sigla = converterEstadoParaSigla(ufLimpo);
            if (sigla) {
              ufLimpo = sigla;
            }
          }
          
          setEditUfRegiao(ufLimpo);
        }
        if (cidadeNome) {
          setEditCidade(cidadeNome);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
    }
  };

  const handleMapClick = (lat, lng) => {
    setEditLatitude(lat);
    setEditLongitude(lng);
    buscarLocalizacao(lat, lng);
  };

  const handleEditarMapa = async () => {
    if (!editingUserId || !editLatitude || !editLongitude) {
      warning('Por favor, selecione uma localização no mapa.');
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/usuarios/${editingUserId}/localizacao`, {
        latitude: editLatitude,
        longitude: editLongitude,
        cidade: editCidade,
        ufRegiao: editUfRegiao
      });

      success('Localização atualizada com sucesso!');
      setShowMapEdit(false);
      setEditingUserId(null);
      setEditLatitude(null);
      setEditLongitude(null);
      setEditCidade('');
      setEditUfRegiao('');
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
      showError('Erro ao atualizar localização.');
    }
  };

  const LocationPickerEdit = ({ onLocationSelect, initialLat, initialLng }) => {
    const [position, setPosition] = useState(initialLat && initialLng ? [initialLat, initialLng] : [-14.235, -51.9253]);

    useEffect(() => {
      if (initialLat && initialLng) {
        setPosition([initialLat, initialLng]);
      }
    }, [initialLat, initialLng]);

    function LocationMarker() {
      useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng;
          setPosition([lat, lng]);
          onLocationSelect(lat, lng);
        },
      });

      return position === null ? null : <Marker position={position} />;
    }

    return (
      <MapContainer
        center={position}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    );
  };

  const handleCreateReserva = async () => {
    try {
      const horarioInicial = new Date(`1970-01-01T${horarioReserva}:00`);
      const horarioFinal = new Date(horarioInicial.getTime() + 60 * 60 * 1000); // Adicionando 1 hora
      const horarioFinalFormatado = `${horarioFinal.getHours().toString().padStart(2, '0')}:${horarioFinal.getMinutes().toString().padStart(2, '0')}`;

      await axios.post('http://localhost:3000/reservas', {
        nome: nomeReserva,
        sobrenome: sobrenomeReserva,
        email: emailReserva,
        dia: diaReserva,
        horario: horarioReserva,
        horarioFinal: horarioFinalFormatado,
        qntd_pessoa: qntdPessoas,
        telefone: telefoneReserva, //
        usuario_id: userId,
        status: 'pendente',
      });

      success('Consulta criada com sucesso!');
      setNomeReserva('');
      setSobrenomeReserva('');
      setEmailReserva('');
      setTelefoneReserva('');
      setDiaReserva('');
      setHorarioReserva('');
      setQntdPessoas('');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      showError('Erro ao criar consulta.');
    }
  };
  return (
    <Wrapper>
      <header style={{ 
        backgroundColor: 'rgb(227, 228, 222)', 
        padding: '20px', 
        position: 'relative'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: '#333', 
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          Painel do Administrador
        </h2>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button_2 onClick={() => {
              setShowConsultas(true);
              setShowReservas(false);
            }}>
              Ver Consultas
            </Button_2>
            <Button_2 onClick={() => setShowForm(true)}>
              Criar Consulta
            </Button_2>
            <Button_2 onClick={() => {
              setShowReservas(true);
              setShowConsultas(false);
            }}>
              Ver Solicitações
            </Button_2>
            <Button_2 onClick={async () => {
              try {
                const response = await axios.get(`http://localhost:3000/usuarios/solicitarDados/${user.id}`);
                const userData = response.data;
                setShowMapEdit(true);
                setEditingUserId(user.id);
                if (userData.latitude && userData.longitude) {
                  setEditLatitude(parseFloat(userData.latitude));
                  setEditLongitude(parseFloat(userData.longitude));
                  if (userData.cidade) setEditCidade(userData.cidade);
                  if (userData.ufRegiao) setEditUfRegiao(userData.ufRegiao);
                } else {
                  setEditLatitude(null);
                  setEditLongitude(null);
                }
              } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
                setShowMapEdit(true);
                setEditingUserId(user.id);
              }
            }}>
              Editar Mapa
            </Button_2>
          </div>
          <Button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>
            Sair
          </Button>
        </div>
      </header>
      <Container>
        <div>
      {showReservas && (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Telefone</Th>
                <Th>Dia</Th>
                <Th>Horário</Th>
                <Th>Status</Th>
                <Th>Tempo de Falta</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(reserva => (
                <tr key={reserva.id}>
                  <Td>{reserva.nome} {reserva.sobrenome}</Td>
                  <Td>{reserva.email}</Td>
                  <Td>{reserva.telefone}</Td>
                  <Td>{formatarDataExibicao(reserva.dia)}</Td>
                  <Td>{formatarHorarioBrasil(reserva.horario)}</Td>
                  <Td>{reserva.status}</Td>
                  <Td>{reserva.motivoFalta}</Td>
                  <Td>
                    {reserva.status === 'confirmado' ? (
                      <Button onClick={() => toggleStatus(reserva)} style={{ background: 'orange', color: 'white' }}>
                        Tirar Confirmação
                      </Button>
                    ) : (
                      <Button onClick={() => toggleStatus(reserva)} style={{ background: 'green', color: 'white' }}>
                        Confirmar
                      </Button>
                    )}

                    <Button onClick={() => setMostrarMotivo(reserva.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                      Negar
                    </Button>

                    {mostrarMotivo === reserva.id && (
                      <div>
                        <input
                          type="text"
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                          placeholder="Digite o motivo da negação"
                          style={{
                            padding: '8px',
                            width: '300px',
                            margin: '10px 0',
                            display: 'block',
                          }}
                        />
                        <div style={{ marginTop: '10px' }}>
                          <button
                            onClick={() => negarReserva(reserva)}
                            style={{
                              backgroundColor: 'green',
                              color: 'white',
                              marginRight: '10px', 
                            }}
                          >
                            Confirmar Negação
                          </button>

                          <button
                            onClick={() => setMostrarMotivo(null)}
                            style={{
                              backgroundColor: 'gray',
                              color: 'white',
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    <Button onClick={() => removerReserva(reserva.id)} style={{ background: 'red', color: 'white' }}>
                      Remover
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </div>

        {showConsultas && (
          <DaysWrapper>
            {(() => {
              const todasReservasConfirmadas = reservas.filter(r => r && r.status === 'confirmado');
              
              if (todasReservasConfirmadas.length === 0) {
                return (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px', 
                    fontSize: '18px', 
                    color: '#666', 
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    margin: '0 auto',
                    gridColumn: '1 / -1'
                  }}>
                    Nenhuma Consulta Marcada
                  </div>
                );
              }

              const reservasPorDataConfirmadas = todasReservasConfirmadas.reduce((acc, reserva) => {
                if (!reserva.dia) return acc;
                
                let dataReserva;
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
                    dataReserva = new Date(dataParaFormatar);
                  }
                } else {
                  dataReserva = new Date(reserva.dia);
                }
                
                dataReserva.setHours(0, 0, 0, 0);
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                
                if (dataReserva >= hoje) {
                  const dataKey = dataReserva.toISOString().split('T')[0];
                  if (!acc[dataKey]) {
                    acc[dataKey] = [];
                  }
                  acc[dataKey].push(reserva);
                }
                
                return acc;
              }, {});

              const datasComConsultas = Object.keys(reservasPorDataConfirmadas)
                .sort((a, b) => a.localeCompare(b));

              return datasComConsultas.map((dataKey) => {
                const reservasDoDia = reservasPorDataConfirmadas[dataKey]
                  .sort((a, b) => {
                    const horarioA = a.horario || '00:00';
                    const horarioB = b.horario || '00:00';
                    return horarioA.localeCompare(horarioB);
                  });

                return (
                  <div key={dataKey} style={{
                    backgroundColor: '#f1f1f1',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    border: '1px solid #ddd'
                  }}>
                    <h3 style={{ 
                      margin: '0 0 15px 0', 
                      color: '#333',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      {formatarDataExibicao(dataKey)}
                    </h3>
                    <div style={{ marginTop: '10px' }}>
                      {reservasDoDia.map(reserva => (
                        <div key={reserva.id} style={{
                          padding: '10px',
                          marginBottom: '8px',
                          backgroundColor: '#fff',
                          borderRadius: '4px',
                          borderLeft: '3px solid #4caf50'
                        }}>
                          <strong>{formatarHorarioBrasil(reserva.horario)}</strong> - {reserva.nome} {reserva.sobrenome}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </DaysWrapper>
        )}

      </Container>
      
      <DrawerContainer isOpen={showForm}>
        <DrawerHeader>
          <DrawerTitle>Criar Consulta</DrawerTitle>
        </DrawerHeader>
        
        <FormContainer style={{ maxWidth: '100%', boxShadow: 'none', padding: 0 }}>
          <Input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="ID do Usuário"
          />

          {userId && (
            <DivInputContainer>
              <div>
                <Label>Nome:</Label>
                <Input
                  type="text"
                  value={nomeReserva}
                  disabled
                />
              </div>
              <div>
                <Label>Sobrenome:</Label>
                <Input
                  type="text"
                  value={sobrenomeReserva}
                  disabled
                />
              </div>
              <div>
                <Label>Email:</Label>
                <Input
                  type="email"
                  value={emailReserva}
                  disabled
                />
              </div>
              <div>
                <Label>Telefone:</Label>
                <Input
                  type="text"
                  value={telefoneReserva}
                  disabled
                />
              </div>
            </DivInputContainer>
          )}

          <Select
            value={diaReserva}
            onChange={(e) => setDiaReserva(e.target.value)}
          >
            <option value="">Selecione o dia</option>
            <option value="Segunda">Segunda</option>
            <option value="Terça">Terça</option>
            <option value="Quarta">Quarta</option>
            <option value="Quinta">Quinta</option>
            <option value="Sexta">Sexta</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </Select>

          <Input
            type="time"
            value={horarioReserva}
            onChange={(e) => setHorarioReserva(e.target.value)}
          />

          <Input
            type="number"
            value={qntdPessoas}
            onChange={(e) => setQntdPessoas(e.target.value)}
            placeholder="Quantidade de Pessoas"
          />

          <Button onClick={handleCreateReserva} style={{ width: '100%', marginTop: '10px' }}>
            Criar Consulta
          </Button>
        </FormContainer>
      </DrawerContainer>

      <DrawerContainer isOpen={showMapEdit}>
        <DrawerHeader>
          <DrawerTitle>Editar Localização</DrawerTitle>
        </DrawerHeader>
        
        <FormContainer style={{ maxWidth: '100%', boxShadow: 'none', padding: 0 }}>
          <Label>Clique no mapa para selecionar sua localização:</Label>
          <div style={{ width: '100%', height: '400px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
            <LocationPickerEdit 
              onLocationSelect={handleMapClick}
              initialLat={editLatitude}
              initialLng={editLongitude}
            />
          </div>

          {editLatitude && editLongitude && (
            <>
              <Input
                type="text"
                value={editUfRegiao}
                placeholder="UF/Região (preenchido automaticamente)"
                readOnly
                style={{ backgroundColor: '#f0f0f0', marginBottom: '10px' }}
              />
              <Input
                type="text"
                value={editCidade}
                placeholder="Cidade (preenchida automaticamente)"
                readOnly
                style={{ backgroundColor: '#f0f0f0', marginBottom: '10px' }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                Localização selecionada: {editLatitude.toFixed(6)}, {editLongitude.toFixed(6)}
              </p>
            </>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={handleEditarMapa} style={{ backgroundColor: 'green', color: 'white' }}>
              Salvar Localização
            </Button>
            <Button onClick={() => {
              setShowMapEdit(false);
              setEditingUserId(null);
              setEditLatitude(null);
              setEditLongitude(null);
              setEditCidade('');
              setEditUfRegiao('');
            }} style={{ backgroundColor: 'gray', color: 'white' }}>
              Cancelar
            </Button>
          </div>
        </FormContainer>
      </DrawerContainer>

      <Footer />
    </Wrapper>
  );
};

export default AdminDashboard;