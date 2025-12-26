import axios from 'axios';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: rgb(227, 228, 222);
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  background-color: white;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const RadioInput = styled.input`
  cursor: pointer;
`;

const EyeIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;

const LoginButton = styled.button`
  padding: 12px;
  background-color: rgb(143, 142, 142);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgb(82, 83, 84);
  }
`;

const Registro = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const [fazParteEmpresa, setFazParteEmpresa] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [tipoProfissional, setTipoProfissional] = useState('');
  const [profissaoCustomizada, setProfissaoCustomizada] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const senhaValida = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  
    if (!senhaValida.test(senha)) {
      alert('A senha deve ter no mínimo 8 caracteres, incluindo pelo menos um número e uma letra maiúscula.');
      return;
    }
  
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (tipoUsuario === 'profissional') {
      if (!fazParteEmpresa) {
        alert('Por favor, informe se você faz parte de uma empresa.');
        return;
      }
      if (fazParteEmpresa === 'sim' && !nomeEmpresa.trim()) {
        alert('Por favor, informe o nome da academia ou pilates.');
        return;
      }
      if (!tipoProfissional) {
        alert('Por favor, selecione o tipo de profissional.');
        return;
      }
      if (tipoProfissional === 'outros' && !profissaoCustomizada.trim()) {
        alert('Por favor, informe sua profissão.');
        return;
      }
    }
  
    try {
      const dadosRegistro = {
        nome,
        sobrenome,
        telefone,
        email,
        senha,
        tipoUsuario,
        ...(tipoUsuario === 'profissional' && {
          fazParteEmpresa: fazParteEmpresa === 'sim',
          nomeEmpresa: fazParteEmpresa === 'sim' ? nomeEmpresa : null,
          tipoProfissional,
          profissaoCustomizada: tipoProfissional === 'outros' ? profissaoCustomizada : null
        })
      };

      const response = await axios.post('http://localhost:3000/register', dadosRegistro);
      console.log(response.data);
      alert('Usuário cadastrado com sucesso!');
      
      // Se for profissional, faz login automático e redireciona para AdminDashboard
      // Aguarda um pequeno delay para garantir que o registro foi completado no backend
      if (tipoUsuario === 'profissional') {
        // Aguarda 500ms para garantir que o registro foi completado no banco de dados
        await new Promise(resolve => setTimeout(resolve, 500));
        const loginSuccess = await login(email, senha);
        if (loginSuccess) {
          navigate('/AdminDashboard');
        } else {
          // Se o login automático falhar, redireciona para página de login
          navigate('/Entrar');
        }
      } else {
        navigate('/Entrar');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Erro ao registrar. Tente novamente.');
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmarSenha(e.target.value);
    setPasswordsMatch(e.target.value === senha);
  };

  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
  
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 números
  
    if (value.length > 2 && value.length <= 7) {
      value = `${value.slice(0, 2)} ${value.slice(2)}`;
    } else if (value.length > 7) {
      value = `${value.slice(0, 2)} ${value.slice(2, 7)}-${value.slice(7)}`;
    }
  
    setTelefone(value);
  };
  

  return (
    <Container>
      <Header />
      <Content>
        <h2>Registrar-se</h2>
        <Form onSubmit={handleRegister}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>Tipo de Usuário:</label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="tipoUsuario"
                  value="cliente"
                  checked={tipoUsuario === 'cliente'}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                />
                Cliente
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="tipoUsuario"
                  value="profissional"
                  checked={tipoUsuario === 'profissional'}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                />
                Profissional
              </RadioLabel>
            </RadioGroup>
          </div>

          <Input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input type="text" placeholder="Sobrenome" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required />
          <Input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={handleTelefoneChange}
            maxLength="15"
            required
            />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          {tipoUsuario === 'profissional' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>Faz parte de uma empresa?</label>
                <RadioGroup>
                  <RadioLabel>
                    <RadioInput
                      type="radio"
                      name="fazParteEmpresa"
                      value="sim"
                      checked={fazParteEmpresa === 'sim'}
                      onChange={(e) => setFazParteEmpresa(e.target.value)}
                    />
                    Sim
                  </RadioLabel>
                  <RadioLabel>
                    <RadioInput
                      type="radio"
                      name="fazParteEmpresa"
                      value="nao"
                      checked={fazParteEmpresa === 'nao'}
                      onChange={(e) => {
                        setFazParteEmpresa(e.target.value);
                        setNomeEmpresa('');
                      }}
                    />
                    Não
                  </RadioLabel>
                </RadioGroup>
              </div>

              {fazParteEmpresa === 'sim' && (
                <Input
                  type="text"
                  placeholder="Nome da Academia ou Pilates"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  required
                />
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>Tipo de Profissional:</label>
                <Select
                  value={tipoProfissional}
                  onChange={(e) => {
                    setTipoProfissional(e.target.value);
                    if (e.target.value !== 'outros') {
                      setProfissaoCustomizada('');
                    }
                  }}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="dono">Dono</option>
                  <option value="personal">Personal Trainer</option>
                  <option value="instrutor_pilates">Instrutor de Pilates</option>
                  <option value="fisioterapeuta">Fisioterapeuta</option>
                  <option value="outros">Outros</option>
                </Select>
              </div>

              {tipoProfissional === 'outros' && (
                <Input
                  type="text"
                  placeholder="Digite sua profissão"
                  value={profissaoCustomizada}
                  onChange={(e) => setProfissaoCustomizada(e.target.value)}
                  required
                />
              )}
            </>
          )}
          
          <InputWrapper>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <EyeIcon onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </EyeIcon>
          </InputWrapper>

          <InputWrapper>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar Senha"
              value={confirmarSenha}
              onChange={handleConfirmPasswordChange}
              required
            />
            <EyeIcon onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </EyeIcon>
          </InputWrapper>

          {!passwordsMatch && <p style={{ color: 'red' }}>As senhas não coincidem.</p>}

          <Button type="submit">Criar Conta</Button>
          <LoginButton onClick={() => navigate('/Entrar')}>Já tem uma conta? Faça o Login</LoginButton>
        </Form>
      </Content>
      <Footer />
    </Container>
  );
};

export default Registro;