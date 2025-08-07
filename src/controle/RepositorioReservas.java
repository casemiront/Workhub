package controle;

import entidades.Reserva;
import excecoes.FalhaPersistenciaException;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class RepositorioReservas implements Serializable {
    private static final long serialVersionUID = 1L;
    private Map<Integer, Reserva> reservas = new HashMap<>();
    private final String CAMINHO_ARQUIVO = "reservas.dat";

    public RepositorioReservas() {
        carregarArquivo();
    }

    public void adicionarReserva(Reserva reserva) {
        reservas.put(reserva.getId(), reserva);
        salvarArquivo();
    }

    public Reserva buscarReserva(int id) {
        return reservas.get(id);
    }

    public void removerReserva(int id) {
        reservas.remove(id);
        salvarArquivo();
    }

    public Map<Integer, Reserva> getReservas() {
        return reservas;
    }

    private void salvarArquivo() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(CAMINHO_ARQUIVO))) {
            oos.writeObject(reservas);
        } catch (IOException e) {
            System.err.println("Erro ao salvar reservas: " + e.getMessage());
            // Em um sistema real, você relançaria uma FalhaPersistenciaException aqui
        }
    }

    private void carregarArquivo() {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(CAMINHO_ARQUIVO))) {
            reservas = (Map<Integer, Reserva>) ois.readObject();
        } catch (FileNotFoundException e) {
            System.out.println("Arquivo de reservas não encontrado. Criando novo repositório.");
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Erro ao carregar reservas: " + e.getMessage());
            // Em um sistema real, você relançaria uma FalhaPersistenciaException aqui
        }
    }
}