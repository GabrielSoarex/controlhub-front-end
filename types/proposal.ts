export type ProposalStatus = 'active' | 'draft' | 'closed'

export interface Proposal {
  id: string
  title: string
  status: ProposalStatus
  description: string
  createdAt: string
}
