import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '../../../testUtils/testTools';
import { getMock } from '../../../testUtils/getMock';
import fetchMock from 'fetch-mock-jest';
import FlightHistory from '../../../../src/pages/app/user/flightHistory';
import { ApplicationLayout } from '../../../../src/components/utils/applicationLayout';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '@chakra-ui/checkbox';

jest.mock('../../../../src/components/utils/applicationLayout.tsx');
getMock(ApplicationLayout).mockImplementation(({ children }) => <>{children}</>);

fetchMock.get('/api/flights/continent/', 404);

jest.setTimeout(30000);
describe('web /app/user/flightHistory', () => {
  it('renders and populates flight card', async () => {
    console.log = jest.fn();

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

    render(<FlightHistory />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/');
      expect(fetchMock).toHaveFetched('/api/flights/continent/');
    });

    expect(screen.getByText('2021-11-02')).toBeVisible();
    expect(screen.getByText('Austin')).toBeVisible();
    expect(screen.getByText('Texas,')).toBeVisible();
  });

  it('tries to add city and auto fills region and country then closes modal', async () => {
    console.log = jest.fn();

    fetchMock.get('/api/flights/check/Paris', {
      exists: true,
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      latitude: 48.856944444,
      longitude: 2.351388888,
    });

    fetchMock.get('/api/flights/continent/France', {
      found: true,
      continent: 'Europe',
    });

    render(<FlightHistory />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/');
      expect(fetchMock).toHaveFetched('/api/flights/continent/');
    });

    const addFlight = screen.getByText('Add Flight');
    userEvent.click(addFlight);

    const city = screen.getByLabelText('Arrival City');
    userEvent.type(city, 'Paris');

    const departureCity = screen.getByLabelText('Departure City');
    userEvent.type(departureCity, 'London');

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/check/Paris');
      expect(fetchMock).toHaveFetched('/api/flights/continent/France');
    });

    expect(screen.getByDisplayValue('Paris')).toBeVisible();
    expect(screen.getByDisplayValue('France')).toBeVisible();
    expect(screen.getByDisplayValue('Île-de-France')).toBeVisible();

    const cancel = screen.getByRole('button', { name: 'Close' });
    userEvent.click(cancel);
  });

  it('does not find city with the API call and tries to submit', async () => {
    console.log = jest.fn();

    render(<FlightHistory />);

    fetchMock.get('/api/flights/check/New York', {
      exists: false,
      city: 'New York City',
      region: 'New York',
      country: 'United States of America',
      latitude: 40.712728,
      longitude: -74.006015,
    });

    fetchMock.get('/api/flights/continent/United States of America', {
      found: true,
      continent: 'North America',
    });

    window.alert = jest.fn();

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/');
      expect(fetchMock).toHaveFetched('/api/flights/continent/');
    });

    const addFlight = screen.getByText('Add Flight');
    userEvent.click(addFlight);

    const city = screen.getByLabelText('Arrival City');
    userEvent.type(city, 'New York');

    const departureCity = screen.getByLabelText('Departure City');
    userEvent.type(departureCity, 'London');

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/check/New York');
      expect(fetchMock).toHaveFetched('/api/flights/continent/United States of America');
      expect(window.alert).toHaveBeenCalledWith(
        "Couldn't find location '" +
          'New York' +
          "'." +
          '\n' +
          'Maybe: ' +
          'New York City' +
          ', ' +
          'New York' +
          '. ' +
          'United States of America',
      );
    });

    const submit = screen.getByText('Add');
    userEvent.click(submit);

    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  it('enters nothing in the city input', async () => {
    console.log = jest.fn();

    render(<FlightHistory />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/');
    });

    const addFlight = screen.getByText('Add Flight');
    userEvent.click(addFlight);

    const city = screen.getByLabelText('Arrival City');
    fireEvent.blur(city);

    const region = screen.getByLabelText('State / Region');
    const country = screen.getByLabelText('Country');

    expect(city).toHaveDisplayValue('');
    expect(region).toHaveDisplayValue('');
    expect(country).toHaveDisplayValue('');
  });

  it('API calld fail', async () => {
    fetchMock.get('/api/flights/', 400, { overwriteRoutes: true });

    console.log = jest.fn();

    render(<FlightHistory />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/');
      expect(fetchMock).toHaveFetched('/api/flights/continent/');
    });

    expect(console.log).toHaveBeenCalledWith(Error('Failed'));

    const addFlight = screen.getByText('Add Flight');
    userEvent.click(addFlight);

    fetchMock.get('/api/flights/check/P', 500);

    const city = screen.getByLabelText('Arrival City');
    userEvent.type(city, 'P');
    fireEvent.blur(city);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/check/P');
    });

    expect(console.log).toHaveBeenCalledWith(Error('Failed'));
    expect(console.log).toHaveBeenCalledTimes(3);
  });

  it('API call returns empty string for all fields', async () => {
    console.log = jest.fn();

    fetchMock.get(
      '/api/flights/check/P',
      {
        exists: false,
        city: '',
        region: '',
        country: '',
      },
      { overwriteRoutes: true },
    );

    render(<FlightHistory />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/');
      expect(fetchMock).toHaveFetched('/api/flights/continent/');
    });

    const addFlight = screen.getByText('Add Flight');
    userEvent.click(addFlight);

    const city = screen.getByLabelText('Arrival City');
    userEvent.type(city, 'P');
    fireEvent.blur(city);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/check/P');
      expect(window.alert).toHaveBeenCalledWith(
        "Couldn't find location '" + 'P' + "'." + '\n' + 'Maybe: ' + '' + ', ' + '' + '. ' + '',
      );
    });
  });

  it('successfully sumits add flight form', async () => {
    console.log = jest.fn();

    fetchMock.get(
      '/api/flights/check/P',
      {
        exists: true,
        city: 'City',
        region: 'Region',
        country: 'Country',
      },
      { overwriteRoutes: true },
    );

    fetchMock.get('/api/flights/continent/Country', {
      found: false,
    });

    window.alert = jest.fn();

    render(<FlightHistory />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/');
      expect(fetchMock).toHaveFetched('/api/flights/continent/');
    });

    const addFlight = screen.getByText('Add Flight');
    userEvent.click(addFlight);

    const city = screen.getByLabelText('Arrival City');
    userEvent.type(city, 'P');

    const departureCity = screen.getByLabelText('Departure City');
    userEvent.type(departureCity, 'London');

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/check/P');
      expect(fetchMock).toHaveFetched('/api/flights/continent/Country');
    });

    expect(screen.getByDisplayValue('City')).toBeVisible();
    expect(screen.getByDisplayValue('Region')).toBeVisible();
    expect(screen.getByDisplayValue('Country')).toBeVisible();

    const submit = screen.getByText('Add');
    userEvent.click(submit);

    expect(window.alert).not.toHaveBeenCalled();
  });

  it('user checks enjoyedFlight on form after opening modal', () => {
    render(<FlightHistory />);
    const addFlight = screen.getByText('Add Flight');
    userEvent.click(addFlight);

    const checkBox = screen.getByText('Did you enjoy this trip?');
    userEvent.click(checkBox);
  });

  it('tries to submit empty form', async () => {
    console.log = jest.fn();
    window.alert = jest.fn();

    render(<FlightHistory />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/flights/');
      expect(fetchMock).toHaveFetched('/api/flights/continent/');
    });

    const addFlight = screen.getByText('Add Flight');
    userEvent.click(addFlight);

    const submit = screen.getByText('Add');
    userEvent.click(submit);

    expect(window.alert).toHaveBeenCalledWith("Can't find Location.");
  });
});
