// Componentes e funções de UI

// Gerenciamento de Loading
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('active');
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('active');
    }
}

// Sistema de Toast Notifications
function showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, duration);

    // Click to remove
    toast.addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    });
}

function getToastIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Gerenciamento de Modals
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus no primeiro input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Fechar modal clicando fora
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        hideModal(modalId);
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            hideModal(activeModal.id);
        }
    }
});

// Componente de Confirmação
function showConfirmDialog(message, onConfirm, onCancel = null) {
    const overlay = document.createElement('div');
    overlay.className = 'modal active';
    overlay.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3>Confirmação</h3>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="cancel-btn">Cancelar</button>
                <button type="button" class="btn btn-danger" id="confirm-btn">Confirmar</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const confirmBtn = overlay.querySelector('#confirm-btn');
    const cancelBtn = overlay.querySelector('#cancel-btn');

    confirmBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
        if (onConfirm) onConfirm();
    });

    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
        if (onCancel) onCancel();
    });

    // Fechar clicando fora
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            document.body.style.overflow = '';
            if (onCancel) onCancel();
        }
    });
}

// Componente de Tabela Vazia
function createEmptyState(message, icon = 'fas fa-inbox') {
    return `
        <div class="empty-state">
            <i class="${icon}"></i>
            <p>${message}</p>
        </div>
    `;
}

// Componente de Card de Cliente
function createClienteCard(cliente) {
    return `
        <tr>
            <td>${Utils.formatCPF(cliente.cpf)}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${Utils.formatPhone(cliente.telefone)}</td>
            <td>${Utils.formatDate(cliente.dataCadastro)}</td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick="editarCliente('${cliente.cpf}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirCliente('${cliente.cpf}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

// Componente de Card de Espaço
function createEspacoCard(espaco) {
    const statusClass = espaco.disponivel ? 'disponivel' : 'indisponivel';
    const statusText = espaco.disponivel ? 'Disponível' : 'Indisponível';
    const iconClass = Utils.getIconeEspaco(espaco.tipo);
    
    return `
        <div class="espaco-card ${statusClass}">
            <div class="espaco-header">
                <div class="espaco-tipo">
                    <i class="${iconClass}"></i>
                    ${Utils.getTipoEspaco(espaco.tipo)}
                </div>
                <div class="espaco-status ${statusClass}">
                    ${statusText}
                </div>
            </div>
            <div class="espaco-info">
                <h4>${espaco.nome}</h4>
                <div class="espaco-valor">
                    ${Utils.formatCurrency(espaco.valorHora)}/hora
                </div>
            </div>
            <div class="espaco-actions">
                <button class="btn btn-sm btn-secondary" onclick="editarEspaco('${espaco.id}')">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn btn-sm ${espaco.disponivel ? 'btn-danger' : 'btn-success'}" 
                        onclick="toggleDisponibilidadeEspaco('${espaco.id}', ${!espaco.disponivel})">
                    <i class="fas ${espaco.disponivel ? 'fa-times' : 'fa-check'}"></i>
                    ${espaco.disponivel ? 'Desativar' : 'Ativar'}
                </button>
            </div>
        </div>
    `;
}

// Componente de Card de Reserva
function createReservaCard(reserva) {
    const statusClass = reserva.status === 'ativa' ? 'ativa' : 'cancelada';
    
    return `
        <tr>
            <td>#${reserva.id}</td>
            <td>${reserva.cliente.nome}</td>
            <td>${reserva.espaco.nome}</td>
            <td>${Utils.formatDate(reserva.dataReserva)}</td>
            <td>${Utils.formatTime(reserva.horaInicio)} - ${Utils.formatTime(reserva.horaFim)}</td>
            <td>${Utils.formatCurrency(reserva.valorTotal)}</td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${Utils.capitalize(reserva.status)}
                </span>
            </td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick="verDetalhesReserva(${reserva.id})">
                    <i class="fas fa-eye"></i>
                </button>
                ${reserva.status === 'ativa' ? `
                    <button class="btn btn-sm btn-danger" onclick="cancelarReserva(${reserva.id})">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `;
}

// Componente de Gráfico de Barras Simples
function createBarChart(container, data, title = '') {
    const maxValue = Math.max(...Object.values(data));
    
    let html = '';
    if (title) {
        html += `<h4 style="margin-bottom: 1rem; text-align: center;">${title}</h4>`;
    }
    
    for (const [label, value] of Object.entries(data)) {
        const percentage = (value / maxValue) * 100;
        html += `
            <div class="chart-bar">
                <div style="flex: 1;">
                    <div style="font-weight: 500; margin-bottom: 0.25rem;">${label}</div>
                    <div style="background: #e2e8f0; height: 20px; border-radius: 10px; overflow: hidden;">
                        <div class="chart-bar-fill" style="width: ${percentage}%;"></div>
                    </div>
                </div>
                <div style="margin-left: 1rem; font-weight: bold; color: #667eea;">
                    ${typeof value === 'number' && value > 100 ? Utils.formatCurrency(value) : value}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Componente de Pesquisa com Debounce
function setupSearch(inputId, callback, delay = 300) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const debouncedCallback = Utils.debounce(callback, delay);
    
    input.addEventListener('input', (e) => {
        debouncedCallback(e.target.value);
    });
}

// Componente de Filtro
function setupFilter(selectId, callback) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.addEventListener('change', (e) => {
        callback(e.target.value);
    });
}

// Componente de Paginação (para futuro uso)
function createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';
    
    let html = '<div class="pagination">';
    
    // Botão anterior
    if (currentPage > 1) {
        html += `<button class="btn btn-sm btn-secondary" onclick="${onPageChange}(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }
    
    // Números das páginas
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'btn-primary' : 'btn-secondary';
        html += `<button class="btn btn-sm ${activeClass}" onclick="${onPageChange}(${i})">${i}</button>`;
    }
    
    // Botão próximo
    if (currentPage < totalPages) {
        html += `<button class="btn btn-sm btn-secondary" onclick="${onPageChange}(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    html += '</div>';
    return html;
}

// Componente de Status Badge
function createStatusBadge(status, text = null) {
    const displayText = text || Utils.capitalize(status);
    return `<span class="status-badge ${status}">${displayText}</span>`;
}

// Animação de entrada para elementos
function animateIn(element, animation = 'fadeIn') {
    element.style.animation = `${animation} 0.3s ease`;
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Exportar funções para uso global
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showToast = showToast;
window.showModal = showModal;
window.hideModal = hideModal;
window.showConfirmDialog = showConfirmDialog;
window.createEmptyState = createEmptyState;
window.createClienteCard = createClienteCard;
window.createEspacoCard = createEspacoCard;
window.createReservaCard = createReservaCard;
window.createBarChart = createBarChart;
window.setupSearch = setupSearch;
window.setupFilter = setupFilter;
window.createPagination = createPagination;
window.createStatusBadge = createStatusBadge;
window.animateIn = animateIn;
window.scrollToTop = scrollToTop;