import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    console.log({ nome, sobrenome, telefone, email, senha }); // Verificar os dados
  
    const senhaValida = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  
    if (!senhaValida.test(senha)) {
      alert('A senha deve ter no mínimo 8 caracteres, incluindo pelo menos um número e uma letra maiúscula.');
      return;
    }
  
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/register', { nome, sobrenome, telefone, email, senha });
      console.log(response.data); // Verificar a resposta
      alert('Usuário cadastrado com sucesso!');
      navigate('/Entrar');
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar. Tente novamente.');
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
  
    // Aplica a formatação (XX 9XXXX-XXXX)
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