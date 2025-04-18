import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Ícones de olho
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../../components/Footer'; // Importando o Footer
import Header from '../../components/Header'; // Importando o Header
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom'; // Add this import

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Garante que o conteúdo ocupe a tela toda */
  background-color: rgb(227, 228, 222);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-grow: 1; /* O conteúdo ocupa o espaço disponível */
  padding-top: 40px;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  margin-bottom: 20px; /* Espaço abaixo do formulário */
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  padding: 12px;
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

const RegisterButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: rgb(143, 142, 142);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background-color: rgb(82, 83, 84);
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const { user } = useAuth(); 
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  const success = await login(email, senha);
  if (success) {
    if (email === 'gabrielleite729@gmail.com') {
      navigate('/AdminDashboard');
    } else {
      navigate('/');
    }
  } else {
    alert('E-mail ou senha incorretos.');
  }
};


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageWrapper>
      <Header /> {/* Exibindo o Header */}
      <ContentContainer>
        <FormWrapper>
          <h2>Entrar</h2>
          <Form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            <Button type="submit">Entrar</Button>
          </Form>
          <RegisterButton onClick={() => navigate('/Registrar')}>
            Não tem uma conta? Registrar-se
          </RegisterButton>
        </FormWrapper>
      </ContentContainer>
      <Footer /> {/* Exibindo o Footer */}
    </PageWrapper>
  );
};

export default Login;
