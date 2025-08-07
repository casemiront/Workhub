package excecoes;

public class ClienteJaCadastradoException extends Exception {
    private static final long serialVersionUID = 1L;

    public ClienteJaCadastradoException(String message) {
        super(message);
    }
}
