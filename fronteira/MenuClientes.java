package fronteira;

import controle.AdministradorSistema;
import entidades.Cliente;
import excecoes.ClienteJaCadastradoException;
import excecoes.ClienteNaoEncontradoException;

import java.util.Scanner;

public class MenuClientes {
    private AdministradorSistema administradorSistema;
    private Scanner scanner;

    public MenuClientes(AdministradorSistema administradorSistema, Scanner scanner) {
        this.administradorSistema = administradorSistema;
        this.scanner = scanner;
    }

    public void exibirMenu() {
        int opcao;
        do {
            System.out.println("\n--- Gerenciar Clientes ---");
            System.out.println("1. Cadastrar Cliente");
            System.out.println("2. Buscar Cliente");
            System.out.println("3. Listar Todos os Clientes");
            System.out.println("0. Voltar ao Menu Principal");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            scanner.nextLine(); // Consumir a nova linha

            switch (opcao) {
                case 1:
                    cadastrarCliente();
                    break;
                case 2:
                    buscarCliente();
                    break;
                case 3:
                    listarClientes();
                    break;
                case 0:
                    System.out.println("Voltando ao Menu Principal...");
                    break;
                default:
                    System.out.println("Opção inválida. Tente novamente.");
            }
        } while (opcao != 0);
    }

    private void cadastrarCliente() {
        System.out.println("\n--- Cadastrar Novo Cliente ---");
        System.out.print("CPF: ");
        String cpf = scanner.nextLine();
        System.out.print("Nome: ");
        String nome = scanner.nextLine();
        System.out.print("Email: ");
        String email = scanner.nextLine();
        System.out.print("Telefone: ");
        String telefone = scanner.nextLine();

        try {
            administradorSistema.cadastrarCliente(cpf, nome, email, telefone);
            System.out.println("Cliente cadastrado com sucesso!");
        } catch (ClienteJaCadastradoException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }

    private void buscarCliente() {
        System.out.println("\n--- Buscar Cliente por CPF ---");
        System.out.print("CPF do cliente: ");
        String cpf = scanner.nextLine();

        try {
            Cliente cliente = administradorSistema.buscarCliente(cpf);
            System.out.println("Cliente encontrado:\n" + cliente);
        } catch (ClienteNaoEncontradoException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }

    private void listarClientes() {
        System.out.println("\n--- Lista de Clientes ---");
        if (administradorSistema.listarClientes().isEmpty()) {
            System.out.println("Nenhum cliente cadastrado.");
        } else {
            administradorSistema.listarClientes().forEach(System.out::println);
        }
    }
}
