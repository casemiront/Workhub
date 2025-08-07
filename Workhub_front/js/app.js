// Aplicação Principal WorkHub
class WorkHubApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.data = {
            clientes: [],
            espacos: [],
            reservas: []
        };
        this.init();
    }

    async init() {
        this.setupNavigation();
        this.setupForms();
        this.setupSearch();
        this.setupFilters();
        await this.loadInitialData();
        this.showPage('dashboard');
    }

    // === NAVEGAÇÃO ===
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.showPage(page);
            });
        });
    }

    showPage(pageId) {
        // Atualizar navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Mostrar página
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageId}-page`).classList.add('active');

        this.currentPage = pageId;

        // Carregar dados da página
        this.loadPageData(pageId);
    }

    async loadPageData(pageId) {
        switch (pageId) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'clientes':
                await this.loadClientes();
                break;
            case 'espacos':
                await this.loadEspacos();
                break;
            case 'reservas':
                await this.loadReservas();
                break;
            case 'relatorios':
                await this.loadRelatorios();
                break;
        }
    }

    // === CARREGAMENTO INICIAL ===
    async loadInitialData() {
        try {
            const [clientes, espacos, reservas] = await Promise.all([
                api.getClientes(),
                api.getEspacos(),
                api.getReservas()
            ]);

            this.data.clientes = clientes;
            this.data.espacos = espacos;
            this.data.reservas = reservas;
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            showToast('Erro ao carregar dados do sistema', 'error');
        }
    }

    // === DASHBOARD ===
    async loadDashboard() {
        try {
            // Atualizar estatísticas
            document.getElementById('total-clientes').textContent = this.data.clientes.length;
            document.getElementById('total-espacos').textContent = this.data.espacos.filter(e => e.disponivel).length;
            document.getElementById('total-reservas').textContent = this.data.reservas.filter(r => r.status === 'ativa').length;
            
            const faturamentoTotal = this.data.reservas
                .filter(r => r.status === 'ativa')
                .reduce((total, r) => total + r.valorTotal, 0);
            document.getElementById('faturamento-total').textContent = Utils.formatCurrency(faturamentoTotal);

            // Carregar reservas recentes
            const reservasRecentes = this.data.reservas
                .sort((a, b) => new Date(b.dataReserva) - new Date(a.dataReserva))
                .slice(0, 5);

            const container = document.getElementById('reservas-recentes');
            if (reservasRecentes.length === 0) {
                container.innerHTML = createEmptyState('Nenhuma reserva encontrada');
            } else {
                container.innerHTML = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Espaço</th>
                                <th>Data</th>
                                <th>Valor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reservasRecentes.map(reserva => `
                                <tr>
                                    <td>${reserva.cliente.nome}</td>
                                    <td>${reserva.espaco.nome}</td>
                                    <td>${Utils.formatDate(reserva.dataReserva)}</td>
                                    <td>${Utils.formatCurrency(reserva.valorTotal)}</td>
                                    <td>${createStatusBadge(reserva.status)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        }
    }

    // === CLIENTES ===
    async loadClientes() {
        const tbody = document.getElementById('clientes-tbody');
        
        if (this.data.clientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">${createEmptyState('Nenhum cliente cadastrado')}</td></tr>`;
        } else {
            tbody.innerHTML = this.data.clientes.map(cliente => createClienteCard(cliente)).join('');
        }
    }

    async cadastrarCliente(formData) {
        try {
            const cliente = await api.createCliente(formData);
            this.data.clientes.push(cliente);
            await this.loadClientes();
            hideModal('cliente-modal');
            showToast('Cliente cadastrado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            showToast('Erro ao cadastrar cliente', 'error');
        }
    }

    // === ESPAÇOS ===
    async loadEspacos() {
        const container = document.getElementById('espacos-grid');
        
        if (this.data.espacos.length === 0) {
            container.innerHTML = createEmptyState('Nenhum espaço cadastrado');
        } else {
            container.innerHTML = this.data.espacos.map(espaco => createEspacoCard(espaco)).join('');
        }
    }

    async cadastrarEspaco(formData) {
        try {
            const espaco = await api.createEspaco(formData);
            this.data.espacos.push(espaco);
            await this.loadEspacos();
            hideModal('espaco-modal');
            showToast('Espaço cadastrado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao cadastrar espaço:', error);
            showToast('Erro ao cadastrar espaço', 'error');
        }
    }

    // === RESERVAS ===
    async loadReservas() {
        const tbody = document.getElementById('reservas-tbody');
        
        if (this.data.reservas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8">${createEmptyState('Nenhuma reserva encontrada')}</td></tr>`;
        } else {
            tbody.innerHTML = this.data.reservas.map(reserva => createReservaCard(reserva)).join('');
        }

        // Carregar opções para o formulário de reserva
        this.loadReservaFormOptions();
    }

    loadReservaFormOptions() {
        // Carregar clientes
        const clienteSelect = document.getElementById('reserva-cliente');
        clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>' +
            this.data.clientes.map(cliente => 
                `<option value="${cliente.cpf}">${cliente.nome}</option>`
            ).join('');

        // Carregar espaços disponíveis
        const espacoSelect = document.getElementById('reserva-espaco');
        const espacosDisponiveis = this.data.espacos.filter(e => e.disponivel);
        espacoSelect.innerHTML = '<option value="">Selecione um espaço</option>' +
            espacosDisponiveis.map(espaco => 
                `<option value="${espaco.id}">${espaco.nome} - ${Utils.formatCurrency(espaco.valorHora)}/h</option>`
            ).join('');
    }

    async realizarReserva(formData) {
        try {
            const reserva = await api.createReserva(formData);
            this.data.reservas.push(reserva);
            await this.loadReservas();
            hideModal('reserva-modal');
            showToast('Reserva realizada com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao realizar reserva:', error);
            showToast('Erro ao realizar reserva', 'error');
        }
    }

    // === RELATÓRIOS ===
    async loadRelatorios() {
        try {
            const [utilizacao, faturamentoPorEspaco, faturamentoPorServico] = await Promise.all([
                api.getRelatorioUtilizacaoEspacos(),
                api.getRelatorioFaturamentoPorEspaco(),
                api.getRelatorioFaturamentoPorServico()
            ]);

            // Gráfico de utilização
            const utilizacaoContainer = document.getElementById('utilizacao-chart').parentElement;
            createBarChart(utilizacaoContainer, utilizacao, 'Reservas por Espaço');

            // Gráfico de faturamento por espaço
            const faturamentoEspacosContainer = document.getElementById('faturamento-espacos');
            createBarChart(faturamentoEspacosContainer, faturamentoPorEspaco);

            // Gráfico de serviços adicionais
            const servicosContainer = document.getElementById('servicos-chart');
            createBarChart(servicosContainer, faturamentoPorServico);

        } catch (error) {
            console.error('Erro ao carregar relatórios:', error);
            showToast('Erro ao carregar relatórios', 'error');
        }
    }

    // === FORMULÁRIOS ===
    setupForms() {
        // Formulário de Cliente
        const clienteForm = document.getElementById('cliente-form');
        clienteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(clienteForm);
            const data = Object.fromEntries(formData);
            
            // Validações
            if (!Utils.validateCPF(Utils.removeMask(data.cpf))) {
                showToast('CPF inválido', 'error');
                return;
            }
            
            if (!Utils.validateEmail(data.email)) {
                showToast('Email inválido', 'error');
                return;
            }

            // Remover máscaras
            data.cpf = Utils.removeMask(data.cpf);
            data.telefone = Utils.removeMask(data.telefone);
            
            await this.cadastrarCliente(data);
        });

        // Formulário de Espaço
        const espacoForm = document.getElementById('espaco-form');
        espacoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(espacoForm);
            const data = Object.fromEntries(formData);
            data.valorHora = parseFloat(data.valorHora);
            
            await this.cadastrarEspaco(data);
        });

        // Formulário de Reserva
        const reservaForm = document.getElementById('reserva-form');
        reservaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(reservaForm);
            const data = Object.fromEntries(formData);
            
            // Validar horários
            if (data.horaInicio >= data.horaFim) {
                showToast('Hora de início deve ser anterior à hora de fim', 'error');
                return;
            }
            
            await this.realizarReserva(data);
        });

        // Cálculo automático do valor da reserva
        this.setupReservaCalculation();
    }

    setupReservaCalculation() {
        const espacoSelect = document.getElementById('reserva-espaco');
        const horaInicio = document.getElementById('reserva-inicio');
        const horaFim = document.getElementById('reserva-fim');
        const valorTotal = document.getElementById('valor-total-reserva');
        const servicosCheckboxes = document.querySelectorAll('input[name="servicos"]');

        const calcularValor = () => {
            const espacoId = espacoSelect.value;
            const inicio = horaInicio.value;
            const fim = horaFim.value;

            if (!espacoId || !inicio || !fim) {
                valorTotal.textContent = 'R$ 0,00';
                return;
            }

            const espaco = this.data.espacos.find(e => e.id === espacoId);
            if (!espaco) return;

            const horas = Utils.calculateHours(inicio, fim);
            let total = espaco.valorHora * horas;

            // Adicionar serviços
            servicosCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const tipo = checkbox.value;
                    let quantidade = 1;
                    let duracao = 1;

                    if (tipo === 'LOCKER') {
                        const qtdInput = document.getElementById('locker-quantidade');
                        quantidade = parseInt(qtdInput.value) || 1;
                    } else if (tipo === 'ESTACIONAMENTO') {
                        const horasInput = document.getElementById('estacionamento-horas');
                        duracao = parseInt(horasInput.value) || 1;
                    }

                    total += Utils.calcularValorServico(tipo, quantidade, duracao);
                }
            });

            valorTotal.textContent = Utils.formatCurrency(total);
        };

        espacoSelect.addEventListener('change', calcularValor);
        horaInicio.addEventListener('change', calcularValor);
        horaFim.addEventListener('change', calcularValor);
        servicosCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', calcularValor);
        });

        // Inputs de quantidade/duração dos serviços
        document.getElementById('locker-quantidade').addEventListener('input', calcularValor);
        document.getElementById('estacionamento-horas').addEventListener('input', calcularValor);
    }

    // === PESQUISA E FILTROS ===
    setupSearch() {
        // Pesquisa de clientes
        setupSearch('search-clientes', (term) => {
            this.filterClientes(term);
        });
    }

    setupFilters() {
        // Filtro de tipo de espaço
        setupFilter('filter-tipo-espaco', (tipo) => {
            this.filterEspacos(tipo);
        });

        // Filtros de reserva
        setupFilter('filter-data-reserva', (data) => {
            this.filterReservas({ data });
        });

        setupFilter('filter-status-reserva', (status) => {
            this.filterReservas({ status });
        });
    }

    filterClientes(searchTerm) {
        const filteredClientes = this.data.clientes.filter(cliente => 
            cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.cpf.includes(searchTerm) ||
            cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const tbody = document.getElementById('clientes-tbody');
        if (filteredClientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">${createEmptyState('Nenhum cliente encontrado')}</td></tr>`;
        } else {
            tbody.innerHTML = filteredClientes.map(cliente => createClienteCard(cliente)).join('');
        }
    }

    filterEspacos(tipo) {
        const filteredEspacos = tipo ? 
            this.data.espacos.filter(espaco => espaco.tipo === tipo) : 
            this.data.espacos;

        const container = document.getElementById('espacos-grid');
        if (filteredEspacos.length === 0) {
            container.innerHTML = createEmptyState('Nenhum espaço encontrado');
        } else {
            container.innerHTML = filteredEspacos.map(espaco => createEspacoCard(espaco)).join('');
        }
    }

    filterReservas(filters) {
        let filteredReservas = [...this.data.reservas];

        if (filters.data) {
            filteredReservas = filteredReservas.filter(reserva => 
                reserva.dataReserva === filters.data
            );
        }

        if (filters.status) {
            filteredReservas = filteredReservas.filter(reserva => 
                reserva.status === filters.status
            );
        }

        const tbody = document.getElementById('reservas-tbody');
        if (filteredReservas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8">${createEmptyState('Nenhuma reserva encontrada')}</td></tr>`;
        } else {
            tbody.innerHTML = filteredReservas.map(reserva => createReservaCard(reserva)).join('');
        }
    }
}

