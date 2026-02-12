import axios from 'axios';
import { ptBR } from 'date-fns/locale';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from '../../contexts/NotificationContext';
import { Button, Button_2, Container, DatePickerWrapper, DaysWrapper, DivInputContainer, DrawerContainer, DrawerHeader, DrawerTitle, FormContainer, Input, Label, Select, Table, TableWrapper, Td, Th, Wrapper } from './style';

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
  const [dataReserva, setDataReserva] = useState(new Date());
  const [telefoneReserva, setTelefoneReserva] = useState('');
  const [horarioReserva, setHorarioReserva] = useState('');
  const [reservas, setReservas] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cpfUsuario, setCpfUsuario] = useState('');
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
  const [showInfoEdit, setShowInfoEdit] = useState(false);
  const [editDescricao, setEditDescricao] = useState('');
  const [editPublicoAtendido, setEditPublicoAtendido] = useState('');
  const [editModalidade, setEditModalidade] = useState('');
  const [editValorConsulta, setEditValorConsulta] = useState('');
  const [editDiasAtendimento, setEditDiasAtendimento] = useState([]);
  const [editHorariosAtendimento, setEditHorariosAtendimento] = useState({});
  const [showReservaEdit, setShowReservaEdit] = useState(false);
  const [editReservaId, setEditReservaId] = useState(null);
  const [editReservaData, setEditReservaData] = useState(new Date());
  const [editReservaHorario, setEditReservaHorario] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showUrgencias, setShowUrgencias] = useState(false);
  const [searchHistory, setSearchHistory] = useState('');

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleEditDiaChange = (e) => {
    const dia = e.target.value;
    if (dia === 'Todos os dias') {
      const todosSelecionados = diasSemana.every(d => editDiasAtendimento.includes(d));
      
      if (todosSelecionados) {
        setEditDiasAtendimento([]);
        setEditHorariosAtendimento({});
      } else {
        setEditDiasAtendimento([...diasSemana]);
        const newHorarios = {};
        diasSemana.forEach(d => {
            newHorarios[d] = editHorariosAtendimento[d] || ['08:00'];
        });
        setEditHorariosAtendimento(newHorarios);
      }
    } else {
      if (editDiasAtendimento.includes(dia)) {
        setEditDiasAtendimento(editDiasAtendimento.filter(d => d !== dia));
        const newHorarios = { ...editHorariosAtendimento };
        delete newHorarios[dia];
        setEditHorariosAtendimento(newHorarios);
      } else {
        setEditDiasAtendimento([...editDiasAtendimento, dia]);
        setEditHorariosAtendimento({
            ...editHorariosAtendimento,
            [dia]: ['08:00']
        });
      }
    }
  };

  const handleEditAddHorario = (dia) => {
    setEditHorariosAtendimento(prev => ({
      ...prev,
      [dia]: [...(prev[dia] || []), '']
    }));
  };

  const handleEditRemoveHorario = (dia, index) => {
    setEditHorariosAtendimento(prev => {
        const novosHorarios = [...prev[dia]];
        novosHorarios.splice(index, 1);
        return {
            ...prev,
            [dia]: novosHorarios
        };
    });
  };

  const handleEditHorarioChange = (dia, index, valor) => {
    setEditHorariosAtendimento(prev => {
        const novosHorarios = [...prev[dia]];
        novosHorarios[index] = valor;
        return {
            ...prev,
            [dia]: novosHorarios
        };
    });
  };

  const handleUpdateReserva = async (novoStatus = null) => {
    if (!editReservaId || !editReservaData || !editReservaHorario) {
        warning('Preencha todos os campos.');
        return;
    }

    try {
        const ano = editReservaData.getFullYear();
        const mes = String(editReservaData.getMonth() + 1).padStart(2, '0');
        const dia = String(editReservaData.getDate()).padStart(2, '0');
        const dataFormatada = `${ano}-${mes}-${dia}`;

        const horarioInicial = new Date(`1970-01-01T${editReservaHorario}:00`);
        const horarioFinal = new Date(horarioInicial.getTime() + 60 * 60 * 1000); 
        const horarioFinalFormatado = `${horarioFinal.getHours().toString().padStart(2, '0')}:${horarioFinal.getMinutes().toString().padStart(2, '0')}`;

        const payload = {
            dia: dataFormatada,
            horario: editReservaHorario,
            horarioFinal: horarioFinalFormatado
        };

        // Se novoStatus for passado, usa ele (ex: 'confirmado')
        // Se não for passado (clicou em Salvar Alterações), define como 'aguardando_confirmacao_paciente'
        if (novoStatus) {
            payload.status = novoStatus;
        } else {
            payload.status = 'aguardando_confirmacao_paciente';
        }

        await axios.patch(`http://localhost:3000/reservas/${editReservaId}`, payload);

        success(novoStatus === 'confirmado' ? 'Consulta confirmada e atualizada!' : 'Consulta atualizada. Aguardando confirmação do paciente.');
        setShowReservaEdit(false);
        setEditReservaId(null);
        buscarReservas();
    } catch (error) {
        console.error('Erro ao atualizar consulta:', error);
        showError('Erro ao atualizar consulta.');
    }
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

  const buscarUsuarioPorCPF = async (cpf) => {
    try {
      const cpfLimpo = cpf.replace(/\D/g, '');
      if (cpfLimpo.length !== 11) {
        if (cpfLimpo.length > 0) {
          warning('CPF deve conter 11 dígitos.');
        }
        return;
      }
      
      const response = await axios.get(`http://localhost:3000/usuarios/buscarPorCPF/${cpfLimpo}`);
      const usuario = response.data;
      setNomeReserva(usuario.nome);
      setSobrenomeReserva(usuario.sobrenome);
      setEmailReserva(usuario.email);
      setTelefoneReserva(usuario.telefone);
      setUserId(usuario.id);
    } catch (error) {
      console.log('Erro ao buscar usuário por CPF:', error);
      if (error.response?.status === 404) {
        showError('Usuário não encontrado com este CPF.');
      } else {
        showError('Erro ao buscar usuário por CPF.');
      }
      setNomeReserva('');
      setSobrenomeReserva('');
      setEmailReserva('');
      setTelefoneReserva('');
      setUserId(null);
    }
  };

  useEffect(() => {
    if (cpfUsuario && cpfUsuario.replace(/\D/g, '').length === 11) {
      buscarUsuarioPorCPF(cpfUsuario);
    } else if (cpfUsuario === '') {
      setNomeReserva('');
      setSobrenomeReserva('');
      setEmailReserva('');
      setTelefoneReserva('');
      setUserId(null);
    }
  }, [cpfUsuario]);

  const mapDrawerRef = useRef(null);
  const infoDrawerRef = useRef(null);
  const formDrawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMapEdit && mapDrawerRef.current && !mapDrawerRef.current.contains(event.target)) {
        setShowMapEdit(false);
        setEditingUserId(null);
        setEditLatitude(null);
        setEditLongitude(null);
        setEditCidade('');
        setEditUfRegiao('');
      }
      
      if (showInfoEdit && infoDrawerRef.current && !infoDrawerRef.current.contains(event.target)) {
        setShowInfoEdit(false);
        setEditingUserId(null);
        setEditDescricao('');
        setEditPublicoAtendido('');
        setEditModalidade('');
      }
      
      if (showForm && formDrawerRef.current && !formDrawerRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    if (showMapEdit || showInfoEdit || showForm) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMapEdit, showInfoEdit, showForm]);

  const buscarReservas = async () => {
    if (!user || !user.id) {
      console.log('AdminDashboard: user não disponível ainda', { user });
      return;
    }
    
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
    
    try {
      const response = await axios.get(url);
      const reservasData = response.data;
  
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
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
    }
  };

  useEffect(() => {
    buscarReservas();
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

  const handleEditarInformacoes = async () => {
    if (!editingUserId) {
      warning('Erro ao identificar usuário.');
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/usuarios/${editingUserId}/informacoes`, {
        descricao: editDescricao,
        publicoAtendido: editPublicoAtendido,
        modalidade: editModalidade,
        valorConsulta: editValorConsulta,
        diasAtendimento: editDiasAtendimento,
        horariosAtendimento: editHorariosAtendimento
      });

      success('Informações atualizadas com sucesso!');
      setShowInfoEdit(false);
      setEditingUserId(null);
      setEditDescricao('');
      setEditPublicoAtendido('');
      setEditModalidade('');
      setEditValorConsulta('');
      setEditDiasAtendimento([]);
      setEditHorariosAtendimento({});
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
      showError('Erro ao atualizar informações.');
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
    if (!userId) {
      warning('Por favor, busque um usuário pelo CPF primeiro.');
      return;
    }

    if (!dataReserva) {
      warning('Por favor, selecione uma data.');
      return;
    }

    if (!horarioReserva) {
      warning('Por favor, selecione um horário.');
      return;
    }

    try {
      const horarioInicial = new Date(`1970-01-01T${horarioReserva}:00`);
      const horarioFinal = new Date(horarioInicial.getTime() + 60 * 60 * 1000); 
      const horarioFinalFormatado = `${horarioFinal.getHours().toString().padStart(2, '0')}:${horarioFinal.getMinutes().toString().padStart(2, '0')}`;

      const ano = dataReserva.getFullYear();
      const mes = String(dataReserva.getMonth() + 1).padStart(2, '0');
      const dia = String(dataReserva.getDate()).padStart(2, '0');
      const dataFormatada = `${ano}-${mes}-${dia}`;

      await axios.post('http://localhost:3000/reservas', {
        nome: nomeReserva,
        sobrenome: sobrenomeReserva,
        email: emailReserva,
        dia: dataFormatada,
        horario: horarioReserva,
        horarioFinal: horarioFinalFormatado,
        qntd_pessoa: 1,
        telefone: telefoneReserva,
        usuario_id: userId,
        profissional_id: user.id,
        status: 'confirmado', 
      });

      success('Consulta criada com sucesso!');
      setNomeReserva('');
      setSobrenomeReserva('');
      setEmailReserva('');
      setTelefoneReserva('');
      setDataReserva(new Date());
      setHorarioReserva('');
      setCpfUsuario('');
      setUserId(null);
      setShowForm(false);
      buscarReservas(); // Atualiza a lista de reservas após criar
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
              setShowHistory(false);
              setShowUrgencias(false);
            }}>
              Ver Consultas
            </Button_2>
            <Button_2 onClick={() => setShowForm(true)}>
              Criar Consulta
            </Button_2>
            <Button_2 onClick={() => {
              setShowReservas(true);
              setShowConsultas(false);
              setShowHistory(false);
              setShowUrgencias(false);
            }}>
              Ver Solicitações
            </Button_2>
            <Button_2 onClick={() => {
              setShowHistory(true);
              setShowConsultas(false);
              setShowReservas(false);
              setShowUrgencias(false);
            }}>
              Ver Histórico
            </Button_2>
            <Button_2 onClick={() => {
              setShowUrgencias(true);
              setShowConsultas(false);
              setShowReservas(false);
              setShowHistory(false);
            }} style={{backgroundColor: '#d32f2f'}}>
              Ver Urgências
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
            <Button_2 onClick={async () => {
              try {
                const response = await axios.get(`http://localhost:3000/usuarios/solicitarDados/${user.id}`);
                const userData = response.data;
                setShowInfoEdit(true);
                setEditingUserId(user.id);
                setEditDescricao(userData.descricao || '');
                setEditPublicoAtendido(userData.publicoAtendido || '');
                setEditModalidade(userData.modalidade || '');
                setEditValorConsulta(userData.valorConsulta || '');
                
                // Parse diasAtendimento
                let dias = userData.diasAtendimento;
                if (typeof dias === 'string') {
                    try {
                        dias = JSON.parse(dias);
                    } catch (e) {
                        dias = dias.split(',').map(d => d.trim()).filter(d => d);
                    }
                }
                setEditDiasAtendimento(Array.isArray(dias) ? dias : []);

                // Parse horariosAtendimento
                let horarios = userData.horariosAtendimento;
                if (typeof horarios === 'string') {
                    try {
                        horarios = JSON.parse(horarios);
                    } catch (e) {
                        horarios = {};
                    }
                }
                setEditHorariosAtendimento(typeof horarios === 'object' && horarios !== null ? horarios : {});
              } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
                showError('Erro ao carregar informações.');
              }
            }}>
              Editar Informações
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
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {reservas.filter(reserva => {
                if (!reserva.dia) return false;
                
                if (reserva.is_urgente) return false;

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
                
                return dataReserva >= hoje;
              })
              .map(reserva => (
                <tr key={reserva.id}>
                  <Td>{reserva.nome} {reserva.sobrenome}</Td>
                  <Td>{reserva.email}</Td>
                  <Td>{reserva.telefone}</Td>
                  <Td>{formatarDataExibicao(reserva.dia)}</Td>
                  <Td>{formatarHorarioBrasil(reserva.horario)}</Td>
                  <Td>{reserva.status}</Td>
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

                    <Button onClick={() => {
                      setEditReservaId(reserva.id);
                      let dataReserva;
                      if (typeof reserva.dia === 'string') {
                          if (reserva.dia.includes('T')) {
                              dataReserva = new Date(reserva.dia.split('T')[0] + 'T12:00:00');
                          } else {
                              dataReserva = new Date(reserva.dia + 'T12:00:00');
                          }
                      } else {
                          dataReserva = new Date(reserva.dia);
                      }
                      setEditReservaData(dataReserva);
                      setEditReservaHorario(reserva.horario);
                      setShowReservaEdit(true);
                    }} style={{ background: 'blue', color: 'white' }}>
                      Editar
                    </Button>

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

      {showUrgencias && (
        <TableWrapper>
          <h3 style={{ padding: '0 20px', color: '#d32f2f' }}>Solicitações de Urgência</h3>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Telefone</Th>
                <Th>Data</Th>
                <Th>Horário</Th>
                <Th>Descrição</Th>
                <Th>Arquivo</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {reservas.filter(reserva => reserva.is_urgente).map(reserva => (
                <tr key={reserva.id}>
                  <Td>{reserva.nome} {reserva.sobrenome}</Td>
                  <Td>{reserva.telefone}</Td>
                  <Td>{formatarDataExibicao(reserva.dia)}</Td>
                  <Td>{formatarHorarioBrasil(reserva.horario)}</Td>
                  <Td>{reserva.descricao_urgencia}</Td>
                  <Td>
                    {reserva.arquivo_urgencia ? (
                      <a href={`http://localhost:3000${reserva.arquivo_urgencia}`} target="_blank" rel="noopener noreferrer">
                        Ver Arquivo
                      </a>
                    ) : 'Sem arquivo'}
                  </Td>
                  <Td>
                    <Button onClick={() => {
                         // Remover flag de urgente e confirmar
                         axios.patch(`http://localhost:3000/reservas/${reserva.id}`, { is_urgente: false, status: 'confirmado' })
                           .then(() => {
                             success('Urgência atendida e convertida em consulta confirmada!');
                             buscarReservas();
                           })
                           .catch(err => showError('Erro ao processar urgência.'));
                    }} style={{ background: 'green', color: 'white' }}>
                      Aceitar
                    </Button>
                    <Button onClick={() => {
                      setEditReservaId(reserva.id);
                      let dataReserva;
                      if (typeof reserva.dia === 'string') {
                          if (reserva.dia.includes('T')) {
                              dataReserva = new Date(reserva.dia.split('T')[0] + 'T12:00:00');
                          } else {
                              dataReserva = new Date(reserva.dia + 'T12:00:00');
                          }
                      } else {
                          dataReserva = new Date(reserva.dia);
                      }
                      setEditReservaData(dataReserva);
                      setEditReservaHorario(reserva.horario);
                      setShowReservaEdit(true);
                    }} style={{ background: 'blue', color: 'white' }}>
                      Editar
                    </Button>
                    <Button onClick={() => removerReserva(reserva.id)} style={{ background: 'red', color: 'white' }}>
                      Remover
                    </Button>
                  </Td>
                </tr>
              ))}
              {reservas.filter(reserva => reserva.is_urgente).length === 0 && (
                <tr>
                  <Td colSpan="7" style={{ textAlign: 'center' }}>Nenhuma solicitação de urgência encontrada.</Td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      {showHistory && (
        <TableWrapper>
          <div style={{ marginBottom: '20px', padding: '0 20px' }}>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Histórico de Consultas</h3>
            <Input 
              type="text" 
              placeholder="Pesquisar por nome, email ou telefone..." 
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Telefone</Th>
                <Th>Dia</Th>
                <Th>Horário</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {reservas.filter(reserva => {
                if (!reserva.dia) return false;
                
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
                
                // Filtra apenas datas passadas
                if (dataReserva >= hoje) return false;

                if (searchHistory) {
                    const query = searchHistory.toLowerCase();
                    const nomeCompleto = `${reserva.nome || ''} ${reserva.sobrenome || ''}`.toLowerCase();
                    return (
                        nomeCompleto.includes(query) ||
                        (reserva.email && reserva.email.toLowerCase().includes(query)) ||
                        (reserva.telefone && reserva.telefone.includes(query))
                    );
                }
                return true;
              })
              .sort((a, b) => {
                  const dateA = new Date(a.dia);
                  const dateB = new Date(b.dia);
                  return dateB - dateA;
              })
              .map(reserva => (
                <tr key={reserva.id}>
                  <Td>{reserva.nome} {reserva.sobrenome}</Td>
                  <Td>{reserva.email}</Td>
                  <Td>{reserva.telefone}</Td>
                  <Td>{formatarDataExibicao(reserva.dia)}</Td>
                  <Td>{formatarHorarioBrasil(reserva.horario)}</Td>
                  <Td>{reserva.status}</Td>
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
      
      <DrawerContainer isOpen={showForm} ref={formDrawerRef}>
        <DrawerHeader>
          <DrawerTitle>Criar Consulta</DrawerTitle>
        </DrawerHeader>
        
        <FormContainer style={{ maxWidth: '100%', boxShadow: 'none', padding: 0 }}>
          <Label>CPF do Usuário:</Label>
          <Input
            type="text"
            value={cpfUsuario}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, '');
              if (valor.length <= 11) {
                let formatado = valor;
                if (valor.length > 3) formatado = valor.slice(0, 3) + '.' + valor.slice(3);
                if (valor.length > 6) formatado = valor.slice(0, 3) + '.' + valor.slice(3, 6) + '.' + valor.slice(6);
                if (valor.length > 9) formatado = valor.slice(0, 3) + '.' + valor.slice(3, 6) + '.' + valor.slice(6, 9) + '-' + valor.slice(9);
                setCpfUsuario(formatado);
              }
            }}
            placeholder="000.000.000-00"
            maxLength={14}
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

          <Label>Data da Consulta:</Label>
          <DatePickerWrapper>
            <DatePicker
              selected={dataReserva}
              onChange={(date) => setDataReserva(date)}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              showPopperArrow={false}
              required
            />
          </DatePickerWrapper>

          <Label>Horário (HH:mm):</Label>
          <Input
            type="text"
            placeholder="HH:MM (ex: 14:30)"
            value={horarioReserva ? (formatarHorarioBrasil(horarioReserva) || horarioReserva) : ''}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, '');
              
              if (valor.length <= 2) {
                setHorarioReserva(valor);
              } else if (valor.length <= 4) {
                setHorarioReserva(valor.slice(0, 2) + ':' + valor.slice(2));
              } else {
                setHorarioReserva(valor.slice(0, 2) + ':' + valor.slice(2, 4));
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
              
              const horarioFormatado = formatarHorarioBrasil(valor);
              if (horarioFormatado && horarioFormatado.match(/^\d{2}:\d{2}$/)) {
                const [h, m] = horarioFormatado.split(':');
                if (parseInt(h) >= 0 && parseInt(h) <= 23 && parseInt(m) >= 0 && parseInt(m) <= 59) {
                  setHorarioReserva(horarioFormatado);
                }
              } else if (valor.match(/^\d{2}:\d{2}$/)) {
                const [h, m] = valor.split(':');
                if (parseInt(h) >= 0 && parseInt(h) <= 23 && parseInt(m) >= 0 && parseInt(m) <= 59) {
                  setHorarioReserva(valor);
                }
              }
            }}
            maxLength={5}
            required
          />

          <Button onClick={handleCreateReserva} style={{ width: '100%', marginTop: '10px' }}>
            Criar Consulta
          </Button>
        </FormContainer>
      </DrawerContainer>

      <DrawerContainer isOpen={showMapEdit} ref={mapDrawerRef}>
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

      <DrawerContainer isOpen={showInfoEdit} ref={infoDrawerRef}>
        <DrawerHeader>
          <DrawerTitle>Editar Informações</DrawerTitle>
        </DrawerHeader>
        
        <FormContainer style={{ maxWidth: '100%', boxShadow: 'none', padding: 0 }}>
          <Label>Descrição:</Label>
          <textarea
            value={editDescricao}
            onChange={(e) => setEditDescricao(e.target.value)}
            placeholder="Descreva sua experiência e especialidades..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '100px',
              fontFamily: 'Figtree, sans-serif',
              resize: 'vertical',
              marginBottom: '15px',
              boxSizing: 'border-box'
            }}
          />

          <Label>Público Atendido:</Label>
          <Select
            value={editPublicoAtendido}
            onChange={(e) => setEditPublicoAtendido(e.target.value)}
            style={{ marginBottom: '15px' }}
          >
            <option value="">Selecione...</option>
            <option value="Adultos">Adultos</option>
            <option value="Crianças">Crianças</option>
            <option value="Idosos">Idosos</option>
            <option value="Adultos e Crianças">Adultos e Crianças</option>
            <option value="Adultos e Idosos">Adultos e Idosos</option>
            <option value="Crianças e Idosos">Crianças e Idosos</option>
            <option value="Todos">Todos</option>
          </Select>

          <Label>Modalidade:</Label>
          <Select
            value={editModalidade}
            onChange={(e) => setEditModalidade(e.target.value)}
            style={{ marginBottom: '15px' }}
          >
            <option value="">Selecione...</option>
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
            <option value="domiciliar">Domiciliar</option>
            <option value="presencial,online">Presencial e Online</option>
            <option value="presencial,domiciliar">Presencial e Domiciliar</option>
            <option value="online,domiciliar">Online e Domiciliar</option>
            <option value="presencial,online,domiciliar">Presencial, Online e Domiciliar</option>
          </Select>

          <Label>Valor da Consulta:</Label>
          <div style={{ marginBottom: '15px' }}>
             <Select
               value={editValorConsulta === 'A negociar' ? 'A negociar' : 'Definir valor'}
               onChange={(e) => {
                 if (e.target.value === 'A negociar') {
                   setEditValorConsulta('A negociar');
                 } else {
                   setEditValorConsulta('');
                 }
               }}
               style={{ marginBottom: '10px' }}
             >
               <option value="Definir valor">Definir valor (R$)</option>
               <option value="A negociar">Valor a negociar</option>
             </Select>
             
             {editValorConsulta !== 'A negociar' && (
               <Input
                 type="number"
                 placeholder="Ex: 150.00"
                 value={editValorConsulta}
                 onChange={(e) => setEditValorConsulta(e.target.value)}
                 min="0"
                 step="0.01"
               />
             )}
          </div>

          <Label>Dias de Atendimento:</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
            <Select onChange={handleEditDiaChange} value="">
              <option value="" disabled>Adicionar dia...</option>
              <option value="Todos os dias">Todos os dias</option>
              {diasSemana.map(dia => (
                <option key={dia} value={dia} disabled={editDiasAtendimento.includes(dia)}>
                  {dia}
                </option>
              ))}
            </Select>
            
            {editDiasAtendimento.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {editDiasAtendimento.map(dia => (
                  <span key={dia} style={{ background: '#e0e0e0', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                    {dia}
                    <button 
                      type="button" 
                      onClick={() => handleEditDiaChange({ target: { value: dia } })}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#ff4444', display: 'flex', alignItems: 'center', padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {editDiasAtendimento.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <Label>Horários por Dia:</Label>
              {editDiasAtendimento.map(dia => (
                <div key={dia} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{dia}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {editHorariosAtendimento[dia]?.map((horario, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Input
                          type="time"
                          value={horario}
                          onChange={(e) => handleEditHorarioChange(dia, index, e.target.value)}
                          required
                          style={{ width: '110px' }}
                        />
                        {editHorariosAtendimento[dia].length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleEditRemoveHorario(dia, index)}
                            style={{
                              background: '#ff4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px'
                            }}
                            title="Remover horário"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleEditAddHorario(dia)}
                      style={{
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      + Adicionar Horário
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={handleEditarInformacoes} style={{ backgroundColor: 'green', color: 'white' }}>
              Salvar Informações
            </Button>
            <Button onClick={() => {
              setShowInfoEdit(false);
              setEditingUserId(null);
              setEditDescricao('');
              setEditPublicoAtendido('');
              setEditModalidade('');
              setEditValorConsulta('');
              setEditDiasAtendimento([]);
              setEditHorariosAtendimento({});
            }} style={{ backgroundColor: 'gray', color: 'white' }}>
              Cancelar
            </Button>
          </div>
        </FormContainer>
      </DrawerContainer>

      <DrawerContainer isOpen={showReservaEdit}>
        <DrawerHeader>
          <DrawerTitle>Editar Consulta</DrawerTitle>
        </DrawerHeader>
        <FormContainer style={{ maxWidth: '100%', boxShadow: 'none', padding: 0 }}>
            <Label>Nova Data:</Label>
            <DatePickerWrapper>
            <DatePicker
                selected={editReservaData}
                onChange={(date) => setEditReservaData(date)}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                locale={ptBR}
                showPopperArrow={false}
                required
            />
            </DatePickerWrapper>

            <Label>Novo Horário (HH:mm):</Label>
            <Input
                type="text"
                value={editReservaHorario}
                onChange={(e) => setEditReservaHorario(e.target.value)}
                maxLength={5}
                required
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                <Button onClick={() => handleUpdateReserva()} style={{ backgroundColor: 'blue', color: 'white' }}>
                    Salvar Alterações
                </Button>
                <Button onClick={() => setShowReservaEdit(false)} style={{ backgroundColor: 'gray', color: 'white' }}>
                    Fechar
                </Button>
            </div>
        </FormContainer>
      </DrawerContainer>

      <Footer />
    </Wrapper>
  );
};

export default AdminDashboard;