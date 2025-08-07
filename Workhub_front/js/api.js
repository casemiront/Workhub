// Configuração da API
class API {
    constructor() {
        this.baseURL = 'http://127.0.0.1:5500/index.html'; // Ajuste conforme seu backend
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Método genérico para requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            showLoading();
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            showToast('Erro na comunicação com o servidor', 'error');
            throw error;
        } finally {
            hideLoading();
        }
    }

    // Métodos GET
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // Métodos POST
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Métodos PUT
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Métodos DELETE
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // === CLIENTES ===
    async getClientes() {
        return this.get('/clientes');
    }

    async getCliente(cpf) {
        return this.get(`/clientes/${cpf}`);
    }

    async createCliente(cliente) {
        return this.post('/clientes', cliente);
    }

    async updateCliente(cpf, cliente) {
        return this.put(`/clientes/${cpf}`, cliente);
    }

    async deleteCliente(cpf) {
        return this.delete(`/clientes/${cpf}`);
    }

    // === ESPAÇOS ===
    async getEspacos() {
        return this.get('/espacos');
    }

    async getEspaco(id) {
        return this.get(`/espacos/${id}`);
    }

    async createEspaco(espaco) {
        return this.post('/espacos', espaco);
    }

    async updateEspaco(id, espaco) {
        return this.put(`/espacos/${id}`, espaco);
    }

    async deleteEspaco(id) {
        return this.delete(`/espacos/${id}`);
    }

    // === RESERVAS ===
    async getReservas() {
        return this.get('/reservas');
    }

    async getReserva(id) {
        return this.get(`/reservas/${id}`);
    }

    async createReserva(reserva) {
        return this.post('/reservas', reserva);
    }

    async updateReserva(id, reserva) {
        return this.put(`/reservas/${id}`, reserva);
    }

    async deleteReserva(id) {
        return this.delete(`/reservas/${id}`);
    }

    async addServicoToReserva(idReserva, servico) {
        return this.post(`/reservas/${idReserva}/servicos`, servico);
    }

    async removeServicoFromReserva(idReserva, servicoId) {
        return this.delete(`/reservas/${idReserva}/servicos/${servicoId}`);
    }

    // === RELATÓRIOS ===
    async getRelatorioReservasPorCliente(cpf) {
        return this.get(`/relatorios/cliente/${cpf}`);
    }

    async getRelatorioUtilizacaoEspacos() {
        return this.get('/relatorios/utilizacao');
    }

    async getRelatorioFaturamentoTotal() {
        return this.get('/relatorios/faturamento/total');
    }

    async getRelatorioFaturamentoPorEspaco() {
        return this.get('/relatorios/faturamento/espaco');
    }

    async getRelatorioFaturamentoPorServico() {
        return this.get('/relatorios/faturamento/servico');
    }
}

// Simulação de dados para desenvolvimento (remover quando conectar com backend real)
class MockAPI extends API {
    constructor() {
        super();
        this.initMockData();
    }

    initMockData() {
        // Dados simulados para desenvolvimento
        this.mockData = {
            clientes: [
                {
                    cpf: '12345678901',
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '(11) 99999-9999',
                    dataCadastro: '2024-01-15'
                },
                {
                    cpf: '98765432100',
                    nome: 'Maria Santos',
                    email: 'maria@email.com',
                    telefone: '(11) 88888-8888',
                    dataCadastro: '2024-01-20'
                }
            ],
            espacos: [
                {
                    id: 'EST001',
                    nome: 'Estação Premium 1',
                    tipo: 'ESTACAO_TRABALHO',
                    valorHora: 25.00,
                    disponivel: true
                },
                {
                    id: 'SAL001',
                    nome: 'Sala Executiva',
                    tipo: 'SALA_PRIVADA',
                    valorHora: 80.00,
                    disponivel: true
                },
                {
                    id: 'REU001',
                    nome: 'Sala de Reunião Alpha',
                    tipo: 'SALA_REUNIAO',
                    valorHora: 120.00,
                    disponivel: false
                },
                {
                    id: 'AUD001',
                    nome: 'Auditório Principal',
                    tipo: 'AUDITORIO',
                    valorHora: 300.00,
                    disponivel: true
                }
            ],
            reservas: [
                {
                    id: 1,
                    cliente: {
                        cpf: '12345678901',
                        nome: 'João Silva'
                    },
                    espaco: {
                        id: 'EST001',
                        nome: 'Estação Premium 1',
                        tipo: 'ESTACAO_TRABALHO'
                    },
                    dataReserva: '2024-01-25',
                    horaInicio: '09:00',
                    horaFim: '17:00',
                    valorTotal: 200.00,
                    servicosAdicionais: [
                        {
                            tipo: 'CAFE_PREMIUM',
                            descricao: 'Café Premium',
                            valorTotal: 5.00
                        }
                    ],
                    status: 'ativa'
                }
            ]
        };
    }

    async request(endpoint, options = {}) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const method = options.method || 'GET';
        const parts = endpoint.split('/').filter(p => p);
        