// === FUNÇÕES GLOBAIS PARA AÇÕES ===

// Clientes
async function editarCliente(cpf) {
    showToast('Funcionalidade de edição em desenvolvimento', 'info');
}

async function excluirCliente(cpf) {
    showConfirmDialog(
        'Tem certeza que deseja excluir este cliente?',
        async () => {
            try {
                await api.deleteCliente(cpf);
                app.data.clientes = app.data.clientes.filter(c => c.cpf !== cpf);
                await app.loadClientes();
                showToast('Cliente excluído com sucesso!', 'success');
            } catch (error) {
                showToast('Erro ao excluir cliente', 'error');
            }
        }
    );
}

// Espaços
async function editarEspaco(id) {
    showToast('Funcionalidade de edição em desenvolvimento', 'info');
}

async function toggleDisponibilidadeEspaco(id, disponivel) {
    try {
        const espaco = app.data.espacos.find(e => e.id === id);
        if (espaco) {
            espaco.disponivel = disponivel;
            await app.loadEspacos();
            const status = disponivel ? 'ativado' : 'desativado';
            showToast(`Espaço ${status} com sucesso!`, 'success');
        }
    } catch (error) {
        showToast('Erro ao alterar status do espaço', 'error');
    }
}

// Reservas
async function verDetalhesReserva(id) {
    const reserva = app.data.reservas.find(r => r.id === id);
    if (!reserva) return;

    const servicosHtml = reserva.servicosAdicionais.length > 0 ? 
        reserva.servicosAdicionais.map(s => `
            <li>${s.descricao} - ${Utils.formatCurrency(s.valorTotal)}</li>
        `).join('') : '<li>Nenhum serviço adicional</li>';

    showConfirmDialog(`
        <div style="text-align: left;">
            <h4>Detalhes da Reserva #${reserva.id}</h4>
            <p><strong>Cliente:</strong> ${reserva.cliente.nome}</p>
            <p><strong>Espaço:</strong> ${reserva.espaco.nome}</p>
            <p><strong>Data:</strong> ${Utils.formatDate(reserva.dataReserva)}</p>
            <p><strong>Horário:</strong> ${Utils.formatTime(reserva.horaInicio)} - ${Utils.formatTime(reserva.horaFim)}</p>
            <p><strong>Status:</strong> ${Utils.capitalize(reserva.status)}</p>
            <p><strong>Serviços Adicionais:</strong></p>
            <ul>${servicosHtml}</ul>
            <p><strong>Valor Total:</strong> ${Utils.formatCurrency(reserva.valorTotal)}</p>
        </div>
    `, null, null);
}

async function cancelarReserva(id) {
    showConfirmDialog(
        'Tem certeza que deseja cancelar esta reserva?',
        async () => {
            try {
                await api.deleteReserva(id);
                const reserva = app.data.reservas.find(r => r.id === id);
                if (reserva) {
                    reserva.status = 'cancelada';
                }
                await app.loadReservas();
                showToast('Reserva cancelada com sucesso!', 'success');
            } catch (error) {
                showToast('Erro ao cancelar reserva', 'error');
            }
        }
    );
}

// Inicializar aplicação
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WorkHubApp();
});

// Exportar para uso global
window.app = app;
window.editarCliente = editarCliente;
window.excluirCliente = excluirCliente;
window.editarEspaco = editarEspaco;
window.toggleDisponibilidadeEspaco = toggleDisponibilidadeEspaco;
window.verDetalhesReserva = verDetalhesReserva;
window.cancelarReserva = cancelarReserva;