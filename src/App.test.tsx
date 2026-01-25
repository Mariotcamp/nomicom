import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock hooks
vi.mock('./hooks', () => ({
  useProfiles: () => ({
    profiles: [],
    isLoading: false,
    error: null,
  }),
  useVote: () => ({
    voteStatus: {
      survivalRate: 75,
      totalVoted: 10,
      totalMembers: 16,
      myStatus: null,
      goCount: 3,
      maybeCount: 5,
      homeCount: 2,
      goMembers: [],
      maybeMembers: [],
    },
    isLoading: false,
    error: null,
    fetchVoteStatus: vi.fn(),
    submitVote: vi.fn(),
    clearError: vi.fn(),
  }),
  useUserIdentity: () => ({
    currentUserId: null,
    isRegistered: false,
    registerAsMe: vi.fn(),
    unregister: vi.fn(),
    isMe: vi.fn(() => false),
  }),
}))

describe('App', () => {
  it('renders header with app title', () => {
    render(<App />)
    expect(screen.getByText('Borderless Drinking')).toBeInTheDocument()
  })

  it('shows empty state when no profiles', () => {
    render(<App />)
    expect(screen.getByText('メンバー情報がありません')).toBeInTheDocument()
  })

  it('displays member count', () => {
    render(<App />)
    expect(screen.getByText('0 Members')).toBeInTheDocument()
  })
})
