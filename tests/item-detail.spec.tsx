import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ItemDetail } from '../src/components/ItemDetail'

const item = {
  id: 'test-1',
  name: 'Test Item',
  imageUrl: 'https://placehold.co/600x400',
  images: ['https://placehold.co/600x400','https://placehold.co/600x400?text=2'],
  price: 12.5,
  condition: 'Good',
  timeOfUse: '1 year',
  deliveryTime: 'Pickup',
  status: 'Available',
  description: 'A test description',
}

describe('ItemDetail', () => {
  it('renders item details', () => {
    render(<ItemDetail item={item as any} onClose={() => {}} />)
    expect(screen.getByText('Test Item')).toBeDefined()
    expect(screen.getByText(/12.5|\$12.50/)).toBeDefined()
  })
})
