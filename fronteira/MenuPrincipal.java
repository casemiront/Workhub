package fronteira;

import controle.AdministradorSistema;
import java.util.Scanner;

public class MenuPrincipal {
    private AdministradorSistema administradorSistema;
    private Scanner scanner;

    public MenuPrincipal(AdministradorSistema administradorSistema, Scanner scanner) {
        this.administradorSistema = administradorSistema;
        this.scanner = scanner;
    }

    public void exibirMenu() {
        int opcao;
        do {
            System.out.println("\n--- Menu Principal WorkHub ---");
            System.out.println("1. Gerenciar Clientes");
            System.out.println("2. Gerenciar Espaços");
            System.out.println("3. Gerenciar Reservas");
            System.out.println("4. Gerar Relatórios");
            System.out.println("0. Sair");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            scanner.nextLine(); // Consumir a nova linha

            switch (opcao) {
                case 1:
                    new MenuClientes(administradorSistema, scanner).exibirMenu();
                    break;
                case 2:
                    new MenuEspacos(administradorSistema, scanner).exibirMenu();
                    break;
                case 3:
                    new MenuReservas(administradorSistema, scanner).exibirMenu();
                    break;
                case 4:
                    new MenuRelatorios(administradorSistema, scanner).exibirMenu();
                    break;
                case 0:
                    System.out.println("Saindo do sistema. Até logo!");
                    break;
                default:
                    System.out.println("Opção inválida. Tente novamente.");
            }
        } while (opcao != 0);
    }
}
