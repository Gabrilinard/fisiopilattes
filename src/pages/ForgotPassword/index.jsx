import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import emailjs from 'emailjs-com';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: rgb(227, 228, 222);
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
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 15px;
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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  const sendPasswordResetEmail = (userEmail, userId) => {
    console.log(userEmail, userId);

    if (!userEmail || !userId) {
      console.log('E-mail ou ID não fornecidos.');
      return;
    }

    const templateParams = {
      email: userEmail,
      reset_link: userId,
    };

    emailjs
      .send('service_5guvy7s', 'template_6rjaiue', templateParams, '95NytkXcfDF9Z3EEQ')
      .then((response) => {
        console.log('E-mail de redefinição de senha enviado com sucesso:', response.status, response.text);
        alert('E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.');

        // Redirecionar após o envio do e-mail
        navigate('/ResetPassword');  // Redireciona para a página /ResetPassword
      })
      .catch((error) => {
        console.error('Erro ao enviar e-mail de redefinição de senha:', error);
        alert('Erro ao enviar o e-mail. Tente novamente mais tarde.');
      });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('Por favor, insira seu e-mail.');
      return;
    }
    console.log("E-mail digitado:", email);

    // Chamada para o back-end para obter a ID do usuário com o e-mail fornecido
    const response = await fetch('https://apis-fisio-production.up.railway.app/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      const userId = data.userId; // Recebe a ID do usuário do back-end

      // Enviar o e-mail com o link de redefinição
      sendPasswordResetEmail(email, userId);
    } else {
      alert('Usuário não encontrado.');
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <h2>Redefinir Senha</h2>
        <form onSubmit={handleForgotPassword}>
          <Input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">Enviar Link de Redefinição</Button>
        </form>
      </FormWrapper>
    </PageWrapper>
  );
};

export default ForgotPassword;
