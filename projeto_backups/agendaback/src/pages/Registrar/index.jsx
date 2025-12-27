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
  const [tipoUsuario, setTipoUsuario] = useState('paciente');
  const [tipoProfissional, setTipoProfissional] = useState('');
  const [especialidadeMedica, setEspecialidadeMedica] = useState('');
  const [profissaoCustomizada, setProfissaoCustomizada] = useState('');
  const [numeroConselho, setNumeroConselho] = useState('');
  const [ufRegiao, setUfRegiao] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const formatarNumeroConselho = (valor, tipoProfissional) => {
    if (!valor) return '';
    
    let apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros.length === 0) return '';
    
    switch (tipoProfissional) {
      case 'medico':
        if (apenasNumeros.length > 6) apenasNumeros = apenasNumeros.slice(0, 6);
        return `CRM ${apenasNumeros}`;
      case 'dentista':
        if (apenasNumeros.length > 6) apenasNumeros = apenasNumeros.slice(0, 6);
        return `CRO ${apenasNumeros}`;
      case 'nutricionista':
        if (apenasNumeros.length > 5) apenasNumeros = apenasNumeros.slice(0, 5);
        return `CRN ${apenasNumeros}`;
      case 'fisioterapeuta':
        if (apenasNumeros.length > 6) apenasNumeros = apenasNumeros.slice(0, 6);
        return `CREFITO ${apenasNumeros}`;
      case 'fonoaudiologo':
        if (apenasNumeros.length > 5) apenasNumeros = apenasNumeros.slice(0, 5);
        return `CRFa ${apenasNumeros}`;
      default:
        if (apenasNumeros.length > 10) apenasNumeros = apenasNumeros.slice(0, 10);
        return apenasNumeros;
    }
  };

  const validarNumeroConselho = (valor, tipoProfissional) => {
    if (!valor || !valor.trim()) return false;
    
    const apenasNumeros = valor.replace(/\D/g, '');
    
    switch (tipoProfissional) {
      case 'medico':
        return /^CRM\s?\d{4,6}$/i.test(valor.trim()) && apenasNumeros.length >= 4 && apenasNumeros.length <= 6;
      case 'dentista':
        return /^CRO\s?\d{4,6}$/i.test(valor.trim()) && apenasNumeros.length >= 4 && apenasNumeros.length <= 6;
      case 'nutricionista':
        return /^CRN\s?\d{4,5}$/i.test(valor.trim()) && apenasNumeros.length >= 4 && apenasNumeros.length <= 5;
      case 'fisioterapeuta':
        return /^CREFITO\s?\d{4,6}$/i.test(valor.trim()) && apenasNumeros.length >= 4 && apenasNumeros.length <= 6;
      case 'fonoaudiologo':
        return /^CRFa\s?\d{4,5}$/i.test(valor.trim()) && apenasNumeros.length >= 4 && apenasNumeros.length <= 5;
      default:
        return apenasNumeros.length >= 3 && apenasNumeros.length <= 10;
    }
  };

  const handleNumeroConselhoChange = (e) => {
    const valor = e.target.value;
    const formatado = formatarNumeroConselho(valor, tipoProfissional);
    setNumeroConselho(formatado);
  };

  const especialidadesMedicas = [
    'Clínico Geral',
    'Oftalmologista',
    'Cardiologista',
    'Dermatologista',
    'Pediatra',
    'Ginecologista',
    'Ortopedista',
    'Neurologista',
    'Psiquiatra',
    'Endocrinologista',
    'Gastroenterologista',
    'Urologista',
    'Otorrinolaringologista',
    'Pneumologista',
    'Reumatologista',
    'Oncologista',
    'Hematologista',
    'Nefrologista',
    'Anestesiologista',
    'Radiologista',
    'Patologista',
    'Medicina do Trabalho',
    'Medicina Esportiva',
    'Geriatra',
    'Mastologista',
    'Proctologista',
    'Angiologista',
    'Cirurgião Geral',
    'Cirurgião Plástico',
    'Cirurgião Cardiovascular',
    'Neurocirurgião',
    'Cirurgião Pediátrico'
  ];

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
      if (!tipoProfissional) {
        alert('Por favor, selecione o tipo de profissional.');
        return;
      }
      if (tipoProfissional === 'medico' && !especialidadeMedica) {
        alert('Por favor, selecione sua especialidade médica.');
        return;
      }
      if (tipoProfissional === 'outros' && !profissaoCustomizada.trim()) {
        alert('Por favor, informe sua profissão.');
        return;
      }
      if (!numeroConselho || !numeroConselho.trim()) {
        alert('Por favor, informe o número do conselho.');
        return;
      }
      if (!validarNumeroConselho(numeroConselho, tipoProfissional)) {
        let mensagemErro = 'Número do conselho inválido. ';
        switch (tipoProfissional) {
          case 'medico':
            mensagemErro += 'Formato esperado: CRM 123456 (4 a 6 dígitos)';
            break;
          case 'dentista':
            mensagemErro += 'Formato esperado: CRO 123456 (4 a 6 dígitos)';
            break;
          case 'nutricionista':
            mensagemErro += 'Formato esperado: CRN 12345 (4 a 5 dígitos)';
            break;
          case 'fisioterapeuta':
            mensagemErro += 'Formato esperado: CREFITO 123456 (4 a 6 dígitos)';
            break;
          case 'fonoaudiologo':
            mensagemErro += 'Formato esperado: CRFa 12345 (4 a 5 dígitos)';
            break;
          default:
            mensagemErro += 'Formato inválido (3 a 10 dígitos)';
        }
        alert(mensagemErro);
        return;
      }
      if (!ufRegiao || !ufRegiao.trim()) {
        alert('Por favor, selecione a UF/Região.');
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
          tipoProfissional: tipoProfissional === 'outros' ? profissaoCustomizada : tipoProfissional,
          especialidadeMedica: tipoProfissional === 'medico' ? especialidadeMedica : null,
          profissaoCustomizada: tipoProfissional === 'outros' ? profissaoCustomizada : null,
          numeroConselho: numeroConselho.trim(),
          ufRegiao: ufRegiao.trim()
        })
      };

      const response = await axios.post('http://localhost:3000/register', dadosRegistro);
      console.log(response.data);
      alert('Usuário cadastrado com sucesso!');
      
      if (tipoUsuario === 'profissional') {
        await new Promise(resolve => setTimeout(resolve, 500));
        const userData = await login(email, senha);
        if (userData) {
          navigate('/AdminDashboard');
        } else {
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
                  value="paciente"
                  checked={tipoUsuario === 'paciente'}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                />
                Paciente
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
                <label style={{ display: 'block', marginBottom: '8px', textAlign: 'left' }}>Tipo de Profissional:</label>
                <Select
                  value={tipoProfissional}
                  onChange={(e) => {
                    setTipoProfissional(e.target.value);
                    if (e.target.value !== 'outros') {
                      setProfissaoCustomizada('');
                    }
                    if (e.target.value !== 'medico') {
                      setEspecialidadeMedica('');
                    }
                  }}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="medico">Médico</option>
                  <option value="dentista">Dentista</option>
                  <option value="nutricionista">Nutricionista</option>
                  <option value="fisioterapeuta">Fisioterapeuta</option>
                  <option value="fonoaudiologo">Fonoaudiólogo</option>
                  <option value="outros">Outros</option>
                </Select>
              </div>

              {tipoProfissional === 'medico' && (
                <div>
                  <label>Especialidade Médica:</label>
                  <Select
                    value={especialidadeMedica}
                    onChange={(e) => setEspecialidadeMedica(e.target.value)}
                    required
                  >
                    <option value="">Selecione sua especialidade...</option>
                    {especialidadesMedicas.map((especialidade) => (
                      <option key={especialidade} value={especialidade}>
                        {especialidade}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {tipoProfissional === 'outros' && (
                <Input
                  type="text"
                  placeholder="Digite sua profissão"
                  value={profissaoCustomizada}
                  onChange={(e) => setProfissaoCustomizada(e.target.value)}
                  required
                />
              )}

              <Input
                type="text"
                placeholder={
                  tipoProfissional === 'medico' ? 'CRM 123456' :
                  tipoProfissional === 'dentista' ? 'CRO 123456' :
                  tipoProfissional === 'nutricionista' ? 'CRN 12345' :
                  tipoProfissional === 'fisioterapeuta' ? 'CREFITO 123456' :
                  tipoProfissional === 'fonoaudiologo' ? 'CRFa 12345' :
                  'Número do Conselho'
                }
                value={numeroConselho}
                onChange={handleNumeroConselhoChange}
                maxLength={
                  tipoProfissional === 'medico' ? 11 :
                  tipoProfissional === 'dentista' ? 11 :
                  tipoProfissional === 'nutricionista' ? 10 :
                  tipoProfissional === 'fisioterapeuta' ? 14 :
                  tipoProfissional === 'fonoaudiologo' ? 10 :
                  15
                }
                required
              />

              <Select
                value={ufRegiao}
                onChange={(e) => setUfRegiao(e.target.value)}
                required
              >
                <option value="">Selecione a UF/Região</option>
                <option value="AC">AC - Acre</option>
                <option value="AL">AL - Alagoas</option>
                <option value="AP">AP - Amapá</option>
                <option value="AM">AM - Amazonas</option>
                <option value="BA">BA - Bahia</option>
                <option value="CE">CE - Ceará</option>
                <option value="DF">DF - Distrito Federal</option>
                <option value="ES">ES - Espírito Santo</option>
                <option value="GO">GO - Goiás</option>
                <option value="MA">MA - Maranhão</option>
                <option value="MT">MT - Mato Grosso</option>
                <option value="MS">MS - Mato Grosso do Sul</option>
                <option value="MG">MG - Minas Gerais</option>
                <option value="PA">PA - Pará</option>
                <option value="PB">PB - Paraíba</option>
                <option value="PR">PR - Paraná</option>
                <option value="PE">PE - Pernambuco</option>
                <option value="PI">PI - Piauí</option>
                <option value="RJ">RJ - Rio de Janeiro</option>
                <option value="RN">RN - Rio Grande do Norte</option>
                <option value="RS">RS - Rio Grande do Sul</option>
                <option value="RO">RO - Rondônia</option>
                <option value="RR">RR - Roraima</option>
                <option value="SC">SC - Santa Catarina</option>
                <option value="SP">SP - São Paulo</option>
                <option value="SE">SE - Sergipe</option>
                <option value="TO">TO - Tocantins</option>
              </Select>
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