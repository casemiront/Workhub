import controle.AdministradorSistema;
import fronteira.MenuPrincipal;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        AdministradorSistema administradorSistema = new AdministradorSistema();
        MenuPrincipal menuPrincipal = new MenuPrincipal(administradorSistema, scanner);

        menuPrincipal.exibirMenu();

        scanner.close();
    }
}
