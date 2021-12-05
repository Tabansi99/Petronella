import { render, screen, waitFor } from '../../../testUtils/testTools';
import { getMock } from '../../../testUtils/getMock';
import fetchMock from 'fetch-mock-jest';
import Dashboard from '../../../../src/pages/app/user/dashboard';
import { ApplicationLayout } from '../../../../src/components/utils/applicationLayout';
import { Button, Checkbox } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../src/components/utils/applicationLayout.tsx');
getMock(ApplicationLayout).mockImplementation(({ children }) => <>{children}</>);

jest.mock('@react-google-maps/api', () => {
  return {
    useLoadScript: jest.fn(() => ({
      isLoaded: true,
      loadError: undefined,
      url: '',
    })),
    withGoogleMap: jest.fn((Component) => Component),
    withScriptjs: jest.fn((Component) => Component),
    InfoWindow: jest.fn((props) => (
      <div>
        <Button onClick={props.onCloseClick}>Close</Button>
        {props.children}
      </div>
    )),
    Marker: jest.fn((props) => <Button onClick={props.onClick}>{props['data-testid']}</Button>),
    GoogleMap: jest.fn((props) => (
      <div>
        <div className="mock-google-maps" />
        {props.children}
      </div>
    )),
  };
});

describe('web /app/user/dashboard', () => {
  it('renders', async () => {
    fetchMock.get('/api/recommendations/normal', [
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

    fetchMock.get('/api/flights/', [
      {
        id: '1',
        createdAt: '2021-11-06T04:10:12.000Z',
        updatedAt: '2021-11-06T04:10:12.000Z',
        user: {
          id: '1',
        },
        flightDate: '2021-11-02',
        departureCity: 'Chicago',
        arrivalCity: 'Austin',
        destination: {
          id: '1',
          createdAt: '2021-11-06T04:10:12.000Z',
          updatedAt: '2021-11-06T04:10:12.000Z',
          city: 'Austin',
          region: 'Texas',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-97.733333333',
          latitude: '30.3',
        },
      },
    ]);

    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/normal');
      expect(fetchMock).toHaveFetched('/api/flights/');
    });

    expect(screen.getByText('England,')).toBeVisible();
    expect(screen.getByText('London')).toBeVisible();
    expect(screen.getByText('United Kingdom')).toBeVisible();
    expect(screen.getByText('2021-11-02')).toBeVisible();
    expect(screen.getByText('Austin')).toBeVisible();
    expect(screen.getByText('Texas,')).toBeVisible();
  });

  it('renders only 20 recommendation pins', async () => {
    fetchMock.get(
      '/api/recommendations/normal',
      [
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
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
        {
          id: '36',
          createdAt: '2021-11-09T04:06:29.000Z',
          updatedAt: '2021-11-09T04:06:29.000Z',
          city: 'Los Angeles',
          region: 'California',
          country: 'United States of America',
          continent: 'North America',
          longitude: '-157.857194444',
          latitude: '21.304694444',
        },
      ],
      { overwriteRoutes: true },
    );

    fetchMock.get(
      '/api/flights/',
      [
        {
          id: '1',
          createdAt: '2021-11-06T04:10:12.000Z',
          updatedAt: '2021-11-06T04:10:12.000Z',
          user: {
            id: '1',
          },
          flightDate: '2021-11-02',
          departureCity: 'Chicago',
          arrivalCity: 'Austin',
          destination: {
            id: '1',
            createdAt: '2021-11-06T04:10:12.000Z',
            updatedAt: '2021-11-06T04:10:12.000Z',
            city: 'Austin',
            region: 'Texas',
            country: 'United States of America',
            continent: 'North America',
            longitude: '-97.733333333',
            latitude: '30.3',
          },
        },
      ],
      { overwriteRoutes: true },
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/normal');
      expect(fetchMock).toHaveFetched('/api/flights/');
    });

    expect(screen.getByText('England,')).toBeVisible();
    expect(screen.getByText('London')).toBeVisible();
    expect(screen.getByText('United Kingdom')).toBeVisible();
    expect(screen.getByText('2021-11-02')).toBeVisible();
    expect(screen.getByText('Austin')).toBeVisible();
    expect(screen.getByText('Texas,')).toBeVisible();
  });

  it('renders with no flight history', async () => {
    render(<Dashboard />);

    expect(screen.getByText('Your recent flights')).toBeVisible();
    expect(screen.getByText('Add a flight...')).toBeVisible();
  });

  it('users can click flight [pin] and have [info box] display on map then click the close button to remove it', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/normal');
      expect(fetchMock).toHaveFetched('/api/flights/');
    });

    const pin = screen.getByText('Austin Pin');
    userEvent.click(pin);

    expect(screen.getByText('England,')).toBeVisible();
    expect(screen.getByText('London')).toBeVisible();
    expect(screen.getByText('United Kingdom')).toBeVisible();
    expect(screen.getAllByText('2021-11-02')).toHaveLength(2);
    expect(screen.getAllByText('Austin')).toHaveLength(2);
    expect(screen.getAllByText('Texas,')).toHaveLength(2);
    expect(screen.getAllByText('United States of America')).toHaveLength(5);
    expect(screen.getAllByText('North America')).toHaveLength(6);

    const close = screen.getByText('Close');
    userEvent.click(close);

    const pin2 = screen.getByText('Honolulu Pin');
    userEvent.click(pin2);
  });

  it('users can click destination [pin] and have [info box] display on map then click the close button to remove it', async () => {
    fetchMock.get(
      '/api/recommendations/normal',
      [
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
      ],
      { overwriteRoutes: true },
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/normal');
      expect(fetchMock).toHaveFetched('/api/flights/');
    });

    const pin = screen.getByText('London Pin');
    userEvent.click(pin);

    expect(screen.getAllByText('England,')).toHaveLength(2);
    expect(screen.getAllByText('London')).toHaveLength(2);
    expect(screen.getAllByText('United Kingdom')).toHaveLength(2);
    expect(screen.getAllByText('Europe')).toHaveLength(2);
    expect(screen.getByText('2021-11-02')).toBeVisible();
    expect(screen.getByText('Chicago')).toBeVisible();
    expect(screen.getByText('Austin')).toBeVisible();
    expect(screen.getByText('Texas,')).toBeVisible();
    expect(screen.getByText('United States of America')).toBeVisible();
    expect(screen.getByText('North America')).toBeVisible();

    const close = screen.getByText('Close');
    userEvent.click(close);
  });

  it('API call fails', async () => {
    fetchMock.get('/api/recommendations/normal', 500, { overwriteRoutes: true });
    fetchMock.get('/api/flights/', 500, { overwriteRoutes: true });

    console.log = jest.fn();

    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/normal');
      expect(fetchMock).toHaveFetched('/api/flights/');
    });

    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('users can click filters to have destination [pin] be removed or added', async () => {
    fetchMock.get(
      '/api/recommendations/normal',
      [
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
      ],
      { overwriteRoutes: true },
    );

    fetchMock.get(
      '/api/flights/',
      [
        {
          id: '1',
          createdAt: '2021-11-06T04:10:12.000Z',
          updatedAt: '2021-11-06T04:10:12.000Z',
          user: {
            id: '1',
          },
          flightDate: '2021-11-02',
          departureCity: 'Chicago',
          arrivalCity: 'Austin',
          destination: {
            id: '1',
            createdAt: '2021-11-06T04:10:12.000Z',
            updatedAt: '2021-11-06T04:10:12.000Z',
            city: 'Austin',
            region: 'Texas',
            country: 'United States of America',
            continent: 'North America',
            longitude: '-97.733333333',
            latitude: '30.3',
          },
        },
      ],
      { overwriteRoutes: true },
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/recommendations/normal');
      expect(fetchMock).toHaveFetched('/api/flights/');
    });

    const checkBoxOne = screen.getByText('Previous Flights');
    const checkBoxTwo = screen.getByText('Highly Recommended Flights');
    const checkBoxThree = screen.getByText('Recommended Flights');

    userEvent.click(checkBoxOne);
    userEvent.click(checkBoxTwo);
    userEvent.click(checkBoxThree);
  });
});
