import React from 'react';
import { render, screen, waitFor, fireEvent } from '../../../testUtils/testTools';
import fetchMock from 'fetch-mock-jest';
import { getMock } from '../../../testUtils/getMock';
import Settings from '../../../../src/pages/app/user/settings';
import { ApplicationLayout } from '../../../../src/components/utils/applicationLayout';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../src/components/utils/applicationLayout.tsx');
getMock(ApplicationLayout).mockImplementation(({ children }) => <>{children}</>);

describe('web /app/user/profile', () => {
  it('Renders page and prefills input values with users value', async () => {
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

    render(<Settings />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });

    const firstName = screen.getByLabelText('First Name');
    const lastName = screen.getByLabelText('Last Name');
    const username = screen.getByLabelText('Username');
    const email = screen.getByLabelText('Email address');

    expect(firstName).toHaveValue('Test');
    expect(lastName).toHaveValue('User');
    expect(username).toHaveValue('TUser');
    expect(email).toHaveValue('test@test.com');
  });

  it('Makes sure user is alerted if the inputed username or email is already taken', async () => {
    render(<Settings />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });

    expect(screen.getByLabelText('First Name')).toHaveValue('Test');
    expect(screen.getByLabelText('Last Name')).toHaveValue('User');
    expect(screen.getByLabelText('Username')).toHaveValue('TUser');
    expect(screen.getByLabelText('Email address')).toHaveValue('test@test.com');

    fetchMock.get('/api/validate/user/TestUser', { exists: true });
    const username = screen.getByLabelText('Username');
    userEvent.clear(username);
    userEvent.type(username, 'TestUser');
    fireEvent.blur(username);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/user/TestUser');
      expect(screen.queryByText('Username is taken')).toBeVisible();
    });

    fetchMock.get('/api/validate/email/testuser@test.com', { exists: true });
    const email = screen.getByLabelText('Email address');
    userEvent.clear(email);
    userEvent.type(email, 'testuser@test.com');
    fireEvent.blur(email);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/email/testuser@test.com');
      expect(screen.queryByText('Email associated with existing account')).toBeVisible();
    });

    expect(username).toHaveValue('TestUser');
    expect(email).toHaveValue('testuser@test.com');
  });

  it('handles when the api call fails', async () => {
    fetchMock.get('/api/users/', 500, { overwriteRoutes: true });
    console.log = jest.fn();

    render(<Settings />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });

    fetchMock.get('/api/validate/user/Test', 500);
    const username = screen.getByLabelText('Username');
    userEvent.clear(username);
    userEvent.type(username, 'Test');

    fetchMock.get('/api/validate/email/test@test.com', 500);
    const email = screen.getByLabelText('Email address');
    userEvent.clear(email);
    userEvent.type(email, 'test@test.com');
    fireEvent.blur(email);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/user/Test');
      expect(fetchMock).toHaveFetched('/api/validate/email/test@test.com');
    });

    expect(console.log).toHaveBeenCalledTimes(3);
  });

  it('throws an alert if email entered is already taken', async () => {
    fetchMock.get(
      '/api/users/',
      {
        authenticated: true,
        user: {
          id: '1',
          firstName: 'Test',
          lastName: 'User',
          userName: 'TUser',
          email: 'test@test.com',
        },
      },
      { overwriteRoutes: true },
    );

    render(<Settings />);

    fetchMock.get('/api/validate/email/t@test.com', { exists: true });
    const email = screen.getByLabelText('Email address');
    userEvent.clear(email);
    userEvent.type(email, 't@test.com');
    fireEvent.blur(email);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/email/t@test.com');
    });

    window.alert = jest.fn();

    const submit = screen.getByText('Submit Changes');
    userEvent.click(submit);

    await waitFor(() => {
      expect(screen.queryByText('Email associated with existing account')).toBeVisible();
      expect(window.alert).toHaveBeenCalledWith(
        'Email is already associated with an existing account.',
      );
    });
  });

  it('throws an alert if username entered is already taken', async () => {
    render(<Settings />);

    fetchMock.get('/api/validate/user/Testing', { exists: true });
    const username = screen.getByLabelText('Username');
    userEvent.clear(username);
    userEvent.type(username, 'Testing');
    fireEvent.blur(username);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/email/t@test.com');
    });

    window.alert = jest.fn();

    const submit = screen.getByText('Submit Changes');
    userEvent.click(submit);

    await waitFor(() => {
      expect(screen.queryByText('Username is taken')).toBeVisible();
      expect(window.alert).toHaveBeenCalledWith('Please enter a new Username.');
    });
  });

  it('Does not run email API call when an empty string is in email input', async () => {
    render(<Settings />);

    fetchMock.get('/api/validate/email/', 500);
    const email = screen.getByLabelText('Email address');
    fireEvent.blur(email);

    await waitFor(() => {
      expect(fetchMock).not.toHaveFetched('/api/validate/email/');
    });
  });

  it('Does not run username API call when an empty string is in username input', async () => {
    render(<Settings />);

    fetchMock.get('/api/validate/user/', 500);
    const username = screen.getByLabelText('Username');
    userEvent.clear(username);
    fireEvent.blur(username);

    await waitFor(() => {
      expect(fetchMock).not.toHaveFetched('/api/validate/user/');
    });
  });

  it('It successfully submits form', async () => {
    render(<Settings />);

    window.alert = jest.fn();

    const submit = screen.getByText('Submit Changes');
    userEvent.click(submit);

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
    });
  });
});
