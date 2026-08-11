export const CLIENTS = [
  { id: '00000040', code: '00000040', name: 'Maria Fernanda', cpf: '123.456.789-00', birth: '11/02/1998', country: 'Brasil', email: 'maria@email.com', phone: '(44) 99999-0000', cep: '87000-000', address: 'Rua das Flores, 100', neighborhood: 'Centro', city: 'Maringá', complement: 'Apto 12', image: null },
  { id: '00000041', code: '00000041', name: 'Ricardo Alves',  cpf: '987.654.321-00', birth: '05/07/1985', country: 'Brasil', email: 'ricardo@email.com', phone: '(44) 98888-0000', cep: '87010-010', address: 'Av. Brasil, 500', neighborhood: 'Zona 07', city: 'Maringá', complement: '', image: null },
]

export function getClientByCode(code) {
  return CLIENTS.find(c => c.code === code) || null
}
