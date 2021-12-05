import React from 'react';
import { render, screen, waitFor } from '../../../testUtils/testTools';
import fetchMock from 'fetch-mock-jest';
import { getMock } from '../../../testUtils/getMock';
import Recommendations from '../../../../src/pages/app/user/recommendations';
import { ApplicationLayout } from '../../../../src/components/utils/applicationLayout';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../src/components/utils/applicationLayout.tsx');
getMock(ApplicationLayout).mockImplementation(({ children }) => <>{children}</>);

describe('web /app/user/recommendations', () => {
  it('Renders page and populates destination card on page with info gotten from API call', async () => {
    fetchMock.get('/api/recommendations/normal', [
      {
        id: '17',
        createdAt: '2021-11-08T03:03:23.000Z',
        updatedAt: '2021-11-08T03:03:23.000Z',
        city: 'Washington, D.C.',
        region: 'District of Columbia',
        country: 'United States of America',
        continent: 'North America',
        longitude: '-77.03637',
        latitude: '38.89511',
      },
      {
        id: '16',
        createdAt: '2021-11-08T00:55:35.000Z',
        updatedAt: '2021-11-08T00:55:35.000Z',
        city: 'New York City',
        region: 'New York',
        country: 'United States of America',
        continent: 'North America',
        longitude: '-74.006015',
        latitude: '40.712728',
      },
      {
        id: '22',
        createdAt: '2021-11-09T03:56:35.000Z',
        updatedAt: '2021-11-09T03:56:35.000Z',
        city: 'London',
        region: 'England',
        country: 'United Kingdom',
        continent: 'Europe',
        longitude: '-0.1275',
        latitude: '51.507222222',
      },
      {
        id: '31',
        createdAt: '2021-11-09T04:03:55.000Z',
        updatedAt: '2021-11-09T04:03:55.000Z',
        city: 'Madrid',
        region: 'Community of Madrid',
        country: 'Spain',
        continent: 'Europe',
        longitude: '-3.691944444',
        latitude: '40.418888888',
      },
      {
        id: '24',
        createdAt: '2021-11-09T03:58:03.000Z',
        updatedAt: '2021-11-09T03:58:03.000Z',
        city: 'Cancun',
        region: 'Quintana Roo',
        country: 'Mexico',
        continent: 'North America',
        longitude: '-86.8475',
        latitude: '21.160555555',
      },
      {
        id: '26',
        createdAt: '2021-11-09T03:59:41.000Z',
        updatedAt: '2021-11-09T03:59:41.000Z',
        city: 'Chicago',
        region: 'Illinois',
        country: 'United States of America',
        continent: 'North America',
        longitude: '-87.627777777',
        latitude: '41.881944444',
      },
      {
        id: '34',
        createdAt: '2021-11-09T04:06:29.000Z',
        updatedAt: '2021-11-09T04:06:29.000Z',
        city: 'Honolulu',
        region: 'Hawaii',
        country: 'United States of America',
        continent: 'North America',
        longitude: '-157.857194444',
        latitude: '21.304694444',
      },
    ]);

    render(<Recommendations />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/normal');
    });

    expect(screen.queryByText('Honolulu')).toBeVisible();
    expect(screen.queryByText('Washington, D.C.'));
    expect(screen.queryByText('New York,')).toBeVisible();
    expect(screen.queryByText('United Kingdom')).toBeVisible();
    expect(screen.queryByText('London')).toBeVisible();
    expect(screen.queryByText('Community of Madrid,')).toBeVisible();
    expect(screen.queryAllByText('Europe')).toHaveLength(2);
    expect(screen.queryAllByText('United States of America')).toHaveLength(4);
    expect(screen.queryAllByText('North America')).toHaveLength(5);
    expect(screen.queryByText('Illinois,')).toBeVisible();
    expect(screen.queryAllByText('Highly Recommended')).toHaveLength(5);
    expect(screen.queryAllByText('Recommended')).toHaveLength(2);
    expect(screen.queryAllByText('Book Flight')).toHaveLength(7);
    expect(screen.queryByText('Chicago')).toBeVisible();
    expect(screen.queryByText('Madrid')).toBeVisible();
    expect(screen.queryByText('New York City')).toBeVisible();
    expect(screen.queryByText('Hawaii,')).toBeVisible();
    expect(screen.queryByText('Spain')).toBeVisible();
    expect(screen.queryByText('England,')).toBeVisible();
  });

  it('Api call fails', async () => {
    fetchMock.get('/api/recommendations/normal', 500, { overwriteRoutes: true });
    console.log = jest.fn();

    render(<Recommendations />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/normal');
      expect(console.log).toHaveBeenCalledWith(Error('Failed'));
    });
  });

  it('Cold preference button works', async () => {
    fetchMock.get(
      '/api/recommendations/normal',
      [
        {
          id: '34',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Honolulu',
          region: 'Hawaii',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
      ],
      { overwriteRoutes: true },
    );

    fetchMock.get('/api/recommendations/cold', [
      {
        id: '26',
        createdAt: '2021-11-09T03:59:41.000Z',
        updatedAt: '2021-11-09T03:59:41.000Z',
        city: 'Chicago',
        region: 'Illinois',
        country: 'United States of America',
        continent: 'North America',
        longitude: '-87.627777777',
        latitude: '41.881944444',
      },
    ]);

    render(<Recommendations />);

    const coldButton = screen.getByText('Cold');
    userEvent.click(coldButton);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/cold');
    });

    expect(screen.queryByText('Chicago')).toBeVisible();
    expect(screen.queryByText('Illinois,')).toBeVisible();
    expect(screen.queryByText('United States of America'));
    expect(screen.queryByText('North America')).toBeVisible();
    expect(screen.queryByText('Highly Recommended')).toBeVisible();
    expect(
      screen.queryByText(
        'Based on users with similiar climate preferences, we thought you would also like these destinations...',
      ),
    ).toBeVisible();
  });

  it('Warm preference button works', async () => {
    fetchMock.get(
      '/api/recommendations/normal',
      [
        {
          id: '34',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Honolulu',
          region: 'Hawaii',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
      ],
      { overwriteRoutes: true },
    );

    fetchMock.get('/api/recommendations/warm', [
      {
        id: '26',
        createdAt: '2021-11-09T03:59:41.000Z',
        updatedAt: '2021-11-09T03:59:41.000Z',
        city: 'Chicago',
        region: 'Illinois',
        country: 'United States of America',
        continent: 'North America',
        longitude: '-87.627777777',
        latitude: '41.881944444',
      },
    ]);

    render(<Recommendations />);

    const warmButton = screen.getByText('Warm');
    userEvent.click(warmButton);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/warm');
    });

    expect(screen.queryByText('Chicago')).toBeVisible();
    expect(screen.queryByText('Illinois,')).toBeVisible();
    expect(screen.queryByText('United States of America'));
    expect(screen.queryByText('North America')).toBeVisible();
    expect(screen.queryByText('Highly Recommended')).toBeVisible();
  });

  it('No preference button works', async () => {
    fetchMock.get(
      '/api/recommendations/normal',
      [
        {
          id: '26',
          createdAt: '2021-11-09T03:59:41.000Z',
          updatedAt: '2021-11-09T03:59:41.000Z',
          city: 'Chicago',
          region: 'Illinois',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-87.627777777',
          latitude: '41.881944444',
        },
      ],
      { overwriteRoutes: true },
    );

    render(<Recommendations />);

    const warmButton = screen.getByText('None');
    userEvent.click(warmButton);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/normal');
    });

    expect(screen.queryByText('Chicago')).toBeVisible();
    expect(screen.queryByText('Illinois,')).toBeVisible();
    expect(screen.queryByText('United States of America'));
    expect(screen.queryByText('North America')).toBeVisible();
    expect(screen.queryByText('Highly Recommended')).toBeVisible();
  });
});
