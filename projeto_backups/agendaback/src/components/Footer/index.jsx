import React from 'react';
import { FooterContainer, LeftSection, PrimaryInfo, RightSection, ContactInfo, LocationInfo, Desenvolvido } from './style';

const Footer = () => {
  return (
    <FooterContainer>
      <LeftSection>
        <PrimaryInfo>
            <h1 className="BrandName">FisioPilates</h1>
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
          <p className="Text">@fisio.pilattes</p>
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
