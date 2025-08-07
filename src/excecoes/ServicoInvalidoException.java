package excecoes;

public class ServicoInvalidoException extends Exception {
    private static final long serialVersionUID = 1L;

    public ServicoInvalidoException(String message) {
        super(message);
    }
}
