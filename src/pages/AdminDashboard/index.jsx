import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../../components/Footer';
import { Wrapper, Container, Table, TableWrapper, Th, Td, Button, DaysWrapper, Day, Button_2, Select, Input, Title, Label, DivInputContainer, FormContainer } from './style';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboard = () => {
  const [nomeReserva, setNomeReserva] = useState('');
  const [usuariosLogados, setUsuariosLogados] = useState([]);
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
  const [showUsuarios, setShowUsuarios] = useState(false);
  const { logout } = useAuth();
  const [showReservas, setShowReservas] = useState(false);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(null); // Novo estado para armazenar o dia selecionado
  const [reservasPorDia, setReservasPorDia] = useState({
    Segunda: [],
    Terça: [],
    Quarta: [],
    Quinta: [],
    Sexta: [],
    Sábado: [],
    Domingo: [],
  });

  const diasMap = {
    segunda: 'Segunda',
    terça: 'Terça',
    quarta: 'Quarta',
    quinta: 'Quinta',
    sexta: 'Sexta',
    sábado: 'Sábado',
    domingo: 'Domingo',
  };

  const formatarTelefone = (telefone) => {
    // Remove tudo que não for número
    const somenteNumeros = telefone.replace(/\D/g, '');
    
    // Aplica a máscara no formato "86 99427-3418"
    if (somenteNumeros.length <= 2) {
      return somenteNumeros;
    } else if (somenteNumeros.length <= 7) {
      return `${somenteNumeros.slice(0, 2)} ${somenteNumeros.slice(2)}`;
    } else {
      return `${somenteNumeros.slice(0, 2)} ${somenteNumeros.slice(2, 7)}-${somenteNumeros.slice(7, 11)}`;
    }
  };

  const buscarUsuariosLogados = async () => {
    try {
      const response = await axios.get('http://localhost:4000/usuarios/logados'); // Substitua com a rota do seu backend
      setUsuariosLogados(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários logados:', error);
    }
  };

  const buscarUsuarioPorId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/usuarios/solicitarDados/${id}`);
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
    buscarUsuariosLogados(); // Chama a função ao carregar o componente
  }, []);

    if (userId) {
      buscarUsuarioPorId(userId);
    }

  useEffect(() => {
    axios.get('http://localhost:4000/reservas')
      .then(response => {
        const reservasData = response.data;
    
        setReservas(reservasData);
    
        // Categorize reservas by day
        const reservasDia = reservasData.reduce((acc, reserva) => {
            const dia = reserva.dia ? reserva.dia.toLowerCase() : ''; // já está em minúsculas
            const diaCompleto = diasMap[dia];  // Mapeia corretamente para o nome completo
  
          if (diaCompleto) {
            acc[diaCompleto].push(reserva);  // Adiciona a reserva ao dia correto
          }
    
          return acc;
        }, {
          Segunda: [],
          Terça: [],
          Quarta: [],
          Quinta: [],
          Sexta: [],
          Sábado: [],
          Domingo: [],
        });
    
        setReservasPorDia(reservasDia);
        
      })
      .catch(error => console.error('Erro ao buscar reservas:', error));
  }, []);

  const atualizarStatus = (id, status) => {
    axios.patch(`http://localhost:4000/reservas/${id}`, { status })
      .then(() => {
        setReservas(prevReservas => {
          const updatedReservas = prevReservas.map(reserva =>
            reserva.id === id ? { ...reserva, status } : reserva
          );
  
          // Atualiza o estado `reservasPorDia` corretamente
          const updatedReservasPorDia = { ...reservasPorDia };
          diasDaSemana.forEach(dia => {
            updatedReservasPorDia[dia] = updatedReservasPorDia[dia].map(reserva =>
              reserva.id === id ? { ...reserva, status } : reserva
            );
          });
  
          setReservasPorDia(updatedReservasPorDia);
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
    if (window.confirm("Tem certeza que deseja remover esta reserva?")) {
      axios.delete(`http://localhost:4000/reservas/${id}`)
        .then(() => {
          const updatedReservas = reservas.filter(reserva => reserva.id !== id);
          setReservas(updatedReservas);
          alert('Reserva removida com sucesso!');
        })
        .catch(error => console.error('Erro ao remover reserva:', error));
    }
  };

  const negarReserva = (reserva) => {
    if (motivo.trim() === '') {
      alert('Por favor, insira o motivo da negação!');
      return;
    }

    axios.patch(`http://localhost:4000/reservas/negado/${reserva.id}`, { 
      status: 'negado', 
      motivoNegacao: motivo 
    })
    .then(() => {
      setReservas(prevReservas => prevReservas.map(r =>
        r.id === reserva.id ? { ...r, status: 'negado', motivoNegacao: motivo } : r
      ));
      alert('Reserva negada com sucesso!');
      setMotivo(''); // Limpar o campo de motivo após negação
      setMostrarMotivo(null); // Fechar o campo de input após o envio
    })
    .catch(error => console.error('Erro ao negar reserva:', error));
  };
  const selecionarDia = (dia) => {
    setDiaSelecionado(dia === diaSelecionado ? null : dia); // Se o dia já está selecionado, desmarcar
  };

  const handleLogout = () => {
    logout();
    navigate('/Entrar');
  };

  const handleCreateReserva = async () => {
    try {
      const horarioInicial = new Date(`1970-01-01T${horarioReserva}:00`);
      const horarioFinal = new Date(horarioInicial.getTime() + 60 * 60 * 1000); // Adicionando 1 hora
      const horarioFinalFormatado = `${horarioFinal.getHours().toString().padStart(2, '0')}:${horarioFinal.getMinutes().toString().padStart(2, '0')}`;

      await axios.post('http://localhost:4000/reservas', {
        nome: nomeReserva,
        sobrenome: sobrenomeReserva,
        email: emailReserva,
        dia: diaReserva,
        horario: horarioReserva,
        horarioFinal: horarioFinalFormatado,
        qntd_pessoa: qntdPessoas,
        telefone: telefoneReserva, // Enviar o telefone formatado
        usuario_id: userId,
        status: 'pendente',
      });

      alert('Reserva criada com sucesso!');
      setNomeReserva('');
      setSobrenomeReserva('');
      setEmailReserva('');
      setTelefoneReserva('');
      setDiaReserva('');
      setHorarioReserva('');
      setQntdPessoas('');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      alert('Erro ao criar reserva.');
    }
  };
  const toggleUsuarios = () => {
    setShowUsuarios(prevState => !prevState);
  };

  const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  return (
    <Wrapper>
      <header style={{ backgroundColor: 'black', padding: '10px', color: 'white', display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>
          Sair
        </Button>
      </header>
      <Container>
        <h2>Painel do Administrador</h2>
        <Button_2 onClick={toggleUsuarios}>
          {showUsuarios ? 'Esconder Usuários' : 'Ver Usuários'}
        </Button_2>
  
        {/* Exibir usuários se o estado `showUsuarios` for true */}
        {showUsuarios && (
          <div>
            <h3>Usuários Cadastrados</h3>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Nome</Th>
                    <Th>Sobrenome</Th>
                    <Th>Email</Th>
                    <Th>Telefone</Th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosLogados.map((usuario) => (
                    <tr key={usuario.id}>
                      <Td>{usuario.id}</Td>
                      <Td>{usuario.nome}</Td>
                      <Td>{usuario.sobrenome}</Td>
                      <Td>{usuario.email}</Td>
                      <Td>{usuario.telefone}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </div>
        )}
        <div>

      <Button_2 onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Esconder Reserva' : 'Criar Reserva'}
      </Button_2>

      {showForm && (
        <FormContainer>
          <Title>Criar Reserva</Title>

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

          <Button onClick={handleCreateReserva}>
            Criar Reserva
          </Button>
        </FormContainer>
      )}
    </div>
        
        <div>
      {/* Botão para mostrar/esconder as reservas */}
      <Button_2 onClick={() => setShowReservas(!showReservas)}>
        {showReservas ? 'Esconder Reservas' : ' Visualizar Reservas'}
      </Button_2>

      {/* Tabela de reservas */}
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
                <Th>Horário Final</Th>
                <Th>Qtd Pessoas</Th>
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
                  <Td>{reserva.dia}</Td>
                  <Td>{reserva.horario}</Td>
                  <Td>{reserva.horarioFinal}</Td>
                  <Td>{reserva.qntd_pessoa}</Td>
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

                    {/* Mostrar o campo de input de motivo se o botão foi clicado */}
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
                            display: 'block', // Garante que o input fique acima dos botões
                          }}
                        />
                        {/* Botões embaixo do campo de input */}
                        <div style={{ marginTop: '10px' }}>
                          <button
                            onClick={() => negarReserva(reserva)}
                            style={{
                              backgroundColor: 'green',
                              color: 'white',
                              marginRight: '10px', // Espaçamento entre os botões
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

        <DaysWrapper>
          {diasDaSemana.map((dia, index) => {
            const reservasConfirmadas = reservasPorDia[dia]
              .filter(reserva => reserva.status === 'confirmado')
              .sort((a, b) => a.horario.localeCompare(b.horario));

            return (
              <Day key={index} onClick={() => selecionarDia(dia)}>
                <h3>{dia}</h3>
                {diaSelecionado === dia && (
                  <ul>
                    {reservasConfirmadas.length > 0 ? (
                      reservasConfirmadas.map(reserva => (
                        <li key={reserva.id}>
                          {reserva.nome} {reserva.sobrenome} - {reserva.horario} - Pessoas: {reserva.qntd_pessoa}
                        </li>
                      ))
                    ) : (
                      <li>Nenhuma aula marcada</li>
                    )}
                  </ul>
                )}
              </Day>
            );
          })}
        </DaysWrapper>

      </Container>
      <Footer />
    </Wrapper>
  );
};

export default AdminDashboard;