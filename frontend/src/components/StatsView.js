import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-top: 8px;
`;

const StatCard = styled.div`
  background: ${theme.colors.surface};
  padding: 24px;
  border-radius: ${theme.borderRadius};
  text-align: center;
`;

const StatsView = ({ list }) => {
  const totalSongs = list.length;
  const uniqueArtists = new Set(list.map(s => s.artist)).size;
  const uniqueAlbums = new Set(list.map(s => s.album)).size;

  return (
    <StatGrid>
      <StatCard>
        <h2 style={{ color: theme.colors.primary, margin: 0 }}>{totalSongs}</h2>
        <p style={{ color: theme.colors.textSecondary, margin: '8px 0 0' }}>Songs (this page)</p>
      </StatCard>
      <StatCard>
        <h2 style={{ color: theme.colors.primary, margin: 0 }}>{uniqueArtists}</h2>
        <p style={{ color: theme.colors.textSecondary, margin: '8px 0 0' }}>Artists</p>
      </StatCard>
      <StatCard>
        <h2 style={{ color: theme.colors.primary, margin: 0 }}>{uniqueAlbums}</h2>
        <p style={{ color: theme.colors.textSecondary, margin: '8px 0 0' }}>Albums</p>
      </StatCard>
    </StatGrid>
  );
};

export default StatsView;
