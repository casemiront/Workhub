// Utilitários gerais
class Utils {
    // Formatação de CPF
    static formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Formatação de telefone
    static formatPhone(phone) {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    // Formatação de moeda
    static formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Formatação de data
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    // Formatação de data e hora
    static formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR');
    }

    // Formatação de hora
    static formatTime(timeString) {
        return timeString.substring(0, 5);
    }

    // Validação de CPF
    static validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    // Validação de email
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Debounce para pesquisas
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Gerar ID único
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Calcular duração em horas
    static calculateHours(startTime, endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return (end - start) / (1000 * 60 * 60);
    }

    // Obter tipo de espaço em português
    static getTipoEspaco(tipo) {
        const tipos = {
            'ESTACAO_TRABALHO': 'Estação de Trabalho',
            'SALA_PRIVADA': 'Sala Privada',
            'SALA_REUNIAO': 'Sala de Reunião',
            'AUDITORIO': 'Auditório'
        };
        return tipos[tipo] || tipo;
    }

    // Obter ícone do tipo de espaço
    static getIconeEspaco(tipo) {
        const icones = {
            'ESTACAO_TRABALHO': 'fas fa-desktop',
            'SALA_PRIVADA': 'fas fa-door-closed',
            'SALA_REUNIAO': 'fas fa-users',
            'AUDITORIO': 'fas fa-theater-masks'
        };
        return icones[tipo] || 'fas fa-building';
    }

    // Obter descrição do serviço adicional
    static getDescricaoServico(tipo) {
        const servicos = {
            'CAFE_PREMIUM': 'Café Premium',
            'LOCKER': 'Locker',
            'ESTACIONAMENTO': 'Estacionamento',
            'RECEBIMENTO_CORRESPONDENCIA': 'Recebimento de Correspondência'
        };
        return servicos[tipo] || tipo;
    }

    // Calcular valor do serviço adicional
    static calcularValorServico(tipo, quantidade = 1, duracao = 1) {
        const valores = {
            'CAFE_PREMIUM': 5.0,
            'LOCKER': 10.0,
            'ESTACIONAMENTO': 7.5,
            'RECEBIMENTO_CORRESPONDENCIA': 15.0
        };

        const valorBase = valores[tipo] || 0;
        
        if (tipo === 'LOCKER') {
            return valorBase * quantidade;
        } else if (tipo === 'ESTACIONAMENTO') {
            return valorBase * duracao;
        }
        
        return valorBase;
    }

    // Sanitizar entrada de texto
    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Copiar para clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    }

    // Scroll suave para elemento
    static scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Verificar se é dispositivo móvel
    static isMobile() {
        return window.innerWidth <= 768;
    }

    // Formatar número de telefone enquanto digita
    static maskPhone(value) {
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        return value;
    }

    // Formatar CPF enquanto digita
    static maskCPF(value) {
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return value;
    }

    // Remover máscara
    static removeMask(value) {
        return value.replace(/\D/g, '');
    }

    // Capitalizar primeira letra
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Truncar texto
    static truncate(str, length = 50) {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    }

    // Gerar cor aleatória
    static randomColor() {
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c',
            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
            '#fa709a', '#fee140', '#a8edea', '#fed6e3'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Converter string para slug
    static slugify(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
}

// Máscaras de input
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para CPF
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[name="cpf"], #cliente-cpf')) {
            e.target.value = Utils.maskCPF(e.target.value);
        }
        
        if (e.target.matches('input[name="telefone"], #cliente-telefone')) {
            e.target.value = Utils.maskPhone(e.target.value);
        }
    });
});

// Exportar para uso global
window.Utils = Utils;