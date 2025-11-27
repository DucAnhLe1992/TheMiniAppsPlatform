import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const FooterWrap = styled.footer`
  margin-top: 24px;
  padding: 16px 24px;
  background: ${props => props.theme.colors.backgroundElevated};
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
`;

const Links = styled.nav`
  display: flex;
  gap: 16px;

  .footer-link {
    color: ${props => props.theme.colors.textSecondary};
    text-decoration: none;
  }

  .footer-link:hover {
    color: ${props => props.theme.colors.text};
    text-decoration: underline;
  }
`;

const Status = styled.div`
  opacity: 0.8;
`;

const Footer: React.FC = () => {
  return (
    <FooterWrap>
      <Links>
        <Link className="footer-link" to="/profile">Profile</Link>
        <Link className="footer-link" to="/about">About</Link>
        <a className="footer-link" href="mailto:feedback@miniapps.local">Feedback</a>
      </Links>
      <Status>Last sync: just now</Status>
    </FooterWrap>
  );
};

export default Footer;
