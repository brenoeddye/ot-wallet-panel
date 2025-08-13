export type { default as User } from './users'
export type { UsersState } from './store'
export type { TableHeader, TableData, ButtonProps, TooltipProps, ModalProps, WalletFormData, Currency, CurrencyConversion } from './components'
export type { ApiRequestOptions } from './services'
export type { FilterParams, FilterState } from '~/services/filters'

export interface User {
    id: string
    nome: string
    sobrenome: string
    email: string
    endereco: string
    data_nascimento: string
    data_abertura: string
    valor_carteira: number
    endereco_carteira: string
    moeda_origem?: string
    moeda_destino?: string
}

export interface FakeDataResponse {
    users: User[]
}
