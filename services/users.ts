import type { User, FakeDataResponse } from '~/interfaces';
import { filterService, type FilterParams } from './filters';
import fakeData from '~/api/data.json';

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  totalPages: number
  currentPage: number
  perPage: number
}

// Simula delay de rede
const simulateNetworkDelay = (ms: number = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Dados locais simulando uma base de dados
let localUsers: User[] = [...(fakeData as FakeDataResponse).users];

export const usersService = {
  async getUsers(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<User>> {
    await simulateNetworkDelay();
    
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = localUsers.slice(startIndex, endIndex);
    
    return {
      data: paginatedUsers,
      totalCount: localUsers.length,
      totalPages: Math.ceil(localUsers.length / perPage),
      currentPage: page,
      perPage
    }
  },

  async searchUsers(filters: FilterParams, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<User>> {
    await simulateNetworkDelay();
    
    const nomeFilter = filters.nome?.toLowerCase() || '';
    const sobrenomeFilter = filters.sobrenome?.toLowerCase() || '';
    const emailFilter = filters.email?.toLowerCase() || '';
    
    const filteredUsers = localUsers.filter(user => {
      const nome = user.nome?.toLowerCase() || '';
      const sobrenome = user.sobrenome?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      
      const nomeMatch = !nomeFilter || nome.includes(nomeFilter);
      const sobrenomeMatch = !sobrenomeFilter || sobrenome.includes(sobrenomeFilter);
      const emailMatch = !emailFilter || email.includes(emailFilter);
      
      return nomeMatch && sobrenomeMatch && emailMatch;
    });
    
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      data: paginatedUsers,
      totalCount: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / perPage),
      currentPage: page,
      perPage
    }
  },

  async searchUsersLocal(filters: FilterParams, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<User>> {
    return this.searchUsers(filters, page, perPage);
  },

  async createUser(userData: Omit<User, 'id' | 'data_abertura' | 'endereco' | 'data_nascimento' | 'endereco_carteira'>): Promise<User> {
    await simulateNetworkDelay();
    
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      data_abertura: new Date().toISOString().split('T')[0] || '',
      endereco: userData.endereco || '',
      data_nascimento: userData.data_nascimento || '',
      endereco_carteira: userData.endereco_carteira || '',
      moeda_origem: userData.moeda_origem || 'BRL',
      moeda_destino: userData.moeda_destino || 'BTC'
    };

    // Adiciona o novo usuário ao array local
    localUsers.push(newUser);

    return newUser;
  },

  async updateUser(userData: User): Promise<User> {
    await simulateNetworkDelay();
    
    const userIndex = localUsers.findIndex(user => user.id === userData.id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Atualiza o usuário no array local
    localUsers[userIndex] = userData;

    return userData;
  },

  async deleteUser(userId: string): Promise<void> {
    await simulateNetworkDelay();
    
    const userIndex = localUsers.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Remove o usuário do array local
    localUsers.splice(userIndex, 1);
  },

  exportToCSV(users: User[]): void {
    if (users.length === 0) {
      alert('Não há dados para exportar')
      return
    }

    const headers = ['Nome', 'Sobrenome', 'Email', 'Endereço', 'Data de Nascimento', 'Data de Abertura', 'Valor da Carteira', 'Endereço da Carteira']
    
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        `"${user.nome}"`,
        `"${user.sobrenome}"`,
        `"${user.email}"`,
        `"${user.endereco}"`,
        `"${user.data_nascimento}"`,
        `"${user.data_abertura}"`,
        user.valor_carteira,
        `"${user.endereco_carteira}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  // Método para resetar os dados para o estado inicial (útil para demonstração)
  resetToInitialData(): void {
    localUsers = [...(fakeData as FakeDataResponse).users];
  }
}