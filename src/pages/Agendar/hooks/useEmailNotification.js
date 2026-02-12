import { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

export const useEmailNotification = (user) => {
  const [solicitCount, setSolicitCount] = useState(0);
  const [edicoesCount, setEdicoesCount] = useState(0);
  const [faltasCount, setFaltasCount] = useState(0);

  const sendEmailNotification = (userEmail, userName, solicitCount, faltasCount, edicoesCount) => {
    const adminName = 'Italo';
    const email = userEmail;

    if (faltasCount > 0 || edicoesCount > 0 || solicitCount > 0) {
      const templateParams = {
        to_email: email,
        name: adminName || 'Nome não informado',
        message: solicitCount || "0",
        faltas: faltasCount ? faltasCount : "0",
        edicoes: edicoesCount ? edicoesCount : "0"
      };

      emailjs.send(
        'service_5guvy7s',
        'template_me4jkpe',
        templateParams,
        '95NytkXcfDF9Z3EEQ'
      )
      .then((response) => {
        console.log('E-mail enviado com sucesso:', response.status, response.text);
      })
      .catch((error) => {
        console.error('Erro ao enviar e-mail:', error);
      });
    } else {
      console.log('Condições não atendidas para envio de e-mail.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (faltasCount > 0 || edicoesCount > 0 || solicitCount > 0) {
        sendEmailNotification(user?.email, user?.nome, solicitCount, faltasCount, edicoesCount);

        setSolicitCount(0);
        setFaltasCount(0);
        setEdicoesCount(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [solicitCount, faltasCount, edicoesCount, user]);

  useEffect(() => {
    const storedCount = sessionStorage.getItem('solicitCount');
    if (storedCount) {
      setSolicitCount(parseInt(storedCount, 10));
      sessionStorage.removeItem('solicitCount');
    }
  }, []);

  return {
    solicitCount,
    setSolicitCount,
    edicoesCount,
    setEdicoesCount,
    faltasCount,
    setFaltasCount,
    sendEmailNotification
  };
};
