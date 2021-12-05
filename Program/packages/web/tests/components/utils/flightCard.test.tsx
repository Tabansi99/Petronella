import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { FlightCard } from '../../../src/components/utils/flightCard';

describe('FlightCard', () => {
  it('renders flight card', async () => {
    render(
      <FlightCard
        flightDate={'10-10-2021'}
        departureCity={'Chicago'}
        destinationCity={'New York City'}
        destinationRegion={'New York'}
        destinationCountry={'United States of America'}
        destinationContinent={'North America'}
        destinationLatitude={0}
        destinationLongitude={0}
      />,
    );

    expect(screen.queryByText('New York City')).toBeVisible();
    expect(screen.queryByText('New York,')).toBeVisible();
    expect(screen.queryByText('United States of America')).toBeVisible();
    expect(screen.queryByText('North America')).toBeVisible();
    expect(screen.queryByText('10-10-2021')).toBeVisible();
    expect(screen.queryByText('Chicago')).toBeVisible();
  });
});
