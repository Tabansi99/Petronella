import React from 'react';
import fetchMock from 'fetch-mock-jest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, fireEvent } from '../../../testUtils/testTools';
import { getMock } from '../../../testUtils/getMock';
import Password from '../../../../src/pages/app/user/password';
import { ApplicationLayout } from '../../../../src/components/utils/applicationLayout';

jest.mock('../../../../src/components/utils/applicationLayout.tsx');
getMock(ApplicationLayout).mockImplementation(({ children }) => <>{children}</>);

describe('web /app/user/password', () => {
  it('Notifies user that the password entered does not match their current password', async () => {
    render(<Password />);

    fetchMock.get('/api/validate/password/test', { matches: false });
    const currentPasswordInput = screen.getByLabelText('Current Password');
    userEvent.type(currentPasswordInput, 'test');
    fireEvent.blur(currentPasswordInput);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/password/test');
      expect(screen.queryByText('Does not Match Current Password')).toBeVisible();
    });
  });

  it('Notifies user that the new password entered is not confirmed', async () => {
    render(<Password />);

    const passwordInput = screen.getByLabelText('New Password');
    userEvent.type(passwordInput, '1234');
    fireEvent.blur(passwordInput);

    const matchPassword = screen.getByLabelText('Confirm Password');
    userEvent.type(matchPassword, '123');
    fireEvent.blur(matchPassword);

    expect(screen.queryByText('Password does not match')).toBeVisible();
  });

  it('Api call fails', async () => {
    render(<Password />);

    fetchMock.get('/api/validate/password/1234', 500);
    const currentPasswordInput = screen.getByLabelText('Current Password');
    userEvent.type(currentPasswordInput, '1234');
    fireEvent.blur(currentPasswordInput);

    console.log = jest.fn();
    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/password/1234');
      expect(console.log).toHaveBeenCalledWith(Error('Failed'));
    });
  });

  it('Successfull Submit Password Change', async () => {
    render(<Password />);

    fetchMock.get('/api/validate/password/123', { matches: true });
    const currentPasswordInput = screen.getByLabelText('Current Password');
    userEvent.type(currentPasswordInput, '123');
    fireEvent.blur(currentPasswordInput);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/password/123');
    });

    const passwordInput = screen.getByLabelText('New Password');
    userEvent.type(passwordInput, '1234');
    fireEvent.blur(passwordInput);

    const matchPassword = screen.getByLabelText('Confirm Password');
    userEvent.type(matchPassword, '1234');
    fireEvent.blur(matchPassword);

    window.alert = jest.fn();

    const submit = screen.getByText('Change Password');
    userEvent.click(submit);

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
    });
  });

  it('Notifies user that the new password and confirmed password does not match if they try to submit', async () => {
    render(<Password />);

    const passwordInput = screen.getByLabelText('New Password');
    userEvent.type(passwordInput, '124');
    fireEvent.blur(passwordInput);

    const matchPassword = screen.getByLabelText('Confirm Password');
    userEvent.type(matchPassword, '1234');
    fireEvent.blur(matchPassword);

    window.alert = jest.fn();

    const submit = screen.getByText('Change Password');
    userEvent.click(submit);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Ensure Passwords match before submitting.');
    });
  });

  it('Notifies user that the current password inputed does not match password on server', async () => {
    render(<Password />);

    fetchMock.get('/api/validate/password/12345', { matches: false });
    const currentPasswordInput = screen.getByLabelText('Current Password');
    userEvent.type(currentPasswordInput, '12345');
    fireEvent.blur(currentPasswordInput);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/validate/password/12345');
    });

    const passwordInput = screen.getByLabelText('New Password');
    userEvent.type(passwordInput, '1234');
    fireEvent.blur(passwordInput);

    const matchPassword = screen.getByLabelText('Confirm Password');
    userEvent.type(matchPassword, '1234');
    fireEvent.blur(matchPassword);

    window.alert = jest.fn();

    const submit = screen.getByText('Change Password');
    userEvent.click(submit);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Current Password is Incorrect.');
    });
  });

  it('Does not run API call when an empty string is in confirm password box', async () => {
    render(<Password />);

    const currentPasswordInput = screen.getByLabelText('Current Password');
    fireEvent.blur(currentPasswordInput);

    await waitFor(() => {
      expect(fetchMock).not.toHaveFetched('/api/validate/password/');
    });
  });
});
