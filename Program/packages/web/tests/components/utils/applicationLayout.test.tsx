import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { ApplicationLayout } from '../../../src/components/utils/applicationLayout';
import { act } from '@testing-library/react';

describe('ApplicationLayout', () => {
  it('renders children and displays populates field on navigation bar', async () => {
    const text = 'Hello World';
    fetchMock.get('/api/users/', {
      authenticated: true,
      user: {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        userName: 'TUser',
        email: 'test@test.com',
      },
    });

    render(
      <ApplicationLayout>
        <div>{text}</div>
      </ApplicationLayout>,
    );

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });

    expect(screen.queryByText('TUser')).toBeEnabled();
    expect(screen.getByText(text)).toBeVisible();
  });

  jest.useFakeTimers();
  jest.spyOn(global, 'setInterval');

  it('Simulate logout after 3500000 ms and ensures that setInterval function was called', async () => {
    const text = 'Hello World';

    render(
      <ApplicationLayout>
        <div>{text}</div>
      </ApplicationLayout>,
    );

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });

    fetchMock.get('/api/users/', { authenticated: false }, { overwriteRoutes: true });

    act(() => {
      jest.advanceTimersByTime(3500000);
    });

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });

    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 3500000);
  });

  it('Api call fails', async () => {
    const text = 'Hello World';
    fetchMock.get('/api/users/', 500, { overwriteRoutes: true });

    console.log = jest.fn();

    render(
      <ApplicationLayout>
        <div>{text}</div>
      </ApplicationLayout>,
    );

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });

    expect(console.log).toHaveBeenCalledWith(Error('Failed'));
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('Does not populate variables if user is unauthenticated', async () => {
    const text = 'Hello World';
    fetchMock.get('/api/users/', { authenticated: false }, { overwriteRoutes: true });

    render(
      <ApplicationLayout>
        <div>{text}</div>
      </ApplicationLayout>,
    );

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });
  });
});
