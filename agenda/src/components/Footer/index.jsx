import React from 'react';
import {
  InstagramLink,
  FooterContainer,
  LeftSection,
  PrimaryInfo,
  RightSection,
  ContactInfo,
  LocationInfo,
  Desenvolvido,
  LogoImage,
} from './style';
import fisiologo from '../../assets/fisiologo.jpg';
import { FaInstagram } from 'react-icons/fa'; // usa o ícone do pacote

const Footer = () => {
  return (
    <FooterContainer>
      <LeftSection>
        <PrimaryInfo>
          <LogoImage src={fisiologo} alt="Logo Fisiopilates" />
          <p className="Slogan">Seu Treino é nossa obrigação!</p>
        </PrimaryInfo>
      </LeftSection>

      <RightSection>
        <LocationInfo>
          <h2 className="SectionTitle">Localização</h2>
          <p className="Text">Av. Pedro Almeida, 413</p>
          <p className="Text">Teresina, PI</p>
        </LocationInfo>

        <ContactInfo>
          <h2 className="SectionTitle">Contato</h2>
          <p className="Text">
          <InstagramLink
            href="https://www.instagram.com/fisio.pilattes/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={20} />
            @fisio.pilattes
          </InstagramLink>
          </p>
          <p className="Text">(98) 98202-1516</p>
        </ContactInfo>

        <Desenvolvido>
          <h2 className="Text">Desenvolvido por: Gabriel Linard</h2>
          <p className="Text">@gabrilinard</p>
          <p className="Text">gabrielleite729@gmail.com</p>
        </Desenvolvido>
      </RightSection>
    </FooterContainer>
  );
};

export default Footer;
