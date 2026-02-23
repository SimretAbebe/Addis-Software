import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

const SidebarWrapper = styled.div`
  width: 220px;
  min-height: 100vh;
  background-color: #000;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 90px;
`;

const Logo = styled.div`
  color: ${theme.colors.primary};
  font-size: 22px;
  font-weight: bold;
  padding: 0 24px 32px 24px;
  letter-spacing: 1px;
`;

const NavSection = styled.div`
  padding: 0 8px;
`;

const NavLabel = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 0 16px;
  margin: 16px 0 8px 0;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  color: ${props => props.active ? theme.colors.text : theme.colors.textSecondary};
  background-color: ${props => props.active ? '#282828' : 'transparent'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  font-size: 14px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    color: ${theme.colors.text};
    background-color: #1a1a1a;
  }
`;

const NavIcon = styled.span`
  font-size: 16px;
  width: 20px;
  text-align: center;
`;

const Sidebar = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '[H]' },
    { id: 'songs', label: 'Songs', icon: '[M]' },
    { id: 'stats', label: 'Statistics', icon: '[S]' },
  ];

  return (
    <SidebarWrapper>
      <Logo>Addis Music</Logo>
      <NavSection>
        <NavLabel>Menu</NavLabel>
        {navItems.map(item => (
          <NavItem 
            key={item.id}
            active={activePage === item.id}
            onClick={() => onNavigate(item.id)}
          >
            <NavIcon>{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}
      </NavSection>
    </SidebarWrapper>
  );
};

export default Sidebar;
