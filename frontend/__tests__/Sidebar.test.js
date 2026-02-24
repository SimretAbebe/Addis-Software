import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../src/components/Sidebar';

describe('Sidebar', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders all navigation items', () => {
    render(<Sidebar activePage="songs" onNavigate={mockNavigate} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Songs')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  it('renders the app logo', () => {
    render(<Sidebar activePage="songs" onNavigate={mockNavigate} />);
    expect(screen.getByText('Addis Music')).toBeInTheDocument();
  });

  it('calls onNavigate with "home" when Home is clicked', () => {
    render(<Sidebar activePage="songs" onNavigate={mockNavigate} />);
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });

  it('calls onNavigate with "songs" when Songs is clicked', () => {
    render(<Sidebar activePage="home" onNavigate={mockNavigate} />);
    fireEvent.click(screen.getByText('Songs'));
    expect(mockNavigate).toHaveBeenCalledWith('songs');
  });

  it('calls onNavigate with "stats" when Statistics is clicked', () => {
    render(<Sidebar activePage="songs" onNavigate={mockNavigate} />);
    fireEvent.click(screen.getByText('Statistics'));
    expect(mockNavigate).toHaveBeenCalledWith('stats');
  });
});
