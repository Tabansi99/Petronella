import React from 'react';
import { render, screen, waitFor, fireEvent } from '../../testUtils/testTools';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock-jest';
import Create from '../../../src/pages/app/create';

describe('web /app/create', () => {
  it('informs user that username is already taken', async () => {
    render(<Create />);

    fetchMock.get('/api/validate/user/TestUser', { exists: true });
    const username = screen.getByLabelText('Username');
    userEvent.type(username, 'TestUser');
    fireEvent.blur(username);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/user/TestUser');
      expect(screen.queryByText('Username is taken')).toBeVisible();
    });
  });

  it('informs user that email is already taken', async () => {
    render(<Create />);

    fetchMock.get('/api/validate/email/testuser@test.com', { exists: true });
    const email = screen.getByLabelText('Email address');
    userEvent.type(email, 'testuser@test.com');
    fireEvent.blur(email);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/email/testuser@test.com');
      expect(screen.queryByText('Email associated with existing account')).toBeVisible();
    });
  });

  it('Notifies user that the password entered is not confirmed', async () => {
    render(<Create />);

    const passwordInput = screen.getByLabelText('Password');
    userEvent.type(passwordInput, '1234');
    fireEvent.blur(passwordInput);

    const matchPassword = screen.getByLabelText('Confirm Password');
    userEvent.type(matchPassword, '124');
    fireEvent.blur(matchPassword);

    expect(screen.queryByText('Password does not match')).toBeVisible();
  });

  it('Shows user an alert if they try to submit with an existing username in the form.', async () => {
    render(<Create />);

    fetchMock.get('/api/validate/user/Testing', { exists: true });
    const username = screen.getByLabelText('Username');
    userEvent.type(username, 'Testing');
    fireEvent.blur(username);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/user/Testing');
    });

    window.alert = jest.fn();

    const submit = screen.getByText('Create Account');
    userEvent.click(submit);

    await waitFor(() => {
      expect(screen.queryByText('Username is taken')).toBeVisible();
      expect(window.alert).toHaveBeenCalledWith('Please enter a new Username.');
    });
  });

  it('Shows user an alert if they try to submit with an existing email in the form.', async () => {
    render(<Create />);

    fetchMock.get('/api/validate/email/test@test.com', { exists: true });
    const email = screen.getByLabelText('Email address');
    userEvent.type(email, 'test@test.com');
    fireEvent.blur(email);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/email/test@test.com');
    });

    window.alert = jest.fn();

    const submit = screen.getByText('Create Account');
    userEvent.click(submit);

    await waitFor(() => {
      expect(screen.queryByText('Email associated with existing account')).toBeVisible();
      expect(window.alert).toHaveBeenCalledWith(
        'Email is already associated with an existing account.',
      );
    });
  });

  it('Shows user an alert if they try to submit with mistmatching password and confirm password in the form.', async () => {
    render(<Create />);

    const passwordInput = screen.getByLabelText('Password');
    userEvent.type(passwordInput, '1234');
    fireEvent.blur(passwordInput);

    const matchPassword = screen.getByLabelText('Confirm Password');
    userEvent.type(matchPassword, '124');
    fireEvent.blur(matchPassword);

    expect(screen.queryByText('Password does not match')).toBeVisible();

    window.alert = jest.fn();

    const submit = screen.getByText('Create Account');
    userEvent.click(submit);

    expect(window.alert).toHaveBeenCalledWith('Ensure Passwords match before submitting.');
  });

  it('Username API call fails', async () => {
    render(<Create />);

    fetchMock.get('/api/validate/user/Test', 400);
    const username = screen.getByLabelText('Username');
    userEvent.type(username, 'Test');
    fireEvent.blur(username);

    console.log = jest.fn();

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/user/Test');
      expect(console.log).toHaveBeenCalledWith(Error('Failed'));
    });
  });

  it('Email API call fails', async () => {
    render(<Create />);

    fetchMock.get('/api/validate/email/tuser@test.com', 400);
    const email = screen.getByLabelText('Email address');
    userEvent.type(email, 'tuser@test.com');
    fireEvent.blur(email);

    console.log = jest.fn();

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/email/tuser@test.com');
      expect(console.log).toHaveBeenCalledWith(Error('Failed'));
    });
  });

  it('Successfuly submits valid form', async () => {
    render(<Create />);

    const firstName = screen.getByLabelText('First Name');
    userEvent.type(firstName, 'Test');
    fireEvent.blur(firstName);

    const lastName = screen.getByLabelText('Last Name');
    userEvent.type(lastName, 'User');
    fireEvent.blur(lastName);

    fetchMock.get('/api/validate/email/valid@test.com', { exists: false });
    const email = screen.getByLabelText('Email address');
    userEvent.type(email, 'valid@test.com');
    fireEvent.blur(email);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/email/valid@test.com');
    });

    fetchMock.get('/api/validate/user/Valid', { exists: false });
    const username = screen.getByLabelText('Username');
    userEvent.type(username, 'Valid');
    fireEvent.blur(username);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/user/Valid');
    });

    const passwordInput = screen.getByLabelText('Password');
    userEvent.type(passwordInput, '1234');
    fireEvent.blur(passwordInput);

    const matchPassword = screen.getByLabelText('Confirm Password');
    userEvent.type(matchPassword, '1234');
    fireEvent.blur(matchPassword);

    window.alert = jest.fn();

    const submit = screen.getByText('Create Account');
    userEvent.click(submit);

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalledWith();
    });
  });

  it('Does not run email API call when an empty string is in email input', async () => {
    render(<Create />);

    fetchMock.get('/api/validate/email/', 400);
    const email = screen.getByLabelText('Email address');
    fireEvent.blur(email);

    await waitFor(() => {
      expect(fetchMock).not.toHaveFetched('/api/validate/email/');
    });
  });

  it('Does not run username API call when an empty string is in username input', async () => {
    render(<Create />);

    fetchMock.get('/api/validate/user/', 400);
    const username = screen.getByLabelText('Username');
    fireEvent.blur(username);

    await waitFor(() => {
      expect(fetchMock).not.toHaveFetched('/api/validate/user/');
    });
  });
});
