package fronteira;

import controle.AdministradorSistema;
import entidades.*;
import excecoes.ClienteNaoEncontradoException;
import excecoes.EspacoIndisponivelException;
import excecoes.ReservaNaoEncontradaException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.InputMismatchException;
import java.util.Scanner;

public class MenuReservas {
    private AdministradorSistema administradorSistema;
    private Scanner scanner;

    public MenuReservas(AdministradorSistema administradorSistema, Scanner scanner) {
        this.administradorSistema = administradorSistema;
        this.scanner = scanner;
    }

    public void exibirMenu() {
        int opcao;
        do {
            System.out.println("\n--- Gerenciar Reservas ---");
            System.out.println("1. Realizar Reserva");
            System.out.println("2. Cancelar Reserva");
            System.out.println("3. Adicionar Serviço a Reserva");
            System.out.println("4. Listar Todas as Reservas");
            System.out.println("0. Voltar ao Menu Principal");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            scanner.nextLine(); // Consumir a nova linha

            switch (opcao) {
                case 1:
                    realizarReserva();
                    break;
                case 2:
                    cancelarReserva();
                    break;
                case 3:
                    adicionarServicoAReserva();
                    break;
                case 4:
                    listarReservas();
                    break;
                case 0:
                    System.out.println("Voltando ao Menu Principal...");
                    break;
                default:
                    System.out.println("Opção inválida. Tente novamente.");
            }
        } while (opcao != 0);
    }

    private void realizarReserva() {
        System.out.println("\n--- Realizar Nova Reserva ---");
        System.out.print("CPF do Cliente: ");
        String cpfCliente = scanner.nextLine();
        System.out.print("ID do Espaço: ");
        String idEspaco = scanner.nextLine();
        System.out.print("Data da Reserva (AAAA-MM-DD): ");
        String dataStr = scanner.nextLine();
        System.out.print("Hora de Início (HH:MM): ");
        String horaInicioStr = scanner.nextLine();
        System.out.print("Hora de Fim (HH:MM): ");
        String horaFimStr = scanner.nextLine();

        try {
            LocalDate dataReserva = LocalDate.parse(dataStr);
            LocalTime horaInicio = LocalTime.parse(horaInicioStr);
            LocalTime horaFim = LocalTime.parse(horaFimStr);

            Reserva reserva = administradorSistema.realizarReserva(cpfCliente, idEspaco, dataReserva, horaInicio, horaFim);
            System.out.println("Reserva realizada com sucesso! ID da Reserva: " + reserva.getId());
            System.out.println("Valor Total: R$" + String.format("%.2f", reserva.getValorTotal()));
        } catch (ClienteNaoEncontradoException | EspacoIndisponivelException e) {
            System.out.println("Erro ao realizar reserva: " + e.getMessage());
        } catch (DateTimeParseException e) {
            System.out.println("Erro de formato de data/hora. Use AAAA-MM-DD para data e HH:MM para hora.");
        } catch (InputMismatchException e) {
            System.out.println("Entrada inválida. Por favor, insira um valor numérico para o ID da reserva.");
            scanner.nextLine(); // Limpar o buffer do scanner
        }
    }

    private void cancelarReserva() {
        System.out.println("\n--- Cancelar Reserva ---");
        System.out.print("ID da Reserva a cancelar: ");
        int idReserva = scanner.nextInt();
        scanner.nextLine(); // Consumir a nova linha

        try {
            administradorSistema.cancelarReserva(idReserva);
            System.out.println("Reserva cancelada com sucesso!");
        } catch (ReservaNaoEncontradaException e) {
            System.out.println("Erro ao cancelar reserva: " + e.getMessage());
        } catch (InputMismatchException e) {
            System.out.println("Entrada inválida. Por favor, insira um valor numérico para o ID da reserva.");
            scanner.nextLine(); // Limpar o buffer do scanner
        }
    }

    private void adicionarServicoAReserva() {
        System.out.println("\n--- Adicionar Serviço a Reserva ---");
        System.out.print("ID da Reserva: ");
        int idReserva = scanner.nextInt();
        scanner.nextLine(); // Consumir a nova linha

        System.out.println("Escolha o tipo de serviço:");
        System.out.println("1. Café Premium");
        System.out.println("2. Locker");
        System.out.println("3. Estacionamento");
        System.out.println("4. Recebimento de Correspondência");
        System.out.print("Opção: ");
        int tipoServico = scanner.nextInt();
        scanner.nextLine(); // Consumir a nova linha

        ServicoAdicional servico = null;
        try {
            switch (tipoServico) {
                case 1:
                    servico = new CafePremium();
                    break;
                case 2:
                    System.out.print("Quantidade de Lockers: ");
                    int qtdLocker = scanner.nextInt();
                    scanner.nextLine();
                    servico = new Locker(qtdLocker);
                    break;
                case 3:
                    System.out.print("Duração em Horas (Estacionamento): ");
                    int duracaoEstacionamento = scanner.nextInt();
                    scanner.nextLine();
                    servico = new Estacionamento(duracaoEstacionamento);
                    break;
                case 4:
                    servico = new RecebimentoCorrespondencia();
                    break;
                default:
                    System.out.println("Tipo de serviço inválido.");
                    return;
            }
            administradorSistema.adicionarServicoAReserva(idReserva, servico);
            System.out.println("Serviço adicionado com sucesso à reserva!");
        } catch (ReservaNaoEncontradaException e) {
            System.out.println("Erro: " + e.getMessage());
        } catch (InputMismatchException e) {
            System.out.println("Entrada inválida. Por favor, insira um valor numérico.");
            scanner.nextLine(); // Limpar o buffer do scanner
        }
    }

    private void listarReservas() {
        System.out.println("\n--- Lista de Todas as Reservas ---");
        if (administradorSistema.listarReservas().isEmpty()) {
            System.out.println("Nenhuma reserva cadastrada.");
        } else {
            administradorSistema.listarReservas().forEach(System.out::println);
        }
    }
}