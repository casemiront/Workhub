package controle;

import entidades.Espaco;
import excecoes.FalhaPersistenciaException;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class RepositorioEspacos implements Serializable {
    private static final long serialVersionUID = 1L;
    private Map<String, Espaco> espacos = new HashMap<>();
    private final String CAMINHO_ARQUIVO = "espacos.dat";

    public RepositorioEspacos() {
        carregarArquivo();
    }

    public void adicionarEspaco(Espaco espaco) {
        espacos.put(espaco.getId(), espaco);
        salvarArquivo();
    }

    public Espaco buscarEspaco(String id) {
        return espacos.get(id);
    }

    public void removerEspaco(String id) {
        espacos.remove(id);
        salvarArquivo();
    }

    public Map<String, Espaco> getEspacos() {
        return espacos;
    }

    private void salvarArquivo() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(CAMINHO_ARQUIVO))) {
            oos.writeObject(espacos);
        } catch (IOException e) {
            System.err.println("Erro ao salvar espaços: " + e.getMessage());
            // Em um sistema real, você relançaria uma FalhaPersistenciaException aqui
        }
    }

    private void carregarArquivo() {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(CAMINHO_ARQUIVO))) {
            espacos = (Map<String, Espaco>) ois.readObject();
        } catch (FileNotFoundException e) {
            System.out.println("Arquivo de espaços não encontrado. Criando novo repositório.");
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Erro ao carregar espaços: " + e.getMessage());
            // Em um sistema real, você relançaria uma FalhaPersistenciaException aqui
        }
    }
}