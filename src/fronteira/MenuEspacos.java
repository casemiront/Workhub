package fronteira;

import controle.AdministradorSistema;
import entidades.*;

import java.util.Scanner;

public class MenuEspacos {
    private AdministradorSistema administradorSistema;
    private Scanner scanner;

    public MenuEspacos(AdministradorSistema administradorSistema, Scanner scanner) {
        this.administradorSistema = administradorSistema;
        this.scanner = scanner;
    }

    public void exibirMenu() {
        int opcao;
        do {
            System.out.println("\n--- Gerenciar Espaços ---");
            System.out.println("1. Cadastrar Estação de Trabalho");
            System.out.println("2. Cadastrar Sala Privada");
            System.out.println("3. Cadastrar Sala de Reunião");
            System.out.println("4. Cadastrar Auditório");
            System.out.println("5. Listar Todos os Espaços");
            System.out.println("0. Voltar ao Menu Principal");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            scanner.nextLine(); // Consumir a nova linha

            switch (opcao) {
                case 1:
                    cadastrarEstacaoTrabalho();
                    break;
                case 2:
                    cadastrarSalaPrivada();
                    break;
                case 3:
                    cadastrarSalaReuniao();
                    break;
                case 4:
                    cadastrarAuditorio();
                    break;
                case 5:
                    listarEspacos();
                    break;
                case 0:
                    System.out.println("Voltando ao Menu Principal...");
                    break;
                default:
                    System.out.println("Opção inválida. Tente novamente.");
            }
        } while (opcao != 0);
    }

    private void cadastrarEstacaoTrabalho() {
        System.out.println("\n--- Cadastrar Estação de Trabalho ---");
        System.out.print("ID do Espaço: ");
        String id = scanner.nextLine();
        System.out.print("Nome/Descrição: ");
        String nome = scanner.nextLine();
        System.out.print("Valor por Hora: ");
        double valorHora = scanner.nextDouble();
        scanner.nextLine();
        administradorSistema.adicionarEspaco(new EstacaoTrabalho(id, nome, valorHora));
        System.out.println("Estação de Trabalho cadastrada com sucesso!");
    }

    private void cadastrarSalaPrivada() {
        System.out.println("\n--- Cadastrar Sala Privada ---");
        System.out.print("ID do Espaço: ");
        String id = scanner.nextLine();
        System.out.print("Nome/Descrição: ");
        String nome = scanner.nextLine();
        System.out.print("Valor por Hora: ");
        double valorHora = scanner.nextDouble();
        scanner.nextLine();
        administradorSistema.adicionarEspaco(new SalaPrivada(id, nome, valorHora));
        System.out.println("Sala Privada cadastrada com sucesso!");
    }

    private void cadastrarSalaReuniao() {
        System.out.println("\n--- Cadastrar Sala de Reunião ---");
        System.out.print("ID do Espaço: ");
        String id = scanner.nextLine();
        System.out.print("Nome/Descrição: ");
        String nome = scanner.nextLine();
        System.out.print("Valor por Hora: ");
        double valorHora = scanner.nextDouble();
        scanner.nextLine();
        administradorSistema.adicionarEspaco(new SalaReuniao(id, nome, valorHora));
        System.out.println("Sala de Reunião cadastrada com sucesso!");
    }

    private void cadastrarAuditorio() {
        System.out.println("\n--- Cadastrar Auditório ---");
        System.out.print("ID do Espaço: ");
        String id = scanner.nextLine();
        System.out.print("Nome/Descrição: ");
        String nome = scanner.nextLine();
        System.out.print("Valor por Hora: ");
        double valorHora = scanner.nextDouble();
        scanner.nextLine();
        administradorSistema.adicionarEspaco(new Auditorio(id, nome, valorHora));
        System.out.println("Auditório cadastrado com sucesso!");
    }

    private void listarEspacos() {
        System.out.println("\n--- Lista de Espaços ---");
        if (administradorSistema.listarEspacos().isEmpty()) {
            System.out.println("Nenhum espaço cadastrado.");
        } else {
            administradorSistema.listarEspacos().forEach(espaco -> System.out.println(espaco.getDescricaoCompleta() + " - Disponível: " + espaco.isDisponivel()));
        }
    }
}
