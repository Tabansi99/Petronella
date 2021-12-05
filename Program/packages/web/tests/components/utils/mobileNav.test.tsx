import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { MobileNav } from '../../../src/components/utils/mobileNav';

describe('MobileNav', () => {
  it('Renders MobileNav and does not display Home and Settings', async () => {
    render(
      <MobileNav
        onOpen={() => {}}
        firstN={'Test'}
        lastN={'User'}
        userName={'TUser'}
        email={'testuser@test.com'}
      />,
    );

    expect(screen.getByText('Home')).not.toBeVisible();
    expect(screen.getByText('Settings')).not.toBeVisible();
    expect(screen.getByText('Sign out')).not.toBeVisible();
  });

  it('Mocks user sign out', async () => {
    render(
      <MobileNav
        onOpen={() => {}}
        firstN={'Test'}
        lastN={'User'}
        userName={'TUser'}
        email={'testuser@test.com'}
      />,
    );

    fetchMock.mock('/api/users/', { method: 'DELETE' });

    screen.getByText('Sign out').click();

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });
  });

  it('Mocks failed user sign out', async () => {
    render(
      <MobileNav
        onOpen={() => {}}
        firstN={'Test'}
        lastN={'User'}
        userName={'TUser'}
        email={'testuser@test.com'}
      />,
    );

    fetchMock.mock('/api/users/', 500, { overwriteRoutes: true });
    console.log = jest.fn();

    screen.getByText('Sign out').click();

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/');
    });

    expect(console.log).toHaveBeenCalledWith(Error('Failed'));
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});
