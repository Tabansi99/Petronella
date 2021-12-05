import React from 'react';
import { render } from '../../testUtils/testTools';
import AppHome from '../../../src/pages/app';

describe('web /app/index', () => {
  it('renders', async () => {
    render(<AppHome />);
  });
});