        try {
            showLoading();
            
            switch (method) {
                case 'GET':
                    return this.handleGet(parts);
                case 'POST':
                    return this.handlePost(parts, JSON.parse(options.body || '{}'));
                case 'PUT':
                    return this.handlePut(parts, JSON.parse(options.body || '{}'));
                case 'DELETE':
                    return this.handleDelete(parts);
                default:
                    throw new Error(`Method ${method} not supported`);
            }
        } catch (error) {
            console.error('Mock API Error:', error);
            showToast('Erro na simulação da API', 'error');
            throw error;
        } finally {
            hideLoading();
        }
    }

    handleGet(parts) {
        const [resource, id] = parts;
        
        switch (resource) {
            case 'clientes':
                return id ? this.mockData.clientes.find(c => c.cpf === id) : this.mockData.clientes;
            case 'espacos':
                return id ? this.mockData.espacos.find(e => e.id === id) : this.mockData.espacos;
            case 'reservas':
                return id ? this.mockData.reservas.find(r => r.id === parseInt(id)) : this.mockData.reservas;
            case 'relatorios':
                return this.handleRelatorios(parts.slice(1));
            default:
                throw new Error(`Resource ${resource} not found`);
        }
    }

    handlePost(parts, data) {
        const [resource] = parts;
        
        switch (resource) {
            case 'clientes':
                this.mockData.clientes.push({
                    ...data,
                    dataCadastro: new Date().toISOString().split('T')[0]
                });
                return data;
            case 'espacos':
                this.mockData.espacos.push({
                    ...data,
                    disponivel: true
                });
                return data;
            case 'reservas':
                const novaReserva = {
                    ...data,
                    id: this.mockData.reservas.length + 1,
                    cliente: this.mockData.clientes.find(c => c.cpf === data.cpfCliente),
                    espaco: this.mockData.espacos.find(e => e.id === data.idEspaco),
                    servicosAdicionais: [],
                    status: 'ativa'
                };
                this.mockData.reservas.push(novaReserva);
                return novaReserva;
            default:
                throw new Error(`Resource ${resource} not found`);
        }
    }

    handlePut(parts, data) {
        const [resource, id] = parts;
        
        switch (resource) {
            case 'clientes':
                const clienteIndex = this.mockData.clientes.findIndex(c => c.cpf === id);
                if (clienteIndex !== -1) {
                    this.mockData.clientes[clienteIndex] = { ...this.mockData.clientes[clienteIndex], ...data };
                    return this.mockData.clientes[clienteIndex];
                }
                break;
            case 'espacos':
                const espacoIndex = this.mockData.espacos.findIndex(e => e.id === id);
                if (espacoIndex !== -1) {
                    this.mockData.espacos[espacoIndex] = { ...this.mockData.espacos[espacoIndex], ...data };
                    return this.mockData.espacos[espacoIndex];
                }
                break;
            case 'reservas':
                const reservaIndex = this.mockData.reservas.findIndex(r => r.id === parseInt(id));
                if (reservaIndex !== -1) {
                    this.mockData.reservas[reservaIndex] = { ...this.mockData.reservas[reservaIndex], ...data };
                    return this.mockData.reservas[reservaIndex];
                }
                break;
        }
        throw new Error(`${resource} with id ${id} not found`);
    }

    handleDelete(parts) {
        const [resource, id] = parts;
        
        switch (resource) {
            case 'clientes':
                const clienteIndex = this.mockData.clientes.findIndex(c => c.cpf === id);
                if (clienteIndex !== -1) {
                    this.mockData.clientes.splice(clienteIndex, 1);
                    return { success: true };
                }
                break;
            case 'espacos':
                const espacoIndex = this.mockData.espacos.findIndex(e => e.id === id);
                if (espacoIndex !== -1) {
                    this.mockData.espacos.splice(espacoIndex, 1);
                    return { success: true };
                }
                break;
            case 'reservas':
                const reservaIndex = this.mockData.reservas.findIndex(r => r.id === parseInt(id));
                if (reservaIndex !== -1) {
                    this.mockData.reservas[reservaIndex].status = 'cancelada';
                    return { success: true };
                }
                break;
        }
        throw new Error(`${resource} with id ${id} not found`);
    }

    handleRelatorios(parts) {
        const [tipo, subtipo] = parts;
        
        switch (tipo) {
            case 'utilizacao':
                return {
                    'Estação Premium 1': 15,
                    'Sala Executiva': 8,
                    'Sala de Reunião Alpha': 12,
                    'Auditório Principal': 3
                };
            case 'faturamento':
                if (subtipo === 'total') {
                    return { total: 15750.00 };
                } else if (subtipo === 'espaco') {
                    return {
                        'Estação Premium 1': 3750.00,
                        'Sala Executiva': 6400.00,
                        'Sala de Reunião Alpha': 4800.00,
                        'Auditório Principal': 800.00
                    };
                } else if (subtipo === 'servico') {
                    return {
                        'Café Premium': 125.00,
                        'Locker': 200.00,
                        'Estacionamento': 300.00,
                        'Recebimento de Correspondência': 75.00
                    };
                }
                break;
            case 'cliente':
                const cpf = subtipo;
                return this.mockData.reservas.filter(r => r.cliente.cpf === cpf);
        }
        
        return {};
    }
}

// Instanciar API (usar MockAPI para desenvolvimento)
const api = new MockAPI(); // Trocar por new API() quando conectar com backend real

// Exportar para uso global
window.api = api;