import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FooterContainer,
  FooterContent,
  LeftSection,
  LogoImage,
  BrandName,
  Description,
  WhatsAppCircle,
  WhatsAppLink,
  WhatsAppIcon,
  ContactLabel,
} from './style';
import pngLogoAgende from '../../assets/pnglogoagende.png';

const Footer = () => {
  const whatsappNumber = '86994273418';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <FooterContainer>
      <FooterContent>
        <LeftSection>
          <LogoImage src={pngLogoAgende} alt="Logo Agende Aqui" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <BrandName>Agende Aqui</BrandName>
            <Description>
              Conectando profissionais de saúde e pacientes de forma simples e eficiente. 
              Nossa plataforma oferece uma experiência completa para agendamento de consultas, 
              facilitando o acesso aos cuidados de saúde que você precisa, quando você precisa.
            </Description>
          </div>
        </LeftSection>
        <WhatsAppCircle>
          <ContactLabel>Contato:</ContactLabel>
          <WhatsAppLink href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon>
              <FaWhatsapp />
            </WhatsAppIcon>
          </WhatsAppLink>
        </WhatsAppCircle>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
