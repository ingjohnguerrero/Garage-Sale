import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import ItemDetail from '../../src/components/ItemDetail';
import { expect, describe, it } from 'vitest';

const sampleItem = {
  id: 'test-1',
  name: 'Accessibility Test Item',
  imageUrl: 'https://placehold.co/600x400?text=Test',
  images: ['https://placehold.co/600x400?text=Test1', 'https://placehold.co/600x400?text=Test2'],
  price: 25,
  condition: 'Good',
  timeOfUse: '2023-01-01',
  deliveryTime: 'Pickup',
  status: 'Available',
  description: 'A test item for accessibility checks.'
};

describe('ItemDetail accessibility', () => {
  it('should have no detectable a11y violations', async () => {
    const { container } = render(<ItemDetail item={sampleItem as any} onClose={() => {}} />);
  const results = await axe(container);
  // jest-axe provides a `violations` array on results — assert it's empty
  expect(results.violations).toHaveLength(0);
  });
});
