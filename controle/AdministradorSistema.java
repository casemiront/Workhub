package controle;

import entidades.*;
import excecoes.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AdministradorSistema {
    private RepositorioClientes repositorioClientes;
    private RepositorioEspacos repositorioEspacos;
    private RepositorioReservas repositorioReservas;
    private int proximoIdReserva = 1;

    public AdministradorSistema() {
        this.repositorioClientes = new RepositorioClientes();
        this.repositorioEspacos = new RepositorioEspacos();
        this.repositorioReservas = new RepositorioReservas();
        // Inicializa o próximo ID de reserva com base nas reservas existentes
        if (!repositorioReservas.getReservas().isEmpty()) {
            this.proximoIdReserva = repositorioReservas.getReservas().keySet().stream().max(Integer::compare).get() + 1;
        }
    }

    // Métodos para Clientes
    public void cadastrarCliente(String cpf, String nome, String email, String telefone) throws ClienteJaCadastradoException {
        if (repositorioClientes.buscarCliente(cpf) != null) {
            throw new ClienteJaCadastradoException("Cliente com CPF " + cpf + " já cadastrado.");
        }
        Cliente novoCliente = new Cliente(cpf, nome, email, telefone);
        repositorioClientes.adicionarCliente(novoCliente);
    }

    public Cliente buscarCliente(String cpf) throws ClienteNaoEncontradoException {
        Cliente cliente = repositorioClientes.buscarCliente(cpf);
        if (cliente == null) {
            throw new ClienteNaoEncontradoException("Cliente com CPF " + cpf + " não encontrado.");
        }
        return cliente;
    }

    public List<Cliente> listarClientes() {
        return repositorioClientes.getClientes().values().stream().collect(Collectors.toList());
    }

    // Métodos para Espaços
    public void adicionarEspaco(Espaco espaco) {
        repositorioEspacos.adicionarEspaco(espaco);
    }

    public Espaco buscarEspaco(String id) {
        return repositorioEspacos.buscarEspaco(id);
    }

    public List<Espaco> listarEspacos() {
        return repositorioEspacos.getEspacos().values().stream().collect(Collectors.toList());
    }

    // Métodos para Reservas
    public Reserva realizarReserva(String cpfCliente, String idEspaco, LocalDate data, LocalTime horaInicio, LocalTime horaFim) throws ClienteNaoEncontradoException, EspacoIndisponivelException {
        Cliente cliente = buscarCliente(cpfCliente);
        Espaco espaco = repositorioEspacos.buscarEspaco(idEspaco);

        if (espaco == null) {
            throw new EspacoIndisponivelException("Espaço com ID " + idEspaco + " não encontrado.");
        }

        // Regra de Negócio 2: Reservas não podem se sobrepor
        for (Reserva r : repositorioReservas.getReservas().values()) {
            if (r.getEspaco().getId().equals(idEspaco) && r.getDataReserva().equals(data)) {
                // Verifica sobreposição de horários
                if (!(horaFim.isBefore(r.getHoraInicio()) || horaInicio.isAfter(r.getHoraFim()))) {
                    throw new EspacoIndisponivelException("Espaço " + espaco.getNome() + " já reservado para o período.");
                }
            }
        }

        Reserva novaReserva = new Reserva(proximoIdReserva++, cliente, espaco, data, horaInicio, horaFim);
        repositorioReservas.adicionarReserva(novaReserva);
        return novaReserva;
    }

    public void cancelarReserva(int idReserva) throws ReservaNaoEncontradaException {
        Reserva reserva = repositorioReservas.buscarReserva(idReserva);
        if (reserva == null) {
            throw new ReservaNaoEncontradaException("Reserva com ID " + idReserva + " não encontrada.");
        }
        repositorioReservas.removerReserva(idReserva);
    }

    public Reserva buscarReserva(int idReserva) throws ReservaNaoEncontradaException {
        Reserva reserva = repositorioReservas.buscarReserva(idReserva);
        if (reserva == null) {
            throw new ReservaNaoEncontradaException("Reserva com ID " + idReserva + " não encontrada.");
        }
        return reserva;
    }

    public void adicionarServicoAReserva(int idReserva, ServicoAdicional servico) throws ReservaNaoEncontradaException {
        Reserva reserva = buscarReserva(idReserva);
        reserva.adicionarServico(servico);
        repositorioReservas.adicionarReserva(reserva); // Salva a reserva atualizada
    }

    public List<Reserva> listarReservas() {
        return repositorioReservas.getReservas().values().stream().collect(Collectors.toList());
    }

    // Métodos de Relatórios
    public List<Reserva> gerarRelatorioReservasPorCliente(String cpfCliente) throws ClienteNaoEncontradoException {
        Cliente cliente = buscarCliente(cpfCliente);
        return repositorioReservas.getReservas().values().stream()
                .filter(r -> r.getCliente().getCpf().equals(cpfCliente))
                .collect(Collectors.toList());
    }

    public Map<String, Long> gerarRelatorioUtilizacaoEspacos() {
        return repositorioReservas.getReservas().values().stream()
                .collect(Collectors.groupingBy(r -> r.getEspaco().getNome(), Collectors.counting()));
    }

    public double gerarRelatorioFaturamentoTotal() {
        return repositorioReservas.getReservas().values().stream()
                .mapToDouble(Reserva::getValorTotal)
                .sum();
    }

    public Map<String, Double> gerarRelatorioFaturamentoPorEspaco() {
        return repositorioReservas.getReservas().values().stream()
                .collect(Collectors.groupingBy(r -> r.getEspaco().getNome(), Collectors.summingDouble(Reserva::getValorTotal)));
    }

    public Map<String, Double> gerarRelatorioFaturamentoPorServico() {
        return repositorioReservas.getReservas().values().stream()
                .flatMap(reserva -> reserva.getServicosAdicionais().stream())
                .collect(Collectors.groupingBy(ServicoAdicional::getDescricao, Collectors.summingDouble(ServicoAdicional::getValorTotal)));
    }

    // Métodos de persistência (chamados pelos repositórios, mas podem ser expostos se necessário)
    public void salvarDados() {
        // Os repositórios já salvam automaticamente ao adicionar/remover/atualizar
        // Este método pode ser usado para um salvamento manual se necessário
    }

    public void carregarDados() {
        // Os repositórios já carregam automaticamente na inicialização
        // Este método pode ser usado para um carregamento manual se necessário
    }
}


