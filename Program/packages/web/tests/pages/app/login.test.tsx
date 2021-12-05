import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import Login from '../../../src/pages/app/login';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';
import userEvent from '@testing-library/user-event';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

describe('web /app/login', () => {
  it('renders', async () => {
    render(<Login />);

    const signIn = screen.getByText('Sign In');
    userEvent.click(signIn);
  });
});
