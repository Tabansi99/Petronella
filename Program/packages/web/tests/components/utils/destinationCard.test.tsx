import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { DestinationCard } from '../../../src/components/utils/destinationCard';

describe('DestinationCard', () => {
  it('renders destination card', async () => {
    render(
      <DestinationCard
        destinationCity={'New York City'}
        destinationRegion={'New York'}
        destinationCountry={'United States of America'}
        destinationContinent={'North America'}
        destinationLatitude={0}
        destinationLongitude={0}
        rating={1}
      />,
    );

    expect(screen.queryByText('New York City')).toBeVisible();
    expect(screen.queryByText('New York,')).toBeVisible();
    expect(screen.queryByText('United States of America')).toBeVisible();
    expect(screen.queryByText('North America')).toBeVisible();
  });
});
