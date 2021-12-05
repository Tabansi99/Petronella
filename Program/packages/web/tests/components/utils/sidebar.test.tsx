import React from 'react';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { Sidebar } from '../../../src/components/utils/sidebar';

describe('Sidebar', () => {
  it('Renders Sidebar', async () => {
    render(<Sidebar onClose={() => {}} />);

    expect(screen.getByText('American Visualization')).toBeVisible();
    expect(screen.getByText('Dashboard')).toBeVisible();
    expect(screen.getByText('Recommendations')).toBeVisible();
    expect(screen.getByText('Flight History')).toBeVisible();
    expect(screen.getByText('Settings')).toBeVisible();
  });
});
