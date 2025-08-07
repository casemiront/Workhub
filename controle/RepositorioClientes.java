package controle;

import entidades.Cliente;
import excecoes.FalhaPersistenciaException;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class RepositorioClientes implements Serializable {
    private static final long serialVersionUID = 1L;
    private Map<String, Cliente> clientes = new HashMap<>();
    private final String CAMINHO_ARQUIVO = "clientes.dat";

    public RepositorioClientes() {
        carregarArquivo();
    }

    public void adicionarCliente(Cliente cliente) {
        clientes.put(cliente.getCpf(), cliente);
        salvarArquivo();
    }

    public Cliente buscarCliente(String cpf) {
        return clientes.get(cpf);
    }

    public void removerCliente(String cpf) {
        clientes.remove(cpf);
        salvarArquivo();
    }

    public Map<String, Cliente> getClientes() {
        return clientes;
    }

    private void salvarArquivo() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(CAMINHO_ARQUIVO))) {
            oos.writeObject(clientes);
        } catch (IOException e) {
            System.err.println("Erro ao salvar clientes: " + e.getMessage());
            // Em um sistema real, você relançaria uma FalhaPersistenciaException aqui
        }
    }

    private void carregarArquivo() {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(CAMINHO_ARQUIVO))) {
            clientes = (Map<String, Cliente>) ois.readObject();
        } catch (FileNotFoundException e) {
            System.out.println("Arquivo de clientes não encontrado. Criando novo repositório.");
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Erro ao carregar clientes: " + e.getMessage());
            // Em um sistema real, você relançaria uma FalhaPersistenciaException aqui
        }
    }
}