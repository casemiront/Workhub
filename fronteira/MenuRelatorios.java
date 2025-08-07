package fronteira;

import controle.AdministradorSistema;
import entidades.Reserva;
import excecoes.ClienteNaoEncontradoException;

import java.util.Map;
import java.util.Scanner;

public class MenuRelatorios {
    private AdministradorSistema administradorSistema;
    private Scanner scanner;

    public MenuRelatorios(AdministradorSistema administradorSistema, Scanner scanner) {
        this.administradorSistema = administradorSistema;
        this.scanner = scanner;
    }

    public void exibirMenu() {
        int opcao;
        do {
            System.out.println("\n--- Gerar Relatórios ---");
            System.out.println("1. Relatório de Reservas por Cliente");
            System.out.println("2. Relatório de Utilização de Espaços");
            System.out.println("3. Relatório de Faturamento Total");
            System.out.println("4. Relatório de Faturamento por Espaço");
            System.out.println("5. Relatório de Faturamento por Serviço Adicional");
            System.out.println("0. Voltar ao Menu Principal");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            scanner.nextLine(); // Consumir a nova linha

            switch (opcao) {
                case 1:
                    gerarRelatorioReservasPorCliente();
                    break;
                case 2:
                    gerarRelatorioUtilizacaoEspacos();
                    break;
                case 3:
                    gerarRelatorioFaturamentoTotal();
                    break;
                case 4:
                    gerarRelatorioFaturamentoPorEspaco();
                    break;
                case 5:
                    gerarRelatorioFaturamentoPorServico();
                    break;
                case 0:
                    System.out.println("Voltando ao Menu Principal...");
                    break;
                default:
                    System.out.println("Opção inválida. Tente novamente.");
            }
        } while (opcao != 0);
    }

    private void gerarRelatorioReservasPorCliente() {
        System.out.println("\n--- Relatório de Reservas por Cliente ---");
        System.out.print("CPF do Cliente: ");
        String cpf = scanner.nextLine();
        try {
            administradorSistema.gerarRelatorioReservasPorCliente(cpf).forEach(System.out::println);
        } catch (ClienteNaoEncontradoException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }

    private void gerarRelatorioUtilizacaoEspacos() {
        System.out.println("\n--- Relatório de Utilização de Espaços ---");
        Map<String, Long> utilizacao = administradorSistema.gerarRelatorioUtilizacaoEspacos();
        if (utilizacao.isEmpty()) {
            System.out.println("Nenhuma utilização de espaço registrada.");
        } else {
            utilizacao.forEach((espaco, count) -> System.out.println("Espaço: " + espaco + ", Reservas: " + count));
        }
    }

    private void gerarRelatorioFaturamentoTotal() {
        System.out.println("\n--- Relatório de Faturamento Total ---");
        double faturamento = administradorSistema.gerarRelatorioFaturamentoTotal();
        System.out.println("Faturamento Total: R$" + String.format("%.2f", faturamento));
    }

    private void gerarRelatorioFaturamentoPorEspaco() {
        System.out.println("\n--- Relatório de Faturamento por Espaço ---");
        Map<String, Double> faturamentoPorEspaco = administradorSistema.gerarRelatorioFaturamentoPorEspaco();
        if (faturamentoPorEspaco.isEmpty()) {
            System.out.println("Nenhum faturamento por espaço registrado.");
        } else {
            faturamentoPorEspaco.forEach((espaco, valor) -> System.out.println("Espaço: " + espaco + ", Faturamento: R$" + String.format("%.2f", valor)));
        }
    }

    private void gerarRelatorioFaturamentoPorServico() {
        System.out.println("\n--- Relatório de Faturamento por Serviço Adicional ---");
        Map<String, Double> faturamentoPorServico = administradorSistema.gerarRelatorioFaturamentoPorServico();
        if (faturamentoPorServico.isEmpty()) {
            System.out.println("Nenhum faturamento por serviço adicional registrado.");
        } else {
            faturamentoPorServico.forEach((servico, valor) -> System.out.println("Serviço: " + servico + ", Faturamento: R$" + String.format("%.2f", valor)));
        }
    }
}

