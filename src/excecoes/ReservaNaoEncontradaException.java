package excecoes;

public class ReservaNaoEncontradaException extends Exception {
    private static final long serialVersionUID = 1L;

    public ReservaNaoEncontradaException(String message) {
        super(message);
    }
}