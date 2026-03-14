import { useRuntimeConfig } from 'nuxt/app'
import type { Proposal } from '~/types/proposal'

export interface ListProposalsParams {
  status?: string
  q?: string
}

export async function fetchProposals (params: ListProposalsParams = {}): Promise<Proposal[]> {
  const config = useRuntimeConfig()
  const base = (config.public.apiBase as string) || ''
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set('status', params.status)
  if (params.q) searchParams.set('q', params.q)
  const query = searchParams.toString()
  const url = `${base}/api/proposals${query ? `?${query}` : ''}`
  const res = await $fetch<Proposal[]>(url)
  return res
}

export async function fetchProposalById (id: string): Promise<Proposal | null> {
  const config = useRuntimeConfig()
  const base = (config.public.apiBase as string) || ''
  try {
    const res = await $fetch<Proposal>(`${base}/api/proposals/${id}`)
    return res
  } catch (e: any) {
    if (e?.response?.status === 404) return null
    throw e
  }
}
