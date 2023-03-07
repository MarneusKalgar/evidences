import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { ScreenSizes, Colors } from 'constants/index';

export const StyledMain = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Row
export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: column;
  gap: 24px;
  margin-top: 20px;

  & > div {
    flex: 1 0 calc(50% - 20px);
  }

  @media (min-width: ${ScreenSizes.tabP}px) {
    flex-direction: row;
    margin-top: 50px;
    gap: 40px;

    & > div {
      max-width: calc(50% - 20px);
    }
  }
`;

export const RowWith3Cols = styled(Row)`
  & > div {
    flex: 1 0 calc(33.3% - 40px);
  }
`;

export const CenteredRow = styled(Row)`
  justify-content: center;
`;

// SizeLimiter
export const SizeLimiter = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

// MultiColumnBlock
export const MultiColumnBlock = styled.div`
  @media (min-width: ${ScreenSizes.tabP}px) {
    column-count: 2;
    column-gap: 50px;
  }
`;

// MainTitle
export const MainTitle = styled.h1`
  margin: 0 0 10px 0;
  font-size: 26px;
  text-transform: uppercase;

  @media (min-width: ${ScreenSizes.tabP}px) {
    margin-bottom: 16px;
    font-size: 36px;
  }
`;

// Title
export const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  text-transform: uppercase;

  @media (min-width: ${ScreenSizes.tabL}px) {
    margin-bottom: 20px;
    font-size: 22px;
  }
`;

export const CenteredTitle = styled(Title)`
  text-align: center;
`;

// Text
export const Text = styled.p`
  margin: 0 0 12px 0;
  font-size: 16px;
  line-height: 1.35;

  @media (min-width: ${ScreenSizes.tabL}px) {
    font-size: 18px;
    margin-bottom: 14px;
  }
`;

export const ColoredText = styled(Text)`
  color: ${Colors.secondaryDark};
`;

export const CenteredText = styled(Text)`
  text-align: center;
`;

export const FeaturedLink = styled(Link)`
  height: 280px;
  max-height: 100%;
  overflow: hidden;
`;
