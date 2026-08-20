export interface Ticket {
  id: number
  title: string
  description: string
  status: string
  client: string
  team: string
  assignedTo?: string
}

export const tickets: Ticket[] = [
  {
    id: 1,
    title: 'Problème de connexion',
    description: 'Le client ne peut plus se connecter à son compte.',
    status: 'OPEN',
    client: 'client1',
    team: 'team-support',
    assignedTo: 'agent1'
  },
  {
    id: 2,
    title: 'Problème réseau',
    description: 'Le client rencontre des problèmes de connexion réseau.',
    status: 'IN_PROGRESS',
    client: 'client2',
    team: 'team-network',
    assignedTo: 'agent2'
  },
  {
    id: 3,
    title: 'Compte bloqué',
    description: 'Le compte du client a été bloqué après plusieurs tentatives.',
    status: 'CLOSED',
    client: 'client1',
    team: 'team-network'
  },
  {
    id: 4,
    title: 'Problème VPN',
    description: 'Problème d\'ouverture de flux VPN pour le client.',
    status: 'IN_PROGRESS',
    client: 'client2',
    team: 'team-support',
    assignedTo: 'agent1'
  }
]